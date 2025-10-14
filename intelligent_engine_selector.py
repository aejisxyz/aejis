#!/usr/bin/env python3
"""
Intelligent Engine Selector - VirusTotal Integration
Uses VirusTotal API for comprehensive malware scanning with 70+ engines
"""

import time
import logging
import os
from typing import Dict, List, Any, Optional

from virustotal_engine import scan_with_virustotal

logger = logging.getLogger(__name__)

class IntelligentEngineSelector:
    """VirusTotal-powered intelligent engine selector"""
    
    def __init__(self):
        self.engine_results = {}
        self.performance_metrics = {}
        
    def select_engines_for_analysis(self, file_path: str, threat_level: str = "medium", 
                                  max_engines: int = 25) -> List[str]:
        """Select VirusTotal as the primary engine (70+ engines in one)"""
        try:
            # VirusTotal provides 70+ engines, so we just return it as our "selected engine"
            selected_engines = ["virustotal"]
            
            logger.info(f"Selected Aejis Advanced Engine for comprehensive analysis (70+ engines)")
            return selected_engines
            
        except Exception as e:
            logger.error(f"Engine selection failed: {e}")
            return ["virustotal"]
    
    def run_comprehensive_analysis(self, file_path: str, threat_level: str = "medium") -> Dict[str, Any]:
        """Run comprehensive analysis using VirusTotal API"""
        start_time = time.time()
        
        # Select engines (just VirusTotal)
        selected_engines = self.select_engines_for_analysis(file_path, threat_level)
        
        # Initialize results
        analysis_results = {
            "file_path": file_path,
            "selected_engines": selected_engines,
            "engine_results": {},
            "threat_detections": [],
            "overall_threat_score": 0,
            "confidence_level": 0,
            "analysis_time": 0,
            "engines_used": [],
            "threat_explanations": []
        }
        
        try:
            logger.info(f"🔍 Starting Aejis Advanced Engine comprehensive analysis: {os.path.basename(file_path)}")
            
            # Run VirusTotal scan
            vt_result = scan_with_virustotal(file_path)
            
            if vt_result['status'] == 'completed':
                # Process VirusTotal results
                analysis_results["engine_results"]["virustotal"] = vt_result
                analysis_results["engines_used"] = ["virustotal"]
                
                # Extract threat information
                if vt_result.get("threat_detected", False):
                    analysis_results["threat_detections"] = vt_result.get("detected_engines", [])
                    analysis_results["threat_explanations"] = vt_result.get("threat_explanations", [])
                
                # Set scores
                analysis_results["overall_threat_score"] = vt_result.get("threat_score", 0)
                analysis_results["confidence_level"] = vt_result.get("confidence", 0)
                
                logger.info(f"✅ Aejis Advanced Engine analysis completed: {vt_result.get('engines_detected', 0)}/{vt_result.get('engines_used', 0)} engines detected threats")
                
            elif vt_result['status'] == 'timeout':
                # Handle timeout case - still process partial results
                logger.warning(f"⚠️ Aejis Advanced Engine analysis timeout, using partial results")
                analysis_results["engine_results"]["virustotal"] = vt_result
                analysis_results["engines_used"] = ["virustotal"]
                
                # Extract threat information from partial results
                if vt_result.get("threat_detected", False):
                    analysis_results["threat_detections"] = vt_result.get("detected_engines", [])
                    analysis_results["threat_explanations"] = vt_result.get("threat_explanations", [])
                
                # Set scores
                analysis_results["overall_threat_score"] = vt_result.get("threat_score", 0)
                analysis_results["confidence_level"] = vt_result.get("confidence", 0)
                
                logger.info(f"⚠️ Aejis Advanced Engine partial analysis: {vt_result.get('engines_detected', 0)}/{vt_result.get('engines_used', 0)} engines detected threats")
                
            elif vt_result['status'] == 'fallback':
                # Handle fallback case - API completely unavailable
                logger.warning(f"⚠️ Aejis Advanced Engine in fallback mode: {vt_result.get('error', 'Unknown error')}")
                analysis_results["engine_results"]["virustotal"] = vt_result
                analysis_results["engines_used"] = ["virustotal"]
                analysis_results["overall_threat_score"] = vt_result.get("threat_score", 0)
                analysis_results["confidence_level"] = vt_result.get("confidence", 50)
                analysis_results["threat_explanations"] = vt_result.get("threat_explanations", [])
                
            elif vt_result['status'] == 'error':
                logger.error(f"❌ Aejis Advanced Engine scan failed: {vt_result.get('error', 'Unknown error')}")
                analysis_results["engine_results"]["virustotal"] = vt_result
                analysis_results["engines_used"] = ["virustotal"]
                analysis_results["error"] = vt_result.get('error', 'Aejis Advanced Engine scan failed')
            
            analysis_results["analysis_time"] = round(time.time() - start_time, 2)
            
            logger.info(f"Comprehensive analysis completed in {analysis_results['analysis_time']}s using Aejis Advanced Engine (70+ engines)")
            
        except Exception as e:
            logger.error(f"Comprehensive analysis failed: {e}")
            analysis_results["error"] = str(e)
            analysis_results["analysis_time"] = round(time.time() - start_time, 2)
        
        return analysis_results
    
    def get_engine_info(self, engine_id: str) -> Dict[str, Any]:
        """Get engine information (VirusTotal info)"""
        if engine_id == "virustotal":
            return {
                "id": "virustotal",
                "name": "Aejis Advanced Engine",
                "description": "Proprietary comprehensive malware scanning with 70+ advanced detection engines",
                "category": "comprehensive",
                "is_available": True,
                "engines_count": 70,
                "supported_formats": ["all"],
                "api_provider": "Aejis"
            }
        return None
    
    def get_available_engines(self) -> List[str]:
        """Get list of available engines (just VirusTotal)"""
        return ["virustotal"]
    
    def get_engine_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for engines"""
        return {
            "virustotal": {
                "total_scans": self.performance_metrics.get("virustotal_scans", 0),
                "average_time": self.performance_metrics.get("virustotal_avg_time", 0),
                "success_rate": self.performance_metrics.get("virustotal_success_rate", 100),
                "engines_used": 70
            }
        }
    
    def update_performance_metrics(self, engine_id: str, scan_time: float, success: bool):
        """Update performance metrics for an engine"""
        if engine_id == "virustotal":
            if "virustotal_scans" not in self.performance_metrics:
                self.performance_metrics["virustotal_scans"] = 0
                self.performance_metrics["virustotal_total_time"] = 0
                self.performance_metrics["virustotal_successes"] = 0
            
            self.performance_metrics["virustotal_scans"] += 1
            self.performance_metrics["virustotal_total_time"] += scan_time
            if success:
                self.performance_metrics["virustotal_successes"] += 1
            
            # Calculate averages
            self.performance_metrics["virustotal_avg_time"] = (
                self.performance_metrics["virustotal_total_time"] / 
                self.performance_metrics["virustotal_scans"]
            )
            self.performance_metrics["virustotal_success_rate"] = (
                self.performance_metrics["virustotal_successes"] / 
                self.performance_metrics["virustotal_scans"] * 100
            )

# Global instance
intelligent_selector = IntelligentEngineSelector()