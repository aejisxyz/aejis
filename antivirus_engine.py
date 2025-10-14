#!/usr/bin/env python3
"""
Advanced Antivirus Engine for Aejis Bot
Comprehensive malware detection using multiple detection methods
"""

import hashlib
import os
import re
import math
import struct
import zipfile
import rarfile
import tarfile
import json
import time
import logging
from typing import Dict, Any, List, Tuple, Optional
from collections import Counter
import subprocess
import tempfile

# Import the new intelligent engine system
from intelligent_engine_selector import IntelligentEngineSelector
from engine_registry import EngineRegistry, FileType

logger = logging.getLogger(__name__)

class AntivirusEngine:
    """Advanced antivirus engine with multiple detection methods"""
    
    def __init__(self):
        """Initialize the antivirus engine"""
        self.malware_signatures = self._load_malware_signatures()
        self.suspicious_strings = self._load_suspicious_strings()
        self.crypto_indicators = self._load_crypto_indicators()
        # Reputation checking now handled by VirusTotal API
        
        # Initialize intelligent engine system
        self.intelligent_selector = IntelligentEngineSelector()
        self.engine_registry = EngineRegistry()
        logger.info(f"🚀 Initialized {len(self.engine_registry.get_available_engines())} intelligent engines")
        
    def _load_malware_signatures(self) -> Dict[str, str]:
        """Load known malware signatures (MD5, SHA256 hashes)"""
        return {
            # Common crypto malware signatures
            "a1b2c3d4e5f6789": "CryptoLocker.Ransomware",
            "b2c3d4e5f6789a1": "BitcoinMiner.Trojan",
            "c3d4e5f6789a1b2": "WalletStealer.Generic",
            "d4e5f6789a1b2c3": "ClipboardHijacker.Win32",
            "e5f6789a1b2c3d4": "CryptoPhishing.JS",
            
            # Add more known malware hashes here
            # These would be updated from threat intelligence feeds
        }
    
    def _load_suspicious_strings(self) -> List[str]:
        """Load suspicious strings and patterns"""
        return [
            # Crypto-related suspicious strings
            r"bitcoin.*wallet.*steal",
            r"cryptocurrency.*private.*key",
            r"metamask.*seed.*phrase",
            r"wallet\.dat",
            r"crypto.*mining.*script",
            r"clipboard.*replace.*address",
            r"ethereum.*private.*key",
            r"binance.*api.*key",
            r"coinbase.*credentials",
            r"crypto.*exchange.*hack",
            
            # General malware indicators
            r"keylogger.*install",
            r"remote.*access.*trojan",
            r"backdoor.*connection",
            r"rootkit.*hide",
            r"ransomware.*encrypt",
            r"trojan.*download",
            r"malware.*execute",
            r"virus.*infect",
            r"spyware.*monitor",
            r"adware.*inject",
            
            # Suspicious system calls
            r"CreateRemoteThread",
            r"WriteProcessMemory",
            r"VirtualAllocEx",
            r"SetWindowsHookEx",
            r"RegCreateKey",
            r"RegSetValue",
            r"CreateProcess",
            r"ShellExecute",
            
            # Network suspicious activity
            r"http.*\d+\.\d+\.\d+\.\d+",  # Direct IP connections
            r"socket.*connect.*\d+",
            r"download.*execute",
            r"curl.*wget.*powershell",
            
            # File system suspicious activity
            r"temp.*exe.*run",
            r"appdata.*roaming.*crypto",
            r"startup.*folder.*add",
            r"system32.*replace"
        ]
    
    def _load_crypto_indicators(self) -> List[str]:
        """Load crypto-specific threat indicators"""
        return [
            # Wallet patterns
            r"[13][a-km-zA-HJ-NP-Z1-9]{25,34}",  # Bitcoin addresses
            r"0x[a-fA-F0-9]{40}",  # Ethereum addresses
            r"bc1[a-z0-9]{39,59}",  # Bitcoin Bech32
            r"bnb[a-zA-Z0-9]{39}",  # Binance addresses
            
            # Private key patterns
            r"[0-9a-fA-F]{64}",  # 64-char hex (potential private key)
            r"[KL][1-9A-HJ-NP-Za-km-z]{51}",  # Bitcoin WIF private key
            r"5[HJK][1-9A-HJ-NP-Za-km-z]{49}",  # Bitcoin WIF uncompressed
            
            # Seed phrase patterns
            r"(\w+\s+){11,23}\w+",  # 12-24 word patterns
            r"mnemonic.*phrase",
            r"seed.*words",
            r"recovery.*phrase",
            
            # Exchange API patterns
            r"api.*key.*secret",
            r"access.*token.*crypto",
            r"binance.*api",
            r"coinbase.*key",
            r"kraken.*secret"
        ]
    
    # Reputation database removed - now handled by VirusTotal API
    
    def calculate_file_entropy(self, file_path: str) -> float:
        """Calculate file entropy to detect packed/encrypted files"""
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            if not data:
                return 0.0
            
            # Calculate byte frequency
            byte_counts = Counter(data)
            entropy = 0.0
            
            for count in byte_counts.values():
                probability = count / len(data)
                if probability > 0:
                    entropy -= probability * math.log2(probability)
            
            return entropy
            
        except Exception as e:
            logger.error(f"Error calculating entropy: {e}")
            return 0.0
    
    def analyze_pe_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze PE (Portable Executable) files"""
        pe_analysis = {
            "is_pe": False,
            "suspicious_sections": [],
            "imports": [],
            "exports": [],
            "entry_point": None,
            "risk_score": 0
        }
        
        try:
            with open(file_path, 'rb') as f:
                # Check PE signature
                data = f.read(2048)
                
                if data.startswith(b'MZ'):
                    pe_analysis["is_pe"] = True
                    
                    # Look for suspicious imports
                    suspicious_apis = [
                        b"CreateRemoteThread", b"WriteProcessMemory", b"VirtualAllocEx",
                        b"SetWindowsHookEx", b"RegCreateKey", b"RegSetValue",
                        b"CryptAcquireContext", b"CryptGenKey", b"WinExec"
                    ]
                    
                    for api in suspicious_apis:
                        if api in data:
                            pe_analysis["imports"].append(api.decode('utf-8', errors='ignore'))
                            pe_analysis["risk_score"] += 10
                    
                    # Check for packed sections (high entropy sections)
                    if self.calculate_file_entropy(file_path) > 7.5:
                        pe_analysis["suspicious_sections"].append("High entropy - possibly packed")
                        pe_analysis["risk_score"] += 20
                    
                    # Look for crypto-related strings
                    for pattern in self.crypto_indicators:
                        if re.search(pattern.encode(), data, re.IGNORECASE):
                            pe_analysis["risk_score"] += 15
            
            return pe_analysis
            
        except Exception as e:
            logger.error(f"Error analyzing PE file: {e}")
            return pe_analysis
    
    def deep_archive_scan(self, file_path: str) -> Dict[str, Any]:
        """Deep scan archive files recursively"""
        archive_analysis = {
            "is_archive": False,
            "files_count": 0,
            "suspicious_files": [],
            "nested_archives": [],
            "risk_score": 0
        }
        
        try:
            # Detect archive type and extract
            extracted_files = []
            
            if zipfile.is_zipfile(file_path):
                archive_analysis["is_archive"] = True
                with zipfile.ZipFile(file_path, 'r') as zf:
                    file_list = zf.namelist()
                    archive_analysis["files_count"] = len(file_list)
                    
                    # Extract to temporary directory for analysis
                    with tempfile.TemporaryDirectory() as temp_dir:
                        for file_name in file_list[:50]:  # Limit extraction for safety
                            try:
                                zf.extract(file_name, temp_dir)
                                extracted_path = os.path.join(temp_dir, file_name)
                                if os.path.isfile(extracted_path):
                                    extracted_files.append(extracted_path)
                            except:
                                continue
            
            elif file_path.lower().endswith(('.rar', '.7z')):
                archive_analysis["is_archive"] = True
                # Basic RAR analysis (would need rarfile library)
                archive_analysis["risk_score"] += 5  # RAR files are less common, slightly suspicious
            
            # Analyze extracted files
            for extracted_file in extracted_files:
                file_analysis = self.scan_file_signatures(extracted_file)
                
                if file_analysis["threat_detected"]:
                    archive_analysis["suspicious_files"].append({
                        "file": os.path.basename(extracted_file),
                        "threat": file_analysis["threat_type"]
                    })
                    archive_analysis["risk_score"] += 30
                
                # Check for nested archives
                if any(extracted_file.lower().endswith(ext) for ext in ['.zip', '.rar', '.7z', '.tar']):
                    archive_analysis["nested_archives"].append(os.path.basename(extracted_file))
                    archive_analysis["risk_score"] += 10
            
            return archive_analysis
            
        except Exception as e:
            logger.error(f"Error scanning archive: {e}")
            return archive_analysis
    
    def scan_file_signatures(self, file_path: str) -> Dict[str, Any]:
        """Signature-based malware detection"""
        signature_result = {
            "threat_detected": False,
            "threat_type": None,
            "signature_match": None,
            "confidence": 0
        }
        
        try:
            # Calculate file hashes
            with open(file_path, 'rb') as f:
                data = f.read()
                md5_hash = hashlib.md5(data).hexdigest()
                sha256_hash = hashlib.sha256(data).hexdigest()
            
            # Check against known malware signatures
            if md5_hash in self.malware_signatures:
                signature_result["threat_detected"] = True
                signature_result["threat_type"] = self.malware_signatures[md5_hash]
                signature_result["signature_match"] = f"MD5: {md5_hash}"
                signature_result["confidence"] = 95
            
            elif sha256_hash in self.malware_signatures:
                signature_result["threat_detected"] = True
                signature_result["threat_type"] = self.malware_signatures[sha256_hash]
                signature_result["signature_match"] = f"SHA256: {sha256_hash}"
                signature_result["confidence"] = 95
            
            return signature_result
            
        except Exception as e:
            logger.error(f"Error in signature scanning: {e}")
            return signature_result
    
    def heuristic_analysis(self, file_path: str) -> Dict[str, Any]:
        """Heuristic analysis for unknown threats"""
        heuristic_result = {
            "suspicious_patterns": [],
            "risk_indicators": [],
            "heuristic_score": 0,
            "threat_probability": 0
        }
        
        try:
            # Skip heuristic analysis for binary media files to prevent false positives
            file_ext = os.path.splitext(file_path)[1].lower()
            binary_media_extensions = {
                # ========== IMAGES ==========
                '.jpg', '.jpeg', '.jpe', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp',
                '.svg', '.svgz', '.ico', '.cur', '.psd', '.ai', '.eps', '.ps', '.indd', 
                '.sketch', '.xcf', '.fig', '.raw', '.cr2', '.nef', '.arw', '.dng', '.orf', 
                '.rw2', '.pef',
                
                # ========== VIDEOS ==========
                '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v', '.3gp', 
                '.3g2', '.asf', '.vob', '.ts', '.m2ts', '.mts', '.divx', '.xvid', '.rm', 
                '.rmvb', '.f4v', '.ogv', '.mxf',
                
                # ========== AUDIO ==========
                '.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus', '.webm',
                '.aiff', '.aif', '.au', '.snd', '.mid', '.midi', '.kar', '.ra', '.3ga',
                '.amr', '.awb', '.ape',
                
                # ========== DOCUMENTS (binary formats) ==========
                '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods',
                '.odp', '.odg', '.pages', '.numbers', '.key', '.epub', '.mobi', '.azw',
                
                # ========== TEXT FILES (legitimate formats) ==========
                '.txt', '.rtf', '.md', '.log', '.cfg', '.ini', '.conf', '.config', '.xml',
                '.json', '.csv', '.tsv', '.sql', '.sh', '.bat', '.cmd', '.ps1', '.py',
                '.js', '.html', '.css', '.php', '.java', '.cpp', '.c', '.h', '.hpp',
                '.cs', '.vb', '.swift', '.go', '.rs', '.rb', '.pl', '.lua', '.r',
                '.m', '.scala', '.kt', '.dart', '.ts', '.jsx', '.vue', '.svelte',
                
                # ========== ARCHIVES ==========
                '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.lz', '.cab', '.iso',
                '.dmg', '.jar', '.war', '.deb', '.rpm', '.msi',
                
                # ========== 3D/CAD ==========
                '.obj', '.fbx', '.dae', '.3ds', '.max', '.blend', '.ma', '.mb', '.c4d',
                '.dwg', '.dxf', '.step', '.stp', '.iges', '.igs', '.stl', '.ply', '.x3d',
                
                # ========== FONTS ==========
                '.ttf', '.otf', '.woff', '.woff2', '.eot',
                
                # ========== DATABASES ==========
                '.db', '.sqlite', '.sqlite3', '.mdb', '.accdb',
                
                # ========== SCIENTIFIC ==========
                '.mat', '.hdf', '.h5', '.nc', '.fits', '.nii',
                
                # ========== VIRTUAL MACHINES ==========
                '.vmdk', '.vdi', '.qcow2', '.vhd',
                
                # ========== CRYPTO/BLOCKCHAIN ==========
                '.wallet', '.dat'
            }
            
            if file_ext in binary_media_extensions:
                heuristic_result["skipped_reason"] = f"Binary media file ({file_ext}) - heuristic analysis not applicable"
                return heuristic_result
            
            with open(file_path, 'rb') as f:
                data = f.read(100000)  # Read first 100KB for analysis
                # Only analyze text-based files or executable formats
                try:
                    text_data = data.decode('utf-8', errors='strict').lower()
                except UnicodeDecodeError:
                    # If it's not valid UTF-8, it's likely binary - skip text analysis
                    heuristic_result["skipped_reason"] = "Binary file detected - text pattern analysis not applicable"
                    return heuristic_result
            
            # Pattern matching against suspicious strings (only for text files)
            for pattern in self.suspicious_strings:
                matches = re.findall(pattern, text_data, re.IGNORECASE)
                if matches:
                    heuristic_result["suspicious_patterns"].append({
                        "pattern": pattern,
                        "matches": len(matches)
                    })
                    heuristic_result["heuristic_score"] += len(matches) * 5
            
            # Crypto-specific pattern detection
            for crypto_pattern in self.crypto_indicators:
                crypto_matches = re.findall(crypto_pattern, text_data, re.IGNORECASE)
                if crypto_matches:
                    heuristic_result["risk_indicators"].append({
                        "type": "crypto_pattern",
                        "pattern": crypto_pattern,
                        "matches": len(crypto_matches)
                    })
                    heuristic_result["heuristic_score"] += len(crypto_matches) * 10
            
            # File structure analysis
            file_size = len(data)
            
            # Very small files with high functionality claims are suspicious
            if file_size < 1024 and any(word in text_data for word in ["bitcoin", "wallet", "crypto", "mining"]):
                heuristic_result["risk_indicators"].append({
                    "type": "size_anomaly",
                    "description": "Small file with crypto functionality claims"
                })
                heuristic_result["heuristic_score"] += 15
            
            # Calculate threat probability
            if heuristic_result["heuristic_score"] > 50:
                heuristic_result["threat_probability"] = min(95, heuristic_result["heuristic_score"])
            else:
                heuristic_result["threat_probability"] = heuristic_result["heuristic_score"]
            
            return heuristic_result
            
        except Exception as e:
            logger.error(f"Error in heuristic analysis: {e}")
            return heuristic_result
    
    def behavioral_analysis(self, file_path: str) -> Dict[str, Any]:
        """Behavioral analysis simulation"""
        behavioral_result = {
            "suspicious_behaviors": [],
            "system_changes": [],
            "network_activity": [],
            "behavioral_score": 0
        }
        
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
                text_content = data.decode('utf-8', errors='ignore')
            
            # Simulate behavioral analysis by looking for behavioral indicators
            behavioral_indicators = {
                "file_modification": [
                    r"modify.*system.*file",
                    r"delete.*security.*software",
                    r"disable.*antivirus",
                    r"change.*hosts.*file"
                ],
                "registry_modification": [
                    r"registry.*modify",
                    r"startup.*program.*add",
                    r"security.*disable",
                    r"firewall.*turn.*off"
                ],
                "network_communication": [
                    r"connect.*remote.*server",
                    r"download.*additional.*payload",
                    r"send.*data.*external",
                    r"establish.*backdoor"
                ],
                "crypto_specific": [
                    r"scan.*wallet.*files",
                    r"monitor.*clipboard.*bitcoin",
                    r"replace.*crypto.*address",
                    r"steal.*private.*keys"
                ]
            }
            
            for behavior_type, patterns in behavioral_indicators.items():
                for pattern in patterns:
                    if re.search(pattern, text_content, re.IGNORECASE):
                        behavioral_result["suspicious_behaviors"].append({
                            "type": behavior_type,
                            "pattern": pattern
                        })
                        behavioral_result["behavioral_score"] += 20
            
            return behavioral_result
            
        except Exception as e:
            logger.error(f"Error in behavioral analysis: {e}")
            return behavioral_result
    
    # Reputation check method removed - now handled by VirusTotal API
    
    def _get_file_type_category(self, file_ext: str) -> str:
        """Categorize file extension into file type categories"""
        text_extensions = {'.txt', '.log', '.cfg', '.ini', '.conf', '.config', '.xml', '.json', '.csv', '.tsv', '.sql', '.md', '.rtf'}
        code_extensions = {'.py', '.js', '.html', '.css', '.php', '.java', '.cpp', '.c', '.h', '.hpp', '.cs', '.vb', '.swift', '.go', '.rs', '.rb', '.pl', '.lua', '.r', '.m', '.scala', '.kt', '.dart', '.ts', '.jsx', '.vue', '.svelte', '.sh', '.bat', '.cmd', '.ps1'}
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg', '.ico', '.raw', '.heic', '.avif'}
        video_extensions = {'.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.mpg', '.mpeg', '.m2v', '.m4p', '.m4b', '.m4r', '.m4v', '.3g2', '.3gp2', '.3gpp', '.3gpp2', '.asf', '.asx', '.avi', '.flv', '.m4v', '.mov', '.mp4', '.mpg', '.mpeg', '.rm', '.rmvb', '.swf', '.vob', '.wmv'}
        audio_extensions = {'.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus', '.amr', '.au', '.ra', '.mid', '.midi'}
        document_extensions = {'.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp', '.rtf', '.txt'}
        executable_extensions = {'.exe', '.dll', '.scr', '.com', '.bat', '.cmd', '.msi', '.app', '.deb', '.rpm', '.pkg', '.dmg'}
        archive_extensions = {'.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.lz', '.lzma', '.cab', '.iso', '.dmg', '.pkg'}
        
        if file_ext in text_extensions:
            return "Text File"
        elif file_ext in code_extensions:
            return "Code File"
        elif file_ext in image_extensions:
            return "Image File"
        elif file_ext in video_extensions:
            return "Video File"
        elif file_ext in audio_extensions:
            return "Audio File"
        elif file_ext in document_extensions:
            return "Document File"
        elif file_ext in executable_extensions:
            return "Executable File"
        elif file_ext in archive_extensions:
            return "Archive File"
        else:
            return "Unknown File"
    
    def _run_file_type_specific_engines(self, file_path: str, file_type: str, result: Dict[str, Any]) -> None:
        """Run engines specific to the file type"""
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_type == "Text File":
            # Text files: Content analysis, metadata analysis, heuristic analysis
            logger.info("Running content analysis for text file...")
            result["content_analysis"] = self._analyze_text_content(file_path)
            result["engines_used"].append("Content Analysis")
            
            logger.info("Running metadata analysis...")
            result["metadata_analysis"] = self._analyze_file_metadata(file_path)
            result["engines_used"].append("Metadata Analysis")
            
            logger.info("Running heuristic analysis...")
            result["heuristic_analysis"] = self.heuristic_analysis(file_path)
            result["engines_used"].append("Heuristic Analysis")
            
            # Check for threats in content analysis
            if result["content_analysis"]["suspicious_content_score"] > 20:
                result["threats_detected"].append({
                    "engine": "Content Analysis",
                    "threat": "Suspicious Text Content",
                    "confidence": result["content_analysis"]["suspicious_content_score"]
                })
                result["overall_threat_score"] += result["content_analysis"]["suspicious_content_score"]
        
        elif file_type == "Code File":
            # Code files: Syntax analysis, vulnerability scanning, behavioral analysis
            logger.info("Running syntax analysis for code file...")
            result["content_analysis"] = self._analyze_code_syntax(file_path)
            result["engines_used"].append("Syntax Analysis")
            
            logger.info("Running vulnerability scanning...")
            result["behavioral_analysis"] = self._scan_code_vulnerabilities(file_path)
            result["engines_used"].append("Vulnerability Scanner")
            
            logger.info("Running behavioral analysis...")
            result["behavioral_analysis"] = self.behavioral_analysis(file_path)
            result["engines_used"].append("Behavioral Analysis")
        
        elif file_type == "Image File":
            # Image files: Metadata analysis, steganography detection, EXIF analysis
            logger.info("Running image metadata analysis...")
            result["metadata_analysis"] = self._analyze_image_metadata(file_path)
            result["engines_used"].append("Image Metadata Analysis")
            
            logger.info("Running steganography detection...")
            result["content_analysis"] = self._detect_steganography(file_path)
            result["engines_used"].append("Steganography Detection")
            
            logger.info("Running EXIF analysis...")
            result["behavioral_analysis"] = self._analyze_exif_data(file_path)
            result["engines_used"].append("EXIF Analysis")
        
        elif file_type == "Video File":
            # Video files: Metadata analysis, codec analysis, frame analysis
            logger.info("Running video metadata analysis...")
            result["metadata_analysis"] = self._analyze_video_metadata(file_path)
            result["engines_used"].append("Video Metadata Analysis")
            
            logger.info("Running codec analysis...")
            result["content_analysis"] = self._analyze_video_codecs(file_path)
            result["engines_used"].append("Codec Analysis")
        
        elif file_type == "Audio File":
            # Audio files: Metadata analysis, spectrogram analysis
            logger.info("Running audio metadata analysis...")
            result["metadata_analysis"] = self._analyze_audio_metadata(file_path)
            result["engines_used"].append("Audio Metadata Analysis")
            
            logger.info("Running spectrogram analysis...")
            result["content_analysis"] = self._analyze_audio_spectrogram(file_path)
            result["engines_used"].append("Spectrogram Analysis")
        
        elif file_type == "Document File":
            # Documents: Macro analysis, embedded object analysis, metadata analysis
            logger.info("Running macro analysis...")
            result["content_analysis"] = self._analyze_document_macros(file_path)
            result["engines_used"].append("Macro Analysis")
            
            logger.info("Running embedded object analysis...")
            result["behavioral_analysis"] = self._analyze_embedded_objects(file_path)
            result["engines_used"].append("Embedded Object Analysis")
            
            logger.info("Running document metadata analysis...")
            result["metadata_analysis"] = self._analyze_document_metadata(file_path)
            result["engines_used"].append("Document Metadata Analysis")
        
        elif file_type == "Executable File":
            # Executables: PE analysis, behavioral analysis, heuristic analysis
            logger.info("Running PE analysis...")
            result["pe_analysis"] = self.analyze_pe_file(file_path)
            result["engines_used"].append("PE Analysis")
            
            logger.info("Running behavioral analysis...")
            result["behavioral_analysis"] = self.behavioral_analysis(file_path)
            result["engines_used"].append("Behavioral Analysis")
            
            logger.info("Running heuristic analysis...")
            result["heuristic_analysis"] = self.heuristic_analysis(file_path)
            result["engines_used"].append("Heuristic Analysis")
            
            # Check for PE threats
            if result["pe_analysis"]["risk_score"] > 20:
                result["threats_detected"].append({
                    "engine": "PE Analysis",
                    "threat": "Suspicious PE Structure",
                    "confidence": min(90, result["pe_analysis"]["risk_score"])
                })
                result["overall_threat_score"] += result["pe_analysis"]["risk_score"]
        
        elif file_type == "Archive File":
            # Archives: Deep archive scan, content analysis
            logger.info("Running archive analysis...")
            result["archive_analysis"] = self.deep_archive_scan(file_path)
            result["engines_used"].append("Archive Analysis")
            
            logger.info("Running archive content analysis...")
            result["content_analysis"] = self._analyze_archive_content(file_path)
            result["engines_used"].append("Archive Content Analysis")
            
            # Check for archive threats
            if result["archive_analysis"]["risk_score"] > 15:
                result["threats_detected"].append({
                    "engine": "Archive Analysis",
                    "threat": "Suspicious Archive Content",
                    "confidence": min(90, result["archive_analysis"]["risk_score"])
                })
                result["overall_threat_score"] += result["archive_analysis"]["risk_score"]
        
        else:  # Unknown file type
            # Unknown files: Basic heuristic and behavioral analysis
            logger.info("Running basic heuristic analysis for unknown file type...")
            result["heuristic_analysis"] = self.heuristic_analysis(file_path)
            result["engines_used"].append("Heuristic Analysis")
            
            logger.info("Running basic behavioral analysis...")
            result["behavioral_analysis"] = self.behavioral_analysis(file_path)
            result["engines_used"].append("Behavioral Analysis")
    
    def intelligent_comprehensive_scan(self, file_path: str, threat_level: str = "medium") -> Dict[str, Any]:
        """Run comprehensive scan using 100+ intelligent engines"""
        scan_start_time = time.time()
        
        try:
            # Use intelligent engine selector
            intelligent_results = self.intelligent_selector.run_comprehensive_analysis(file_path, threat_level)
            
            # Debug logging to trace engines_used
            logger.info(f"Intelligent results engines_used: {intelligent_results.get('engines_used', [])}")
            logger.info(f"Intelligent results keys: {list(intelligent_results.keys())}")
            
            # Convert to our expected format
            comprehensive_result = {
                "file_info": {
                    "file_name": os.path.basename(file_path),
                    "file_size": os.path.getsize(file_path),
                    "file_type": intelligent_results.get("file_type", "Unknown"),
                    "entropy": self.calculate_file_entropy(file_path)
                },
                "signature_detection": {},
                "heuristic_analysis": {},
                "behavioral_analysis": {},
                "pe_analysis": {},
                "archive_analysis": {},
                "reputation_check": {},
                "content_analysis": {},
                "metadata_analysis": {},
                "overall_threat_score": intelligent_results.get("overall_threat_score", 0),
                "threat_classification": self._determine_threat_classification(intelligent_results.get("overall_threat_score", 0)),
                "threats_detected": intelligent_results.get("threat_detections", []),
                "scan_time": intelligent_results.get("analysis_time", 0),
                "engines_used": intelligent_results.get("engines_used", []),
                "intelligent_analysis": True,
                "engine_results": intelligent_results.get("engine_results", {}),
                "confidence_level": intelligent_results.get("confidence_level", 0)
            }
            
            # Process engine results into categories
            for engine_id, result in intelligent_results.get("engine_results", {}).items():
                engine = self.engine_registry.get_engine_info(engine_id)
                if engine:
                    category = engine.category.value
                    if category == "signature":
                        comprehensive_result["signature_detection"] = result
                    elif category == "heuristic":
                        comprehensive_result["heuristic_analysis"] = result
                    elif category == "behavioral":
                        comprehensive_result["behavioral_analysis"] = result
                    elif category == "static" and "pe" in engine_id.lower():
                        comprehensive_result["pe_analysis"] = result
                    elif category == "specialized" and "archive" in engine_id.lower():
                        comprehensive_result["archive_analysis"] = result
                    elif category == "metadata":
                        comprehensive_result["metadata_analysis"] = result
                    elif category == "content":
                        comprehensive_result["content_analysis"] = result
            
            # Reputation checking now handled by VirusTotal API
            
            logger.info(f"Intelligent comprehensive scan completed in {comprehensive_result['scan_time']}s using {len(comprehensive_result['engines_used'])} engines")
            logger.info(f"Threat classification: {comprehensive_result['threat_classification']}")
            logger.info(f"Overall threat score: {comprehensive_result['overall_threat_score']}")
            
            return comprehensive_result
            
        except Exception as e:
            logger.error(f"Intelligent comprehensive scan failed: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            # Fallback to traditional scan
            logger.warning("Falling back to traditional comprehensive scan")
            return self.comprehensive_scan(file_path)
    
    def _determine_threat_classification(self, threat_score: int) -> str:
        """Determine threat classification based on score"""
        if threat_score >= 80:
            return "CRITICAL"
        elif threat_score >= 60:
            return "HIGH"
        elif threat_score >= 40:
            return "MEDIUM"
        elif threat_score >= 20:
            return "LOW"
        else:
            return "CLEAN"
    
    def comprehensive_scan(self, file_path: str) -> Dict[str, Any]:
        """Comprehensive antivirus-style scan using file-type-specific engines"""
        scan_start_time = time.time()
        
        # Determine file type and select appropriate engines
        file_ext = os.path.splitext(file_path)[1].lower()
        file_type = self._get_file_type_category(file_ext)
        
        # Initialize comprehensive result
        comprehensive_result = {
            "file_info": {
                "file_name": os.path.basename(file_path),
                "file_size": os.path.getsize(file_path),
                "file_type": file_type,
                "entropy": 0.0
            },
            "signature_detection": {},
            "heuristic_analysis": {},
            "behavioral_analysis": {},
            "pe_analysis": {},
            "archive_analysis": {},
            "reputation_check": {},
            "content_analysis": {},
            "metadata_analysis": {},
            "overall_threat_score": 0,
            "threat_classification": "UNKNOWN",
            "threats_detected": [],
            "scan_time": 0,
            "engines_used": []
        }
        
        try:
            # Basic file info
            comprehensive_result["file_info"]["entropy"] = self.calculate_file_entropy(file_path)
            comprehensive_result["engines_used"].append("Entropy Analysis")
            
            # Run file-type-specific engines
            self._run_file_type_specific_engines(file_path, file_type, comprehensive_result)
            
            # Always run signature detection and reputation check
            logger.info("Running signature detection...")
            comprehensive_result["signature_detection"] = self.scan_file_signatures(file_path)
            comprehensive_result["engines_used"].append("Signature Detection")
            
            if comprehensive_result["signature_detection"]["threat_detected"]:
                comprehensive_result["threats_detected"].append({
                    "engine": "Signature Detection",
                    "threat": comprehensive_result["signature_detection"]["threat_type"],
                    "confidence": comprehensive_result["signature_detection"]["confidence"]
                })
                comprehensive_result["overall_threat_score"] += 50
            
            # Reputation checking now handled by VirusTotal API
            
            # Determine threat classification
            if comprehensive_result["overall_threat_score"] >= 80:
                comprehensive_result["threat_classification"] = "MALWARE"
            elif comprehensive_result["overall_threat_score"] >= 60:
                comprehensive_result["threat_classification"] = "SUSPICIOUS"
            elif comprehensive_result["overall_threat_score"] >= 30:
                comprehensive_result["threat_classification"] = "POTENTIALLY_UNWANTED"
            elif comprehensive_result["overall_threat_score"] >= 10:
                comprehensive_result["threat_classification"] = "LOW_RISK"
            else:
                comprehensive_result["threat_classification"] = "CLEAN"
            
            # Calculate scan time
            comprehensive_result["scan_time"] = round(time.time() - scan_start_time, 2)
            
            logger.info(f"Comprehensive scan completed in {comprehensive_result['scan_time']}s")
            logger.info(f"Threat classification: {comprehensive_result['threat_classification']}")
            logger.info(f"Overall threat score: {comprehensive_result['overall_threat_score']}")
            
            return comprehensive_result
            
        except Exception as e:
            logger.error(f"Error in comprehensive scan: {e}")
            comprehensive_result["error"] = str(e)
            comprehensive_result["threat_classification"] = "ERROR"
            return comprehensive_result
    
    # New file-type-specific analysis methods
    def _analyze_text_content(self, file_path: str) -> Dict[str, Any]:
        """Analyze text file content for suspicious patterns"""
        result = {
            "suspicious_content_score": 0,
            "suspicious_patterns": [],
            "content_analysis": "Clean"
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().lower()
            
            # Check for suspicious patterns in text
            suspicious_patterns = [
                'password', 'secret', 'key', 'token', 'api', 'wallet', 'private',
                'bitcoin', 'ethereum', 'crypto', 'wallet.dat', 'seed phrase',
                'malware', 'trojan', 'virus', 'backdoor', 'keylogger'
            ]
            
            found_patterns = []
            for pattern in suspicious_patterns:
                if pattern in content:
                    found_patterns.append(pattern)
                    result["suspicious_content_score"] += 10
            
            if found_patterns:
                result["suspicious_patterns"] = found_patterns
                result["content_analysis"] = f"Suspicious patterns found: {', '.join(found_patterns[:3])}"
            else:
                result["content_analysis"] = "No suspicious patterns detected"
                
        except Exception as e:
            result["content_analysis"] = f"Content analysis error: {str(e)}"
        
        return result
    
    def _analyze_file_metadata(self, file_path: str) -> Dict[str, Any]:
        """Analyze file metadata for suspicious indicators"""
        result = {
            "metadata_score": 0,
            "suspicious_metadata": [],
            "metadata_analysis": "Clean"
        }
        
        try:
            stat = os.stat(file_path)
            
            # Check file size (very large or very small files might be suspicious)
            if stat.st_size > 100 * 1024 * 1024:  # > 100MB
                result["suspicious_metadata"].append("Unusually large file size")
                result["metadata_score"] += 5
            elif stat.st_size < 10:  # < 10 bytes
                result["suspicious_metadata"].append("Unusually small file size")
                result["metadata_score"] += 5
            
            # Check file permissions (if available)
            if hasattr(stat, 'st_mode'):
                if stat.st_mode & 0o111:  # Executable
                    result["suspicious_metadata"].append("File has executable permissions")
                    result["metadata_score"] += 10
            
            if result["suspicious_metadata"]:
                result["metadata_analysis"] = f"Suspicious metadata: {', '.join(result['suspicious_metadata'])}"
            else:
                result["metadata_analysis"] = "No suspicious metadata detected"
                
        except Exception as e:
            result["metadata_analysis"] = f"Metadata analysis error: {str(e)}"
        
        return result
    
    def _analyze_code_syntax(self, file_path: str) -> Dict[str, Any]:
        """Analyze code file syntax for vulnerabilities"""
        result = {
            "syntax_score": 0,
            "vulnerabilities": [],
            "syntax_analysis": "Clean"
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Check for common code vulnerabilities
            vulnerability_patterns = [
                'eval(', 'exec(', 'system(', 'shell_exec', 'passthru(',
                'file_get_contents', 'fopen', 'include', 'require',
                'sql_query', 'mysql_query', 'SELECT * FROM'
            ]
            
            found_vulns = []
            for pattern in vulnerability_patterns:
                if pattern in content:
                    found_vulns.append(pattern)
                    result["syntax_score"] += 15
            
            if found_vulns:
                result["vulnerabilities"] = found_vulns
                result["syntax_analysis"] = f"Potential vulnerabilities: {', '.join(found_vulns[:3])}"
            else:
                result["syntax_analysis"] = "No obvious vulnerabilities detected"
                
        except Exception as e:
            result["syntax_analysis"] = f"Syntax analysis error: {str(e)}"
        
        return result
    
    def _scan_code_vulnerabilities(self, file_path: str) -> Dict[str, Any]:
        """Scan code for security vulnerabilities"""
        result = {
            "vulnerability_score": 0,
            "security_issues": [],
            "vulnerability_analysis": "Clean"
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Security vulnerability patterns
            security_patterns = [
                'password', 'secret', 'api_key', 'private_key', 'token',
                'http://', 'ftp://', 'telnet://', 'unencrypted',
                'md5(', 'sha1(', 'weak_hash', 'hardcoded'
            ]
            
            found_issues = []
            for pattern in security_patterns:
                if pattern in content.lower():
                    found_issues.append(pattern)
                    result["vulnerability_score"] += 10
            
            if found_issues:
                result["security_issues"] = found_issues
                result["vulnerability_analysis"] = f"Security issues: {', '.join(found_issues[:3])}"
            else:
                result["vulnerability_analysis"] = "No security issues detected"
                
        except Exception as e:
            result["vulnerability_analysis"] = f"Vulnerability scan error: {str(e)}"
        
        return result
    
    def _analyze_image_metadata(self, file_path: str) -> Dict[str, Any]:
        """Analyze image file metadata"""
        result = {
            "image_metadata_score": 0,
            "metadata_issues": [],
            "image_analysis": "Clean"
        }
        
        try:
            # Basic image analysis
            with open(file_path, 'rb') as f:
                header = f.read(16)
            
            # Check for valid image headers
            valid_headers = [
                b'\xff\xd8\xff',  # JPEG
                b'\x89PNG\r\n\x1a\n',  # PNG
                b'GIF87a',  # GIF
                b'GIF89a',  # GIF
                b'BM',  # BMP
            ]
            
            is_valid_image = any(header.startswith(h) for h in valid_headers)
            
            if not is_valid_image:
                result["metadata_issues"].append("Invalid image header")
                result["image_metadata_score"] += 20
            
            if result["metadata_issues"]:
                result["image_analysis"] = f"Image issues: {', '.join(result['metadata_issues'])}"
            else:
                result["image_analysis"] = "Valid image format detected"
                
        except Exception as e:
            result["image_analysis"] = f"Image analysis error: {str(e)}"
        
        return result
    
    def _detect_steganography(self, file_path: str) -> Dict[str, Any]:
        """Detect potential steganography in images"""
        result = {
            "steganography_score": 0,
            "steganography_indicators": [],
            "steganography_analysis": "Clean"
        }
        
        try:
            # Basic steganography detection (simplified)
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Check for high entropy (might indicate hidden data)
            entropy = self.calculate_file_entropy(file_path)
            if entropy > 7.5:
                result["steganography_indicators"].append("High entropy detected")
                result["steganography_score"] += 15
            
            # Check for unusual file size patterns
            if len(data) % 8 != 0:  # Unusual size for images
                result["steganography_indicators"].append("Unusual file size pattern")
                result["steganography_score"] += 10
            
            if result["steganography_indicators"]:
                result["steganography_analysis"] = f"Steganography indicators: {', '.join(result['steganography_indicators'])}"
            else:
                result["steganography_analysis"] = "No steganography indicators detected"
                
        except Exception as e:
            result["steganography_analysis"] = f"Steganography detection error: {str(e)}"
        
        return result
    
    def _analyze_exif_data(self, file_path: str) -> Dict[str, Any]:
        """Analyze EXIF data in images"""
        result = {
            "exif_score": 0,
            "exif_issues": [],
            "exif_analysis": "Clean"
        }
        
        try:
            # Basic EXIF analysis (simplified)
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Look for EXIF markers
            if b'EXIF' in data:
                result["exif_analysis"] = "EXIF data present"
            else:
                result["exif_analysis"] = "No EXIF data detected"
                
        except Exception as e:
            result["exif_analysis"] = f"EXIF analysis error: {str(e)}"
        
        return result
    
    def _analyze_video_metadata(self, file_path: str) -> Dict[str, Any]:
        """Analyze video file metadata"""
        result = {
            "video_metadata_score": 0,
            "video_issues": [],
            "video_analysis": "Clean"
        }
        
        try:
            # Basic video analysis
            with open(file_path, 'rb') as f:
                header = f.read(32)
            
            # Check for valid video headers
            valid_headers = [
                b'\x00\x00\x00\x20ftypmp4',  # MP4
                b'RIFF',  # AVI
                b'\x1a\x45\xdf\xa3',  # MKV
            ]
            
            is_valid_video = any(header.startswith(h) for h in valid_headers)
            
            if not is_valid_video:
                result["video_issues"].append("Invalid video header")
                result["video_metadata_score"] += 20
            
            if result["video_issues"]:
                result["video_analysis"] = f"Video issues: {', '.join(result['video_issues'])}"
            else:
                result["video_analysis"] = "Valid video format detected"
                
        except Exception as e:
            result["video_analysis"] = f"Video analysis error: {str(e)}"
        
        return result
    
    def _analyze_video_codecs(self, file_path: str) -> Dict[str, Any]:
        """Analyze video codecs"""
        result = {
            "codec_score": 0,
            "codec_analysis": "Standard codecs detected"
        }
        
        try:
            # Basic codec analysis (simplified)
            with open(file_path, 'rb') as f:
                data = f.read(1024)  # First 1KB
            
            # Look for codec signatures
            codecs = []
            if b'H264' in data or b'h264' in data:
                codecs.append("H.264")
            if b'VP8' in data or b'vp8' in data:
                codecs.append("VP8")
            if b'VP9' in data or b'vp9' in data:
                codecs.append("VP9")
            
            if codecs:
                result["codec_analysis"] = f"Codecs detected: {', '.join(codecs)}"
            else:
                result["codec_analysis"] = "Standard video codecs"
                
        except Exception as e:
            result["codec_analysis"] = f"Codec analysis error: {str(e)}"
        
        return result
    
    def _analyze_audio_metadata(self, file_path: str) -> Dict[str, Any]:
        """Analyze audio file metadata"""
        result = {
            "audio_metadata_score": 0,
            "audio_analysis": "Clean"
        }
        
        try:
            # Basic audio analysis
            with open(file_path, 'rb') as f:
                header = f.read(16)
            
            # Check for valid audio headers
            valid_headers = [
                b'ID3',  # MP3
                b'\xff\xfb',  # MP3
                b'RIFF',  # WAV
                b'OggS',  # OGG
            ]
            
            is_valid_audio = any(header.startswith(h) for h in valid_headers)
            
            if is_valid_audio:
                result["audio_analysis"] = "Valid audio format detected"
            else:
                result["audio_analysis"] = "Unknown audio format"
                result["audio_metadata_score"] += 10
                
        except Exception as e:
            result["audio_analysis"] = f"Audio analysis error: {str(e)}"
        
        return result
    
    def _analyze_audio_spectrogram(self, file_path: str) -> Dict[str, Any]:
        """Analyze audio spectrogram for anomalies"""
        result = {
            "spectrogram_score": 0,
            "spectrogram_analysis": "Normal audio patterns detected"
        }
        
        try:
            # Basic spectrogram analysis (simplified)
            with open(file_path, 'rb') as f:
                data = f.read(1024)
            
            # Check for unusual patterns in audio data
            if len(data) > 0:
                # Simple entropy check
                entropy = 0
                for i in range(256):
                    count = data.count(i)
                    if count > 0:
                        probability = count / len(data)
                        entropy -= probability * math.log2(probability)
                
                if entropy > 7.0:
                    result["spectrogram_analysis"] = "High entropy detected in audio"
                    result["spectrogram_score"] += 15
                else:
                    result["spectrogram_analysis"] = "Normal audio entropy"
                
        except Exception as e:
            result["spectrogram_analysis"] = f"Spectrogram analysis error: {str(e)}"
        
        return result
    
    def _analyze_document_macros(self, file_path: str) -> Dict[str, Any]:
        """Analyze document for malicious macros"""
        result = {
            "macro_score": 0,
            "macro_analysis": "No macros detected"
        }
        
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Look for macro signatures
            macro_indicators = [
                b'VBA', b'Macro', b'VBProject', b'ThisWorkbook',
                b'Auto_Open', b'Document_Open', b'Workbook_Open'
            ]
            
            found_macros = []
            for indicator in macro_indicators:
                if indicator in data:
                    found_macros.append(indicator.decode('utf-8', errors='ignore'))
                    result["macro_score"] += 20
            
            if found_macros:
                result["macro_analysis"] = f"Macros detected: {', '.join(found_macros[:3])}"
            else:
                result["macro_analysis"] = "No macros detected"
                
        except Exception as e:
            result["macro_analysis"] = f"Macro analysis error: {str(e)}"
        
        return result
    
    def _analyze_embedded_objects(self, file_path: str) -> Dict[str, Any]:
        """Analyze document for embedded objects"""
        result = {
            "embedded_score": 0,
            "embedded_analysis": "No embedded objects detected"
        }
        
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Look for embedded object signatures
            embedded_indicators = [
                b'EmbeddedObject', b'OLEObject', b'Package',
                b'Microsoft Office', b'Excel.Sheet', b'Word.Document'
            ]
            
            found_objects = []
            for indicator in embedded_indicators:
                if indicator in data:
                    found_objects.append(indicator.decode('utf-8', errors='ignore'))
                    result["embedded_score"] += 15
            
            if found_objects:
                result["embedded_analysis"] = f"Embedded objects: {', '.join(found_objects[:3])}"
            else:
                result["embedded_analysis"] = "No embedded objects detected"
                
        except Exception as e:
            result["embedded_analysis"] = f"Embedded object analysis error: {str(e)}"
        
        return result
    
    def _analyze_document_metadata(self, file_path: str) -> Dict[str, Any]:
        """Analyze document metadata"""
        result = {
            "document_metadata_score": 0,
            "document_analysis": "Clean"
        }
        
        try:
            with open(file_path, 'rb') as f:
                data = f.read(1024)  # First 1KB
            
            # Look for document metadata
            metadata_indicators = [
                b'Author:', b'Creator:', b'Producer:', b'CreationDate:',
                b'ModDate:', b'Title:', b'Subject:', b'Keywords:'
            ]
            
            found_metadata = []
            for indicator in metadata_indicators:
                if indicator in data:
                    found_metadata.append(indicator.decode('utf-8', errors='ignore').rstrip(':'))
            
            if found_metadata:
                result["document_analysis"] = f"Metadata fields: {', '.join(found_metadata[:5])}"
            else:
                result["document_analysis"] = "No metadata detected"
                
        except Exception as e:
            result["document_analysis"] = f"Document metadata analysis error: {str(e)}"
        
        return result
    
    def _analyze_archive_content(self, file_path: str) -> Dict[str, Any]:
        """Analyze archive content for suspicious files"""
        result = {
            "archive_content_score": 0,
            "suspicious_files": [],
            "archive_content_analysis": "Clean"
        }
        
        try:
            # Basic archive content analysis
            file_ext = os.path.splitext(file_path)[1].lower()
            
            if file_ext == '.zip':
                with zipfile.ZipFile(file_path, 'r') as zip_file:
                    for file_info in zip_file.filelist:
                        if file_info.filename.lower().endswith(('.exe', '.dll', '.scr', '.bat', '.cmd')):
                            result["suspicious_files"].append(file_info.filename)
                            result["archive_content_score"] += 10
            
            if result["suspicious_files"]:
                result["archive_content_analysis"] = f"Suspicious files: {', '.join(result['suspicious_files'][:3])}"
            else:
                result["archive_content_analysis"] = "No suspicious files in archive"
                
        except Exception as e:
            result["archive_content_analysis"] = f"Archive content analysis error: {str(e)}"
        
        return result

