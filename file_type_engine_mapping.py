"""
Predefined File Type to Engine Mapping
Optimized for speed and comprehensive coverage
"""

from typing import Dict, List, Tuple
from engine_registry import FileType, EngineCategory

class FileTypeEngineMapping:
    """Predefined mappings for file types to their optimal engines"""
    
    def __init__(self):
        # Define optimal engines for each file type with specific counts
        self.file_type_mappings = {
            # TEXT FILES - Focus on content analysis and metadata
            FileType.TEXT: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'entropy_analyzer', # Entropy analysis
                    'metadata_analyzer', # File metadata
                    'reputation_checker', # Hash reputation
                    'content_analyzer',  # Text content analysis
                    'syntax_analyzer',   # Code syntax (for scripts)
                    'ai_verifier'        # AI final verification
                ],
                'count': 8,
                'priority': 'content_analysis'
            },
            
            # EXECUTABLE FILES - Maximum security focus
            FileType.EXECUTABLE: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'pe_analyzer',      # PE file analysis
                    'behavioral_analyzer', # Behavioral analysis
                    'entropy_analyzer', # Entropy analysis
                    'symantec',         # Enterprise AV
                    'kaspersky',        # Enterprise AV
                    'mcafee',           # Enterprise AV
                    'reputation_checker', # Hash reputation
                    'sandbox_analyzer', # Dynamic analysis
                    'ai_verifier'       # AI final verification
                ],
                'count': 11,
                'priority': 'security_critical'
            },
            
            # DOCUMENT FILES - Focus on macros and embedded objects
            FileType.DOCUMENT: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'macro_analyzer',   # Macro detection
                    'embedded_analyzer', # Embedded objects
                    'metadata_analyzer', # Document metadata
                    'ole_analyzer',     # OLE analysis
                    'pdf_analyzer',     # PDF-specific analysis
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 9,
                'priority': 'macro_security'
            },
            
            # IMAGE FILES - Focus on steganography and metadata
            FileType.IMAGE: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'steganography_detector', # Hidden content
                    'exif_analyzer',    # EXIF metadata
                    'metadata_analyzer', # File metadata
                    'image_analyzer',   # Image-specific analysis
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 8,
                'priority': 'steganography'
            },
            
            # VIDEO FILES - Focus on codecs and metadata
            FileType.VIDEO: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'video_analyzer',   # Video-specific analysis
                    'codec_analyzer',   # Codec analysis
                    'metadata_analyzer', # Video metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'codec_analysis'
            },
            
            # AUDIO FILES - Focus on spectrogram and metadata
            FileType.AUDIO: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'audio_analyzer',   # Audio-specific analysis
                    'spectrogram_analyzer', # Audio spectrogram
                    'metadata_analyzer', # Audio metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'audio_analysis'
            },
            
            # CODE FILES - Focus on syntax and vulnerabilities
            FileType.CODE: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'syntax_analyzer',  # Code syntax analysis
                    'vulnerability_scanner', # Code vulnerabilities
                    'entropy_analyzer', # Entropy analysis
                    'metadata_analyzer', # File metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 8,
                'priority': 'code_security'
            },
            
            # ARCHIVE FILES - Focus on content extraction and analysis
            FileType.ARCHIVE: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'archive_analyzer', # Archive-specific analysis
                    'entropy_analyzer', # Entropy analysis
                    'metadata_analyzer', # Archive metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'archive_security'
            },
            
            # EMAIL FILES - Focus on email-specific threats
            FileType.EMAIL: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'email_analyzer',   # Email-specific analysis
                    'attachment_analyzer', # Email attachments
                    'metadata_analyzer', # Email metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'email_security'
            },
            
            # MOBILE FILES - Focus on mobile-specific threats
            FileType.MOBILE: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'mobile_analyzer',  # Mobile-specific analysis
                    'permission_analyzer', # App permissions
                    'metadata_analyzer', # App metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'mobile_security'
            },
            
            # WEB FILES - Focus on web-specific threats
            FileType.WEB: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'web_analyzer',     # Web-specific analysis
                    'javascript_analyzer', # JavaScript analysis
                    'metadata_analyzer', # Web metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'web_security'
            },
            
            # DATABASE FILES - Focus on data integrity and injection
            FileType.DATABASE: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'database_analyzer', # Database-specific analysis
                    'metadata_analyzer', # Database metadata
                    'integrity_checker', # Data integrity
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'data_security'
            },
            
            # FONT FILES - Focus on font-specific threats
            FileType.FONT: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'font_analyzer',    # Font-specific analysis
                    'metadata_analyzer', # Font metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 6,
                'priority': 'font_security'
            },
            
            # CAD FILES - Focus on CAD-specific threats
            FileType.CAD: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'cad_analyzer',     # CAD-specific analysis
                    'metadata_analyzer', # CAD metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 6,
                'priority': 'cad_security'
            },
            
            # GAME FILES - Focus on game-specific threats
            FileType.GAME: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'game_analyzer',    # Game-specific analysis
                    'metadata_analyzer', # Game metadata
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 6,
                'priority': 'game_security'
            },
            
            # SYSTEM FILES - Maximum security for system files
            FileType.SYSTEM: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'system_analyzer',  # System-specific analysis
                    'behavioral_analyzer', # Behavioral analysis
                    'metadata_analyzer', # System metadata
                    'reputation_checker', # Hash reputation
                    'symantec',         # Enterprise AV
                    'kaspersky',        # Enterprise AV
                    'ai_verifier'       # AI final verification
                ],
                'count': 9,
                'priority': 'system_critical'
            },
            
            # SCIENTIFIC FILES - Focus on scientific data integrity
            FileType.SCIENTIFIC: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'scientific_analyzer', # Scientific-specific analysis
                    'metadata_analyzer', # Scientific metadata
                    'integrity_checker', # Data integrity
                    'reputation_checker', # Hash reputation
                    'ai_verifier'       # AI final verification
                ],
                'count': 7,
                'priority': 'scientific_integrity'
            },
            
            # BLOCKCHAIN FILES - Maximum security for crypto files
            FileType.BLOCKCHAIN: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'blockchain_analyzer', # Blockchain-specific analysis
                    'crypto_analyzer',  # Cryptocurrency analysis
                    'wallet_analyzer',  # Wallet security
                    'behavioral_analyzer', # Behavioral analysis
                    'metadata_analyzer', # Blockchain metadata
                    'reputation_checker', # Hash reputation
                    'symantec',         # Enterprise AV
                    'kaspersky',        # Enterprise AV
                    'ai_verifier'       # AI final verification
                ],
                'count': 11,
                'priority': 'crypto_critical'
            },
            
            # UNKNOWN FILES - Maximum coverage
            FileType.UNKNOWN: {
                'engines': [
                    'clamav',           # Signature detection
                    'yara',             # Pattern matching
                    'entropy_analyzer', # Entropy analysis
                    'behavioral_analyzer', # Behavioral analysis
                    'metadata_analyzer', # File metadata
                    'reputation_checker', # Hash reputation
                    'symantec',         # Enterprise AV
                    'kaspersky',        # Enterprise AV
                    'ai_verifier'       # AI final verification
                ],
                'count': 9,
                'priority': 'maximum_coverage'
            }
        }
        
        # Performance optimization: pre-compute engine lists
        self._cached_mappings = {}
        self._build_cached_mappings()
    
    def _build_cached_mappings(self):
        """Pre-compute engine mappings for faster access"""
        for file_type, config in self.file_type_mappings.items():
            self._cached_mappings[file_type] = {
                'engines': config['engines'][:config['count']],
                'count': config['count'],
                'priority': config['priority']
            }
    
    def get_engines_for_file_type(self, file_type: FileType, threat_level: str = "medium") -> List[str]:
        """
        Get predefined engines for a specific file type
        
        Args:
            file_type: The file type to get engines for
            threat_level: Threat level (low, medium, high, critical)
            
        Returns:
            List of engine IDs to use
        """
        if file_type not in self._cached_mappings:
            # Fallback to unknown file type
            file_type = FileType.UNKNOWN
        
        base_engines = self._cached_mappings[file_type]['engines'].copy()
        
        # Adjust engine count based on threat level
        if threat_level == "low":
            # Use fewer engines for low threat
            return base_engines[:max(3, len(base_engines) // 2)]
        elif threat_level == "high" or threat_level == "critical":
            # Use all engines for high threat
            return base_engines
        else:
            # Use standard count for medium threat
            return base_engines
    
    def get_engine_count_for_file_type(self, file_type: FileType) -> int:
        """Get the number of engines to use for a file type"""
        if file_type in self._cached_mappings:
            return self._cached_mappings[file_type]['count']
        return 9  # Default for unknown files
    
    def get_priority_for_file_type(self, file_type: FileType) -> str:
        """Get the priority focus for a file type"""
        if file_type in self._cached_mappings:
            return self._cached_mappings[file_type]['priority']
        return "maximum_coverage"
    
    def get_all_supported_file_types(self) -> List[FileType]:
        """Get all supported file types"""
        return list(self.file_type_mappings.keys())
    
    def get_engine_statistics(self) -> Dict[str, any]:
        """Get statistics about engine usage"""
        stats = {
            'total_file_types': len(self.file_type_mappings),
            'total_engines_used': len(set(
                engine for config in self.file_type_mappings.values()
                for engine in config['engines']
            )),
            'average_engines_per_type': sum(
                config['count'] for config in self.file_type_mappings.values()
            ) / len(self.file_type_mappings),
            'file_type_breakdown': {
                file_type.name: {
                    'engine_count': config['count'],
                    'priority': config['priority'],
                    'engines': config['engines']
                }
                for file_type, config in self.file_type_mappings.items()
            }
        }
        return stats

# Global instance for fast access
FILE_TYPE_MAPPING = FileTypeEngineMapping()

def get_engines_for_file_type(file_type: FileType, threat_level: str = "medium") -> List[str]:
    """Convenience function to get engines for a file type"""
    return FILE_TYPE_MAPPING.get_engines_for_file_type(file_type, threat_level)

def get_engine_count_for_file_type(file_type: FileType) -> int:
    """Convenience function to get engine count for a file type"""
    return FILE_TYPE_MAPPING.get_engine_count_for_file_type(file_type)

def get_priority_for_file_type(file_type: FileType) -> str:
    """Convenience function to get priority for a file type"""
    return FILE_TYPE_MAPPING.get_priority_for_file_type(file_type)
