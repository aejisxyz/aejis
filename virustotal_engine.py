"""
VirusTotal Engine - Comprehensive malware scanning using 70+ antivirus engines
Replaces the current multi-engine system with VirusTotal's proven API
"""

import requests
import time
import hashlib
import logging
from typing import Dict, List, Optional, Any
import os

logger = logging.getLogger(__name__)

class VirusTotalEngine:
    """VirusTotal API integration for comprehensive malware scanning"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://www.virustotal.com/vtapi/v2"
        self.max_file_size = 32 * 1024 * 1024  # 32MB limit for VirusTotal
        
    def scan_file(self, file_path: str) -> Dict[str, Any]:
        """
        Scan file with 70+ antivirus engines via VirusTotal API
        
        Args:
            file_path: Path to file to scan
            
        Returns:
            Dict containing comprehensive scan results
        """
        try:
            # Check file size
            file_size = os.path.getsize(file_path)
            if file_size > self.max_file_size:
                return {
                    'status': 'error',
                    'error': f'File too large ({file_size} bytes). VirusTotal limit: {self.max_file_size} bytes',
                    'threat_detected': False,
                    'confidence': 0
                }
            
            logger.info(f"🔍 Starting Aejis Advanced Engine scan: {os.path.basename(file_path)} ({file_size} bytes)")
            
            # Step 1: Upload file to VirusTotal
            upload_result = self._upload_file(file_path)
            if upload_result['status'] == 'error':
                return upload_result
                
            scan_id = upload_result['scan_id']
            logger.info(f"📤 File uploaded successfully. Scan ID: {scan_id}")
            
            # Step 2: Wait for analysis and get results
            scan_result = self._get_scan_results(scan_id)
            if scan_result['status'] != 'success':
                # Handle error, timeout, or any other non-success status
                return scan_result
                
            # Step 3: Process and format results
            return self._process_results(scan_result['data'], file_path)
            
        except Exception as e:
            logger.error(f"❌ Aejis Advanced Engine scan error: {str(e)}")
            # Return a fallback result instead of complete failure
            return {
                'status': 'fallback',
                'error': str(e),
                'threat_detected': False,
                'threat_score': 0,
                'confidence': 50,
                'engines_used': 0,
                'engines_detected': 0,
                'threat_explanations': [f"• Analysis temporarily unavailable: {str(e)}"],
                'fallback_mode': True
            }
    
    def _upload_file(self, file_path: str) -> Dict[str, Any]:
        """Upload file to VirusTotal for scanning"""
        try:
            upload_url = f"{self.base_url}/file/scan"
            
            with open(file_path, 'rb') as file:
                files = {'file': file}
                params = {'apikey': self.api_key}
                
                response = requests.post(upload_url, files=files, params=params, timeout=60)
                response.raise_for_status()
                
                result = response.json()
                
                if result.get('response_code') == 1:
                    return {
                        'status': 'success',
                        'scan_id': result['scan_id'],
                        'permalink': result['permalink']
                    }
                else:
                    return {
                        'status': 'error',
                        'error': f"Upload failed: {result.get('verbose_msg', 'Unknown error')}"
                    }
                    
        except requests.exceptions.RequestException as e:
            return {
                'status': 'error',
                'error': f"Network error during upload: {str(e)}"
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': f"Upload error: {str(e)}"
            }
    
    def _get_scan_results(self, scan_id: str) -> Dict[str, Any]:
        """Get scan results from VirusTotal (simple approach)"""
        try:
            report_url = f"{self.base_url}/file/report"
            params = {'apikey': self.api_key, 'resource': scan_id}
            
            attempt = 0
            while attempt < 60:  # Simple retry limit instead of time-based timeout
                attempt += 1
                try:
                    response = requests.get(report_url, params=params)
                    response.raise_for_status()
                    
                    if not response.text.strip():
                        logger.info(f"⏳ VirusTotal processing... (attempt {attempt})")
                        time.sleep(10)
                        continue
                    
                    result = response.json()
                    
                    if result.get('response_code') == 1:
                        # Analysis complete!
                        logger.info(f"✅ VirusTotal analysis completed")
                        return {
                            'status': 'success',
                            'data': result
                        }
                    elif result.get('response_code') == -2:
                        # Still scanning
                        logger.info(f"⏳ VirusTotal scanning... (attempt {attempt})")
                        time.sleep(15)
                        continue
                    else:
                        return {
                            'status': 'error',
                            'error': f"Scan failed: {result.get('verbose_msg', 'Unknown error')}"
                        }
                        
                except requests.exceptions.RequestException as e:
                    logger.warning(f"⚠️ Request error (attempt {attempt}): {e}")
                    time.sleep(10)
                    continue
                    
            # Max attempts reached
            logger.warning(f"⚠️ VirusTotal analysis max attempts reached")
            return {
                'status': 'error',
                'error': 'VirusTotal analysis took too long - please try again later'
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'status': 'error',
                'error': f"Network error during result retrieval: {str(e)}"
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': f"Result retrieval error: {str(e)}"
            }
    
    def _process_results(self, vt_data: Dict[str, Any], file_path: str) -> Dict[str, Any]:
        """Process VirusTotal results into our standard format"""
        try:
            scans = vt_data.get('scans', {})
            positives = vt_data.get('positives', 0)
            total = vt_data.get('total', 0)
            
            # Calculate threat score and confidence
            threat_score = (positives / total * 100) if total > 0 else 0
            confidence = min(95, max(60, threat_score + 20))  # Base confidence on detection rate
            
            # Determine threat level
            if positives == 0:
                threat_level = "CLEAN"
            elif positives <= 2:
                threat_level = "LOW"
            elif positives <= 5:
                threat_level = "MEDIUM"
            elif positives <= 10:
                threat_level = "HIGH"
            else:
                threat_level = "CRITICAL"
            
            # Get detailed engine results
            engine_results = {}
            detected_engines = []
            
            for engine_name, result in scans.items():
                engine_results[engine_name] = {
                    'detected': result.get('detected', False),
                    'result': result.get('result', 'Clean'),
                    'version': result.get('version', 'Unknown'),
                    'update': result.get('update', 'Unknown')
                }
                
                if result.get('detected', False):
                    detected_engines.append({
                        'engine': engine_name,
                        'threat_name': result.get('result', 'Unknown'),
                        'version': result.get('version', 'Unknown')
                    })
            
            # Generate threat explanations
            threat_explanations = []
            if detected_engines:
                threat_explanations.append(
                    f"• Aejis Advanced Engine Detection: {positives}/{total} engines detected threats. "
                    f"Top detections: {', '.join([d['threat_name'] for d in detected_engines[:3]])}"
                )
            
            # Get file info
            file_info = {
                'md5': vt_data.get('md5', ''),
                'sha1': vt_data.get('sha1', ''),
                'sha256': vt_data.get('sha256', ''),
                'file_size': vt_data.get('size', 0),
                'file_type': vt_data.get('type', 'Unknown')
            }
            
            logger.info(f"✅ Aejis Advanced Engine scan completed: {positives}/{total} engines detected threats")
            
            return {
                'status': 'completed',
                'threat_detected': positives > 0,
                'threat_level': threat_level,
                'threat_score': threat_score,
                'confidence': confidence,
                'engines_used': total,
                'engines_detected': positives,
                'engine_results': engine_results,
                'detected_engines': detected_engines,
                'threat_explanations': threat_explanations,
                'file_info': file_info,
                'scan_date': vt_data.get('scan_date', ''),
                'permalink': vt_data.get('permalink', ''),
                'analysis_time': 0,  # VirusTotal handles timing
                'scan_summary': {
                    'total_engines': total,
                    'detections': positives,
                    'threat_level': threat_level,
                    'top_threats': [d['threat_name'] for d in detected_engines[:5]]
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Error processing VirusTotal results: {str(e)}")
            return {
                'status': 'error',
                'error': f"Result processing error: {str(e)}",
                'threat_detected': False,
                'confidence': 0
            }
    
    def get_file_reputation(self, file_hash: str) -> Dict[str, Any]:
        """Get file reputation by hash (for files already scanned)"""
        try:
            report_url = f"{self.base_url}/file/report"
            params = {'apikey': self.api_key, 'resource': file_hash}
            
            response = requests.get(report_url, params=params, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('response_code') == 1:
                return self._process_results(result, '')
            else:
                return {
                    'status': 'not_found',
                    'error': 'File not found in VirusTotal database',
                    'threat_detected': False,
                    'confidence': 0
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'threat_detected': False,
                'confidence': 0
            }

# Global instance
VIRUSTOTAL_API_KEY = "9c5dfee6a04d5fad34080650977946a92bb4d6a88ee6252eca305b1636f763d8"
virustotal_engine = VirusTotalEngine(VIRUSTOTAL_API_KEY)

def scan_with_virustotal(file_path: str) -> Dict[str, Any]:
    """Convenience function for VirusTotal scanning"""
    return virustotal_engine.scan_file(file_path)
