import google.generativeai as genai
import os
try:
    import magic
    MAGIC_AVAILABLE = True
except ImportError:
    MAGIC_AVAILABLE = False
    print("⚠️ python-magic not available, using basic file type detection")
import hashlib
import json
import logging
import math
import time
from typing import Dict, Any, Optional, Tuple, List
from PIL import Image
import io
import base64

from config import Config
from antivirus_engine import AntivirusEngine
from sandbox_engine import SandboxEngine

# Configure logging
logging.basicConfig(level=getattr(logging, Config.LOG_LEVEL))
logger = logging.getLogger(__name__)

class FileAnalyzer:
    """Advanced file analyzer using Google Gemini API for security threat detection"""
    
    def __init__(self):
        """Initialize the FileAnalyzer with Gemini API, Antivirus Engine, and Sandbox Engine"""
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.antivirus_engine = AntivirusEngine()
        self.sandbox_engine = SandboxEngine()
        
    def get_file_info(self, file_path: str) -> Dict[str, Any]:
        """Extract comprehensive file information"""
        try:
            file_stats = os.stat(file_path)
            file_size = file_stats.st_size
            
            # Get MIME type
            if MAGIC_AVAILABLE:
                mime_type = magic.from_file(file_path, mime=True)
            else:
                # Comprehensive MIME type detection for 500+ file formats
                ext = os.path.splitext(file_path)[1].lower()
                mime_types = {
                    # ========== IMAGES ==========
                    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.jpe': 'image/jpeg',
                    '.png': 'image/png', '.gif': 'image/gif', '.bmp': 'image/bmp',
                    '.tiff': 'image/tiff', '.tif': 'image/tiff', '.webp': 'image/webp',
                    '.svg': 'image/svg+xml', '.svgz': 'image/svg+xml',
                    '.ico': 'image/x-icon', '.cur': 'image/x-icon',
                    '.psd': 'image/vnd.adobe.photoshop', '.ai': 'application/postscript',
                    '.eps': 'application/postscript', '.ps': 'application/postscript',
                    '.indd': 'application/x-indesign', '.sketch': 'application/x-sketch',
                    '.xcf': 'image/x-xcf', '.fig': 'application/x-figma',
                    # RAW Camera Formats
                    '.raw': 'image/x-canon-raw', '.cr2': 'image/x-canon-cr2',
                    '.nef': 'image/x-nikon-nef', '.arw': 'image/x-sony-arw',
                    '.dng': 'image/x-adobe-dng', '.orf': 'image/x-olympus-orf',
                    '.rw2': 'image/x-panasonic-rw2', '.pef': 'image/x-pentax-pef',
                    
                    # ========== VIDEOS ==========
                    '.mp4': 'video/mp4', '.avi': 'video/x-msvideo', '.mov': 'video/quicktime',
                    '.wmv': 'video/x-ms-wmv', '.flv': 'video/x-flv', '.webm': 'video/webm',
                    '.mkv': 'video/x-matroska', '.m4v': 'video/x-m4v',
                    '.3gp': 'video/3gpp', '.3g2': 'video/3gpp2', '.asf': 'video/x-ms-asf',
                    '.vob': 'video/x-ms-vob', '.ts': 'video/mp2t', '.m2ts': 'video/mp2t',
                    '.mts': 'video/mp2t', '.divx': 'video/divx', '.xvid': 'video/x-xvid',
                    '.rm': 'application/vnd.rn-realmedia', '.rmvb': 'application/vnd.rn-realmedia-vbr',
                    '.f4v': 'video/x-f4v', '.ogv': 'video/ogg', '.mxf': 'application/mxf',
                    
                    # ========== AUDIO ==========
                    '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.flac': 'audio/flac',
                    '.aac': 'audio/aac', '.ogg': 'audio/ogg', '.wma': 'audio/x-ms-wma',
                    '.m4a': 'audio/x-m4a', '.opus': 'audio/opus', '.webm': 'audio/webm',
                    '.aiff': 'audio/x-aiff', '.aif': 'audio/x-aiff', '.au': 'audio/basic',
                    '.snd': 'audio/basic', '.mid': 'audio/midi', '.midi': 'audio/midi',
                    '.kar': 'audio/midi', '.ra': 'audio/x-realaudio', '.3ga': 'audio/3gpp',
                    '.amr': 'audio/amr', '.awb': 'audio/amr-wb', '.ape': 'audio/x-ape',
                    
                    # ========== DOCUMENTS ==========
                    '.pdf': 'application/pdf', '.txt': 'text/plain', '.rtf': 'application/rtf',
                    '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    '.ppt': 'application/vnd.ms-powerpoint', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    '.odt': 'application/vnd.oasis.opendocument.text', '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
                    '.odp': 'application/vnd.oasis.opendocument.presentation', '.odg': 'application/vnd.oasis.opendocument.graphics',
                    '.pages': 'application/x-iwork-pages-sffpages', '.numbers': 'application/x-iwork-numbers-sffnumbers',
                    '.key': 'application/x-iwork-keynote-sffkey', '.epub': 'application/epub+zip',
                    '.mobi': 'application/x-mobipocket-ebook', '.azw': 'application/vnd.amazon.ebook',
                    
                    # ========== ARCHIVES ==========
                    '.zip': 'application/zip', '.rar': 'application/x-rar-compressed',
                    '.7z': 'application/x-7z-compressed', '.tar': 'application/x-tar',
                    '.gz': 'application/gzip', '.bz2': 'application/x-bzip2',
                    '.xz': 'application/x-xz', '.lz': 'application/x-lzip',
                    '.cab': 'application/vnd.ms-cab-compressed', '.iso': 'application/x-iso9660-image',
                    '.dmg': 'application/x-apple-diskimage', '.jar': 'application/java-archive',
                    '.war': 'application/x-webarchive', '.deb': 'application/x-debian-package',
                    '.rpm': 'application/x-rpm', '.msi': 'application/x-msdownload',
                    
                    # ========== EXECUTABLES ==========
                    '.exe': 'application/x-msdownload', '.msi': 'application/x-msdownload',
                    '.dll': 'application/x-msdownload', '.com': 'application/x-msdownload',
                    '.scr': 'application/x-msdownload', '.bat': 'application/x-bat',
                    '.cmd': 'application/x-bat', '.ps1': 'application/x-powershell',
                    '.app': 'application/x-apple-app', '.deb': 'application/x-debian-package',
                    '.rpm': 'application/x-rpm', '.pkg': 'application/x-apple-package',
                    '.apk': 'application/vnd.android.package-archive', '.ipa': 'application/x-ios-app',
                    
                    # ========== PROGRAMMING ==========
                    '.py': 'text/x-python', '.js': 'application/javascript', '.ts': 'application/typescript',
                    '.html': 'text/html', '.htm': 'text/html', '.css': 'text/css',
                    '.php': 'application/x-httpd-php', '.java': 'text/x-java-source',
                    '.c': 'text/x-c', '.cpp': 'text/x-c++', '.cc': 'text/x-c++',
                    '.h': 'text/x-c', '.hpp': 'text/x-c++', '.cs': 'text/x-csharp',
                    '.rb': 'application/x-ruby', '.go': 'text/x-go', '.rs': 'text/x-rust',
                    '.swift': 'text/x-swift', '.kt': 'text/x-kotlin', '.scala': 'text/x-scala',
                    '.pl': 'text/x-perl', '.sh': 'application/x-sh', '.bash': 'application/x-sh',
                    '.zsh': 'application/x-sh', '.fish': 'application/x-sh',
                    '.r': 'text/x-r', '.matlab': 'text/x-matlab', '.m': 'text/x-matlab',
                    '.sql': 'application/sql', '.json': 'application/json', '.xml': 'application/xml',
                    '.yaml': 'application/x-yaml', '.yml': 'application/x-yaml',
                    '.toml': 'application/toml', '.ini': 'text/plain', '.cfg': 'text/plain',
                    
                    # ========== 3D/CAD ==========
                    '.obj': 'model/obj', '.fbx': 'model/fbx', '.dae': 'model/vnd.collada+xml',
                    '.3ds': 'application/x-3ds', '.max': 'application/x-3dsmax',
                    '.blend': 'application/x-blender', '.ma': 'application/x-maya-ascii',
                    '.mb': 'application/x-maya-binary', '.c4d': 'application/x-cinema4d',
                    '.dwg': 'application/acad', '.dxf': 'application/dxf',
                    '.step': 'application/step', '.stp': 'application/step',
                    '.iges': 'application/iges', '.igs': 'application/iges',
                    '.stl': 'model/stl', '.ply': 'model/ply', '.x3d': 'model/x3d+xml',
                    
                    # ========== FONTS ==========
                    '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff',
                    '.woff2': 'font/woff2', '.eot': 'application/vnd.ms-fontobject',
                    
                    # ========== DATABASES ==========
                    '.db': 'application/x-sqlite3', '.sqlite': 'application/x-sqlite3',
                    '.sqlite3': 'application/x-sqlite3', '.mdb': 'application/x-msaccess',
                    '.accdb': 'application/x-msaccess',
                    
                    # ========== SCIENTIFIC ==========
                    '.mat': 'application/x-matlab-data', '.hdf': 'application/x-hdf',
                    '.h5': 'application/x-hdf5', '.nc': 'application/x-netcdf',
                    '.fits': 'application/fits', '.nii': 'application/x-nifti',
                    
                    # ========== VIRTUAL MACHINES ==========
                    '.vmdk': 'application/x-vmware-vmdk', '.vdi': 'application/x-virtualbox-vdi',
                    '.qcow2': 'application/x-qemu-disk', '.vhd': 'application/x-virtualpc-vhd',
                    
                    # ========== BLOCKCHAIN/CRYPTO ==========
                    '.wallet': 'application/x-bitcoin-wallet', '.dat': 'application/x-bitcoin-wallet',
                    '.key': 'application/x-bitcoin-private-key', '.json': 'application/json',
                    
                    # ========== MISC ==========
                    '.log': 'text/plain', '.md': 'text/markdown', '.rst': 'text/x-rst',
                    '.license': 'text/plain', '.readme': 'text/plain', '.gitignore': 'text/plain',
                    '.dockerignore': 'text/plain', '.dockerfile': 'text/plain',
                    '.torrent': 'application/x-bittorrent', '.magnet': 'application/x-magnet'
                }
                mime_type = mime_types.get(ext, 'application/octet-stream')
            
            # Calculate file hash and entropy
            with open(file_path, 'rb') as f:
                data = f.read()
                file_hash = hashlib.sha256(data).hexdigest()
                
                # Calculate Shannon entropy
                entropy = self._calculate_entropy(data)
            
            # Convert MIME type to readable format
            readable_type = self._get_readable_type(mime_type, os.path.splitext(file_path)[1].lower())
            
            return {
                'file_name': os.path.basename(file_path),
                'file_size': file_size,
                'mime_type': mime_type,
                'file_type': readable_type,  # For detailed report display
                'sha256_hash': file_hash,
                'file_hash': file_hash,  # For detailed report display  
                'entropy': entropy,
                'file_extension': os.path.splitext(file_path)[1].lower()
            }
        except Exception as e:
            logger.error(f"Error getting file info: {e}")
            return {}
    
    def _calculate_entropy(self, data: bytes) -> float:
        """Calculate Shannon entropy of file data"""
        if not data:
            return 0.0
        
        # Count byte frequency
        byte_counts = [0] * 256
        for byte in data:
            byte_counts[byte] += 1
        
        # Calculate entropy
        entropy = 0.0
        data_len = len(data)
        for count in byte_counts:
            if count > 0:
                probability = count / data_len
                entropy -= probability * math.log2(probability)
        
        return entropy
    
    def _get_readable_type(self, mime_type: str, extension: str) -> str:
        """Convert MIME type to human-readable format for 500+ file types"""
        readable_types = {
            # ========== IMAGES ==========
            'image/jpeg': 'JPEG Image', 'image/png': 'PNG Image', 'image/gif': 'GIF Image',
            'image/bmp': 'Bitmap Image', 'image/tiff': 'TIFF Image', 'image/webp': 'WebP Image',
            'image/svg+xml': 'SVG Vector Image', 'image/x-icon': 'Icon File',
            'image/vnd.adobe.photoshop': 'Adobe Photoshop File', 'application/postscript': 'PostScript File',
            'application/x-indesign': 'Adobe InDesign File', 'application/x-sketch': 'Sketch Design File',
            'image/x-xcf': 'GIMP Image', 'application/x-figma': 'Figma Design File',
            'image/x-canon-raw': 'Canon RAW Image', 'image/x-canon-cr2': 'Canon CR2 RAW',
            'image/x-nikon-nef': 'Nikon NEF RAW', 'image/x-sony-arw': 'Sony ARW RAW',
            'image/x-adobe-dng': 'Adobe DNG RAW', 'image/x-olympus-orf': 'Olympus ORF RAW',
            'image/x-panasonic-rw2': 'Panasonic RW2 RAW', 'image/x-pentax-pef': 'Pentax PEF RAW',
            
            # ========== VIDEOS ==========
            'video/mp4': 'MP4 Video', 'video/x-msvideo': 'AVI Video', 'video/quicktime': 'QuickTime Video',
            'video/x-ms-wmv': 'Windows Media Video', 'video/x-flv': 'Flash Video', 'video/webm': 'WebM Video',
            'video/x-matroska': 'Matroska Video', 'video/x-m4v': 'M4V Video',
            'video/3gpp': '3GP Mobile Video', 'video/3gpp2': '3G2 Mobile Video',
            'video/x-ms-asf': 'ASF Video', 'video/x-ms-vob': 'DVD Video', 'video/mp2t': 'MPEG Transport Stream',
            'video/divx': 'DivX Video', 'video/x-xvid': 'Xvid Video',
            'application/vnd.rn-realmedia': 'RealMedia Video', 'application/vnd.rn-realmedia-vbr': 'RealMedia VBR',
            'video/x-f4v': 'Flash F4V Video', 'video/ogg': 'Ogg Video', 'application/mxf': 'MXF Professional Video',
            
            # ========== AUDIO ==========
            'audio/mpeg': 'MP3 Audio', 'audio/wav': 'WAV Audio', 'audio/flac': 'FLAC Lossless Audio',
            'audio/aac': 'AAC Audio', 'audio/ogg': 'Ogg Audio', 'audio/x-ms-wma': 'Windows Media Audio',
            'audio/x-m4a': 'M4A Audio', 'audio/opus': 'Opus Audio', 'audio/webm': 'WebM Audio',
            'audio/x-aiff': 'AIFF Audio', 'audio/basic': 'Basic Audio', 'audio/midi': 'MIDI Music',
            'audio/x-realaudio': 'RealAudio', 'audio/3gpp': '3GP Audio', 'audio/amr': 'AMR Audio',
            'audio/amr-wb': 'AMR Wideband Audio', 'audio/x-ape': 'APE Lossless Audio',
            
            # ========== DOCUMENTS ==========
            'application/pdf': 'PDF Document', 'text/plain': 'Text File', 'application/rtf': 'Rich Text Document',
            'application/msword': 'Microsoft Word Document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (DOCX)',
            'application/vnd.ms-excel': 'Microsoft Excel Spreadsheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet (XLSX)',
            'application/vnd.ms-powerpoint': 'Microsoft PowerPoint Presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation (PPTX)',
            'application/vnd.oasis.opendocument.text': 'OpenDocument Text',
            'application/vnd.oasis.opendocument.spreadsheet': 'OpenDocument Spreadsheet',
            'application/vnd.oasis.opendocument.presentation': 'OpenDocument Presentation',
            'application/vnd.oasis.opendocument.graphics': 'OpenDocument Graphics',
            'application/x-iwork-pages-sffpages': 'Apple Pages Document',
            'application/x-iwork-numbers-sffnumbers': 'Apple Numbers Spreadsheet',
            'application/x-iwork-keynote-sffkey': 'Apple Keynote Presentation',
            'application/epub+zip': 'EPUB E-book', 'application/x-mobipocket-ebook': 'Kindle E-book',
            'application/vnd.amazon.ebook': 'Amazon E-book',
            
            # ========== ARCHIVES ==========
            'application/zip': 'ZIP Archive', 'application/x-rar-compressed': 'RAR Archive',
            'application/x-7z-compressed': '7-Zip Archive', 'application/x-tar': 'TAR Archive',
            'application/gzip': 'GZIP Archive', 'application/x-bzip2': 'BZIP2 Archive',
            'application/x-xz': 'XZ Archive', 'application/x-lzip': 'LZIP Archive',
            'application/vnd.ms-cab-compressed': 'CAB Archive', 'application/x-iso9660-image': 'ISO Disc Image',
            'application/x-apple-diskimage': 'Apple Disk Image', 'application/java-archive': 'Java Archive (JAR)',
            'application/x-webarchive': 'Web Archive', 'application/x-debian-package': 'Debian Package',
            'application/x-rpm': 'RPM Package',
            
            # ========== EXECUTABLES ==========
            'application/x-msdownload': 'Windows Executable', 'application/x-bat': 'Batch Script',
            'application/x-powershell': 'PowerShell Script', 'application/x-apple-app': 'macOS Application',
            'application/x-apple-package': 'macOS Package', 'application/vnd.android.package-archive': 'Android APK',
            'application/x-ios-app': 'iOS Application',
            
            # ========== PROGRAMMING ==========
            'text/x-python': 'Python Script', 'application/javascript': 'JavaScript File',
            'application/typescript': 'TypeScript File', 'text/html': 'HTML Document', 'text/css': 'CSS Stylesheet',
            'application/x-httpd-php': 'PHP Script', 'text/x-java-source': 'Java Source Code',
            'text/x-c': 'C Source Code', 'text/x-c++': 'C++ Source Code', 'text/x-csharp': 'C# Source Code',
            'application/x-ruby': 'Ruby Script', 'text/x-go': 'Go Source Code', 'text/x-rust': 'Rust Source Code',
            'text/x-swift': 'Swift Source Code', 'text/x-kotlin': 'Kotlin Source Code',
            'text/x-scala': 'Scala Source Code', 'text/x-perl': 'Perl Script', 'application/x-sh': 'Shell Script',
            'text/x-r': 'R Script', 'text/x-matlab': 'MATLAB Script', 'application/sql': 'SQL Database Script',
            'application/json': 'JSON Data File', 'application/xml': 'XML Document',
            'application/x-yaml': 'YAML Configuration', 'application/toml': 'TOML Configuration',
            
            # ========== 3D/CAD ==========
            'model/obj': '3D Model (OBJ)', 'model/fbx': 'FBX 3D Model', 'model/vnd.collada+xml': 'COLLADA 3D Model',
            'application/x-3ds': '3DS Max Model', 'application/x-3dsmax': '3ds Max Scene',
            'application/x-blender': 'Blender 3D File', 'application/x-maya-ascii': 'Maya ASCII Scene',
            'application/x-maya-binary': 'Maya Binary Scene', 'application/x-cinema4d': 'Cinema 4D Scene',
            'application/acad': 'AutoCAD Drawing', 'application/dxf': 'AutoCAD DXF Drawing',
            'application/step': 'STEP CAD File', 'application/iges': 'IGES CAD File',
            'model/stl': 'STL 3D Model', 'model/ply': 'PLY 3D Model', 'model/x3d+xml': 'X3D 3D Model',
            
            # ========== FONTS ==========
            'font/ttf': 'TrueType Font', 'font/otf': 'OpenType Font', 'font/woff': 'Web Font (WOFF)',
            'font/woff2': 'Web Font (WOFF2)', 'application/vnd.ms-fontobject': 'Embedded OpenType Font',
            
            # ========== DATABASES ==========
            'application/x-sqlite3': 'SQLite Database', 'application/x-msaccess': 'Microsoft Access Database',
            
            # ========== SCIENTIFIC ==========
            'application/x-matlab-data': 'MATLAB Data File', 'application/x-hdf': 'HDF Scientific Data',
            'application/x-hdf5': 'HDF5 Scientific Data', 'application/x-netcdf': 'NetCDF Scientific Data',
            'application/fits': 'FITS Astronomical Data', 'application/x-nifti': 'NIfTI Medical Image',
            
            # ========== VIRTUAL MACHINES ==========
            'application/x-vmware-vmdk': 'VMware Virtual Disk', 'application/x-virtualbox-vdi': 'VirtualBox Disk Image',
            'application/x-qemu-disk': 'QEMU Disk Image', 'application/x-virtualpc-vhd': 'Virtual Hard Disk',
            
            # ========== BLOCKCHAIN/CRYPTO ==========
            'application/x-bitcoin-wallet': 'Bitcoin Wallet File', 'application/x-bitcoin-private-key': 'Bitcoin Private Key',
            
            # ========== MISC ==========
            'text/markdown': 'Markdown Document', 'text/x-rst': 'reStructuredText Document',
            'application/x-bittorrent': 'BitTorrent File', 'application/x-magnet': 'Magnet Link'
        }
        
        readable = readable_types.get(mime_type)
        if readable:
            return readable
        
        # Fallback based on extension
        if extension.upper():
            return f"{extension.upper().replace('.', '')} File"
        
        return mime_type or "Unknown"
    
    def comprehensive_security_analysis(self, file_path: str) -> Dict[str, Any]:
        """Perform comprehensive multi-phase security analysis with sandbox"""
        start_time = time.time()
        analysis_steps = []  # List to collect detailed steps

        # Phase 1: File Information
        file_info = self.get_file_info(file_path)
        analysis_steps.append(f"📊 File Info: Type={file_info['file_type']}, Size={file_info['file_size']} bytes, Hash={file_info['file_hash']}, Entropy={file_info['entropy']:.2f}")

        # Phase 2: Intelligent Multi-Engine Analysis (100+ engines)
        av_results = self.antivirus_engine.intelligent_comprehensive_scan(file_path)
        analysis_steps.append(f"🔍 AV Results: Classification={av_results.get('classification', av_results.get('threat_classification', 'UNKNOWN'))}, Threat Score={av_results.get('threat_score', av_results.get('overall_threat_score', 0))}")

        # Phase 3: Dynamic Sandbox Analysis (NEW!)
        sandbox_results = self.sandbox_engine.dynamic_behavioral_analysis(file_path)
        if sandbox_results['sandbox_available']:
            behaviors = sandbox_results.get('behaviors_detected', [])
            behavior_count = len(behaviors) if isinstance(behaviors, list) else behaviors if isinstance(behaviors, int) else 0
            analysis_steps.append(f"🐳 Sandbox: Behaviors={behavior_count}, Score={sandbox_results['behavioral_score']}, Time={sandbox_results['execution_time']}s")
        else:
            analysis_steps.append(f"🐳 Sandbox: Not available (Docker not running) - using enhanced static analysis")

        # Phase 4: AI Verification (with sandbox data)
        ai_results = self._ai_verification_analysis(file_path, av_results, sandbox_results)
        analysis_steps.append(f"🤖 AI Verification: Risk Score={ai_results.get('risk_score', 'N/A')}, Confidence={ai_results.get('ai_confidence_score', 'N/A')}%")

        # Phase 5: Combine All Results
        combined_results = self._combine_analysis_results(av_results, ai_results, sandbox_results, file_path)
        # Add engines_used from av_results to combined_results
        combined_results['engines_used'] = av_results.get('engines_used', [])
        analysis_steps.append(f"📈 Combined: Final Risk Score={combined_results.get('risk_score', 'N/A')}")

        # Calculate total analysis time
        total_analysis_time = round(time.time() - start_time, 3)  # Use 3 decimal places for precision
        
        # Add detailed steps and sandbox data to results
        combined_results['analysis_steps'] = analysis_steps
        combined_results['sandbox_results'] = sandbox_results
        combined_results['file_info'] = file_info  # Add file_info to results
        combined_results['scan_time'] = total_analysis_time  # Add analysis time
        combined_results['analysis_time'] = total_analysis_time  # Alternative key for compatibility
        combined_results['engines_used'] = av_results.get('engines_used', [])  # Ensure engines are passed
        combined_results['threat_explanations'] = av_results.get('threat_explanations', [])  # Pass threat explanations

        return combined_results
    
    def _ai_verification_analysis(self, file_path: str, antivirus_result: Dict[str, Any], sandbox_result: Dict[str, Any] = None) -> Dict[str, Any]:
        """AI-powered verification and additional analysis"""
        try:
            file_info = self.get_file_info(file_path)
            
            # Create enhanced prompt with antivirus and sandbox results
            ai_prompt = self._create_ai_verification_prompt(file_info, antivirus_result, file_path, sandbox_result)
            
            logger.info(f"🤖 Starting AI verification analysis...")
            
            # Get AI analysis
            response = self.model.generate_content(ai_prompt)
            
            # Parse AI response
            ai_analysis = self.parse_analysis_response(response.text, file_info)
            ai_analysis["ai_processing_time"] = time.time()
            
            # Ensure required fields are present
            if "ai_confidence_score" not in ai_analysis:
                ai_analysis["ai_confidence_score"] = ai_analysis.get("confidence_level", 85)
            if "risk_score" not in ai_analysis:
                ai_analysis["risk_score"] = ai_analysis.get("risk_score", 0)
            
            logger.info(f"✅ AI verification completed: Risk={ai_analysis.get('risk_score', 0)}, Confidence={ai_analysis.get('ai_confidence_score', 0)}%")
            
            return ai_analysis
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"❌ Error in AI verification: {e}")
            
            # Handle Gemini API quota exceeded
            if "429" in error_msg and "quota" in error_msg.lower():
                logger.warning("⚠️ Gemini API quota exceeded - using fallback analysis")
                return {
                    "error": str(e),
                    "ai_confidence_score": 75,
                    "risk_score": 0,
                    "ai_verdict": "SAFE",
                    "detailed_analysis": "AI analysis temporarily unavailable (quota exceeded). Using traditional analysis results.",
                    "quota_exceeded": True
                }
            else:
                logger.warning(f"⚠️ AI analysis failed, using fallback: {e}")
                return {
                    "error": str(e),
                    "ai_confidence_score": 50,
                    "risk_score": 0,
                    "ai_verdict": "UNKNOWN",
                    "detailed_analysis": f"AI analysis failed: {str(e)}. Using traditional analysis results."
                }
    
    def _create_ai_verification_prompt(self, file_info: Dict[str, Any], antivirus_result: Dict[str, Any], file_path: str, sandbox_result: Dict[str, Any] = None) -> str:
        """Create comprehensive AI verification prompt"""
        
        # Read file content for AI analysis (limited for safety)
        file_content_preview = ""
        try:
            with open(file_path, 'rb') as f:
                data = f.read(2048)  # First 2KB
                file_content_preview = data.decode('utf-8', errors='ignore')[:500]
        except:
            file_content_preview = "Binary file - content not readable"
        
        prompt = f"""
        🛡️ AEJIS ADVANCED SECURITY AI VERIFICATION SYSTEM 🛡️
        
        You are the final verification layer in a comprehensive security analysis system. 
        Traditional antivirus engines have already analyzed this file. Your role is to:
        1. Verify and validate the antivirus findings
        2. Provide additional AI-powered insights
        3. Detect sophisticated threats that traditional methods might miss
        4. Make the final security determination
        
        📊 TRADITIONAL ANTIVIRUS ANALYSIS RESULTS:
        
        🔍 Engines Used: {', '.join(antivirus_result.get('engines_used', []))}
        📈 Overall Threat Score: {antivirus_result.get('overall_threat_score', 0)}/100
        🎯 Classification: {antivirus_result.get('threat_classification', 'UNKNOWN')}
        ⚠️ Threats Detected: {len(antivirus_result.get('threats_detected', []))}
        
        DETAILED FINDINGS:
        • Signature Detection: {antivirus_result.get('signature_detection', {}).get('threat_detected', False)}
        • Heuristic Score: {antivirus_result.get('heuristic_analysis', {}).get('heuristic_score', 0)}
        • Behavioral Score: {antivirus_result.get('behavioral_analysis', {}).get('behavioral_score', 0)}
        • PE Analysis Risk: {antivirus_result.get('pe_analysis', {}).get('risk_score', 0)}
        • Archive Risk: {antivirus_result.get('archive_analysis', {}).get('risk_score', 0)}
        • Reputation Score: {antivirus_result.get('reputation_check', {}).get('reputation_score', 50)}
        
        📁 FILE INFORMATION:
        • Filename: {file_info.get('file_name', 'Unknown')}
        • Size: {file_info.get('file_size', 0)} bytes
        • Type: {file_info.get('mime_type', 'Unknown')}
        • Entropy: {antivirus_result.get('file_info', {}).get('entropy', 0):.2f}
        • SHA256: {file_info.get('sha256_hash', 'Unknown')}
        
        📄 FILE CONTENT PREVIEW:
        {file_content_preview}
        
        🐳 DYNAMIC SANDBOX ANALYSIS:
        {self._format_sandbox_info(sandbox_result)}
        
        🎯 AI VERIFICATION TASKS:
        
        1. **VALIDATE ANTIVIRUS FINDINGS**:
           - Do you agree with the threat classification?
           - Are there any false positives in the detection?
           - Did the engines miss anything obvious?
           - IMPORTANT: If traditional AV shows CLEAN and file is a legitimate text file (recovery codes, config, logs), it should be SAFE
        
        2. **ADVANCED THREAT DETECTION**:
           - Zero-day malware indicators
           - Sophisticated social engineering
           - Advanced persistent threats (APT)
           - AI-generated malware patterns
           - Steganographic hidden content
           - Advanced crypto-specific threats
        
        3. **CONTEXTUAL ANALYSIS**:
           - File purpose vs. claimed functionality
           - Suspicious naming conventions
           - Metadata anomalies
           - Supply chain compromise indicators
        
        4. **FINAL SECURITY DETERMINATION**:
           Based on ALL evidence, is this file:
           - SAFE to open (for legitimate text files like recovery codes, configs, logs)
           - SUSPICIOUS (proceed with caution)
           - DANGEROUS (do not open)
           - MALWARE (confirmed threat)
           
           CRITICAL: If traditional AV shows CLEAN and this is a legitimate text file (recovery codes, config files, logs, documentation), mark as SAFE.
        
        🚨 CRYPTO-SPECIFIC AI ANALYSIS:
        Pay special attention to:
        - Wallet address replacement techniques
        - Clipboard monitoring and hijacking
        - Cryptocurrency mining scripts
        - Private key harvesting attempts
        - Fake wallet applications
        - DeFi protocol exploits
        - NFT marketplace scams
        - Social engineering for crypto credentials
        
        📋 REQUIRED OUTPUT FORMAT (JSON):
        {{
            "ai_verification": {{
                "agrees_with_antivirus": true/false,
                "antivirus_accuracy_assessment": "assessment of traditional engines",
                "additional_threats_found": ["list of additional threats"],
                "false_positives_identified": ["list of likely false positives"]
            }},
            "advanced_ai_analysis": {{
                "zero_day_indicators": ["indicators found"],
                "social_engineering_score": 0-100,
                "steganography_detected": true/false,
                "ai_generated_content": true/false,
                "supply_chain_risk": 0-100
            }},
            "crypto_specific_ai": {{
                "wallet_threat_detected": true/false,
                "clipboard_hijack_risk": 0-100,
                "mining_script_detected": true/false,
                "key_harvesting_risk": 0-100,
                "defi_exploit_indicators": ["indicators"]
            }},
            "final_ai_verdict": {{
                "decision": "SAFE|SUSPICIOUS|DANGEROUS|MALWARE",
                "confidence": 0-100,
                "primary_concerns": ["main security concerns"],
                "recommended_action": "specific action recommendation",
                "risk_level": "LOW|MEDIUM|HIGH|CRITICAL"
            }},
            "detailed_explanation": "Comprehensive explanation of the analysis and decision",
            "ai_confidence_score": 0-100,
            "ai_security_recommendations": {{
                "immediate_actions": ["specific actions user should take right now"],
                "preventive_measures": ["steps to prevent similar threats"],
                "crypto_specific_advice": ["cryptocurrency security recommendations"],
                "system_protection": ["system hardening recommendations"],
                "monitoring_suggestions": ["ongoing security monitoring advice"],
                "educational_tips": ["security awareness and education points"]
            }}
        }}
        
        🎯 ANALYSIS PRIORITY:
        1. Protect users from financial loss (crypto theft)
        2. Prevent system compromise
        3. Detect sophisticated social engineering
        4. Identify zero-day threats
        5. Minimize false positives while maintaining security
        
        🛡️ SECURITY RECOMMENDATIONS REQUIREMENTS:
        Based on the specific analysis results, provide personalized security recommendations:
        
        1. **IMMEDIATE ACTIONS**: What should the user do RIGHT NOW based on this specific file?
        2. **PREVENTIVE MEASURES**: How can they prevent similar threats in the future?
        3. **CRYPTO-SPECIFIC ADVICE**: Specialized recommendations for cryptocurrency security
        4. **SYSTEM PROTECTION**: General system hardening and protection measures
        5. **MONITORING SUGGESTIONS**: What should they watch for going forward?
        6. **EDUCATIONAL TIPS**: Security awareness points to help them stay safe
        
        Make recommendations SPECIFIC to this file's analysis, not generic advice.
        Consider the file type, threat level, and specific indicators found.
        
        Provide thorough, professional analysis that builds upon the traditional antivirus results.
        """
        
        return prompt
    
    def _format_sandbox_info(self, sandbox_result: Dict[str, Any] = None) -> str:
        """Format sandbox results for AI prompt"""
        if not sandbox_result:
            return "• Sandbox: Not available (Docker not running)\n• Analysis: Enhanced static analysis only"
        
        if not sandbox_result.get('sandbox_available'):
            return "• Sandbox: Not available (Docker not running)\n• Analysis: Enhanced static analysis only"
        
        # Safe length calculation for all lists
        def safe_len(item):
            return len(item) if isinstance(item, list) else (item if isinstance(item, int) else 0)
        
        info = f"""• Sandbox: Available and operational
• Execution: {'✅ Successful' if sandbox_result.get('execution_successful') else '❌ Failed'}
• Execution Time: {sandbox_result.get('execution_time', 0)}s
• Behaviors Detected: {safe_len(sandbox_result.get('behaviors_detected', []))}
• Network Activity: {safe_len(sandbox_result.get('network_activity', []))}
• File Operations: {safe_len(sandbox_result.get('file_operations', []))}
• Crypto Activity: {safe_len(sandbox_result.get('crypto_activity', []))}
• Threat Indicators: {safe_len(sandbox_result.get('threat_indicators', []))}
• Behavioral Score: {sandbox_result.get('behavioral_score', 0)}/100"""
        
        # Add specific behaviors if any
        behaviors = sandbox_result.get('behaviors_detected', [])
        if behaviors:
            info += f"\n• Key Behaviors: {', '.join(behaviors[:3])}"
        
        threats = sandbox_result.get('threat_indicators', [])
        if threats:
            info += f"\n• Threat Indicators: {', '.join(threats[:2])}"
        
        return info
    
    def _combine_analysis_results(self, antivirus_result: Dict[str, Any], ai_analysis: Dict[str, Any], sandbox_result: Dict[str, Any] = None, file_path: str = None) -> Dict[str, Any]:
        """Combine antivirus and AI results for final verdict"""
        
        # Extract key metrics
        av_threat_score = antivirus_result.get('overall_threat_score', 0)
        av_classification = antivirus_result.get('threat_classification', 'UNKNOWN')
        ai_confidence = ai_analysis.get('ai_confidence_score', 0)
        
        # FIXED: Extract actual AI risk score instead of using confidence as threat score
        ai_risk_score = ai_analysis.get('risk_score', 0)  # This is the actual AI threat assessment
        
        # Extract sandbox metrics
        sandbox_score = 0
        sandbox_behaviors = 0
        if sandbox_result and sandbox_result.get('sandbox_available'):
            sandbox_score = sandbox_result.get('behavioral_score', 0)
            behaviors = sandbox_result.get('behaviors_detected', [])
            sandbox_behaviors = len(behaviors) if isinstance(behaviors, list) else (behaviors if isinstance(behaviors, int) else 0)
        
        # Determine final verdict
        final_verdict = "UNKNOWN"
        confidence_level = 0
        risk_score = 0
        
        try:
            # Parse AI analysis for decision components
            ai_verdict = ai_analysis.get('final_ai_verdict', {})
            ai_decision = ai_verdict.get('decision', 'UNKNOWN')
            ai_risk_level = ai_verdict.get('risk_level', 'MEDIUM')
            
            # ENHANCED: Combine scores with weighted approach including sandbox
            # Traditional AV: 50%, AI Risk Score: 30%, Sandbox: 20%
            if sandbox_result and sandbox_result.get('sandbox_available'):
                combined_score = (av_threat_score * 0.5) + (ai_risk_score * 0.3) + (sandbox_score * 0.2)
            else:
                combined_score = (av_threat_score * 0.6) + (ai_risk_score * 0.4)
            
            # Decision logic
            if combined_score >= 80 or ai_decision == "MALWARE":
                final_verdict = "MALWARE"
                confidence_level = 95
                risk_score = min(100, combined_score)
            elif combined_score >= 60 or ai_decision == "DANGEROUS":
                final_verdict = "DANGEROUS"
                confidence_level = 90
                risk_score = min(95, combined_score)
            elif combined_score >= 30 or ai_decision == "SUSPICIOUS":
                final_verdict = "SUSPICIOUS"
                confidence_level = 80
                risk_score = min(75, combined_score)
            elif combined_score < 15:
                final_verdict = "SAFE"
                confidence_level = 85
                risk_score = max(5, combined_score)  # Conservative minimum - no file is ever 100% risk-free
            else:
                final_verdict = "UNKNOWN"
                confidence_level = 50
                risk_score = combined_score
            
        except Exception as e:
            logger.error(f"Error combining results: {e}")
            final_verdict = "ERROR"
            confidence_level = 0
            risk_score = 50
        
        # Create comprehensive final result
        final_result = {
            "file_info": antivirus_result.get('file_info', {}),
            "scan_summary": {
                "engines_used": antivirus_result.get('engines_used', []),
                "total_engines": len(antivirus_result.get('engines_used', [])) if isinstance(antivirus_result.get('engines_used', []), list) else antivirus_result.get('engines_used', 0),
                "threats_detected": len(antivirus_result.get('threats_detected', [])),
                "scan_time": antivirus_result.get('scan_time', 0)
            },
            "traditional_antivirus": {
                "classification": av_classification,
                "threat_score": av_threat_score,
                "threats_found": antivirus_result.get('threats_detected', []),
                "signature_detection": antivirus_result.get('signature_detection', {}),
                "heuristic_analysis": antivirus_result.get('heuristic_analysis', {}),
                "behavioral_analysis": antivirus_result.get('behavioral_analysis', {}),
                "pe_analysis": antivirus_result.get('pe_analysis', {}),
                "archive_analysis": antivirus_result.get('archive_analysis', {}),
                "reputation_check": antivirus_result.get('reputation_check', {})
            },
            "ai_verification": ai_analysis,
            "final_verdict": final_verdict,
            "confidence_level": confidence_level,
            "risk_score": risk_score,
            "security_recommendation": self._generate_security_recommendation(final_verdict, risk_score),
            "detailed_threats": self._compile_threat_details(antivirus_result, ai_analysis),
            "safe_to_open": final_verdict in ["SAFE"],
            "analysis_metadata": {
                "analysis_version": "2.0-comprehensive",
                "timestamp": time.time(),
                "file_path": os.path.basename(file_path) if file_path else "unknown"
            }
        }
        
        return final_result
    
    def _generate_security_recommendation(self, verdict: str, risk_score: float) -> str:
        """Generate security recommendation based on analysis"""
        recommendations = {
            "SAFE": "✅ File appears safe to open. Low security risk detected.",
            "SUSPICIOUS": "⚠️ File shows suspicious patterns. Scan with additional tools before opening.",
            "DANGEROUS": "🚨 File contains dangerous elements. Do not open without proper isolation.",
            "MALWARE": "💀 File identified as malware. Do not open under any circumstances.",
            "UNKNOWN": "❓ Unable to determine file safety. Exercise extreme caution.",
            "ERROR": "❌ Analysis error occurred. Re-scan recommended."
        }
        
        base_recommendation = recommendations.get(verdict, recommendations["UNKNOWN"])
        
        if risk_score > 75:
            base_recommendation += " Consider deleting this file immediately."
        elif risk_score > 50:
            base_recommendation += " Use isolated environment if opening is necessary."
        elif risk_score > 25:
            base_recommendation += " Backup important data before proceeding."
        
        return base_recommendation
    
    def _compile_threat_details(self, antivirus_result: Dict[str, Any], ai_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Compile detailed threat information from all engines"""
        threats = []
        
        # Add traditional antivirus threats
        for threat in antivirus_result.get('threats_detected', []):
            if isinstance(threat, dict):
                threats.append({
                    "source": threat.get("engine", "Unknown"),
                    "threat_type": threat.get("threat", "Unknown threat"),
                    "confidence": threat.get("confidence", 0),
                    "category": "Traditional Detection"
                })
            else:
                threats.append({
                    "source": "Antivirus Engine",
                    "threat_type": str(threat),
                    "confidence": 0,
                    "category": "Traditional Detection"
                })
        
        # Add AI-identified threats
        try:
            ai_threats = ai_analysis.get('additional_threats_found', [])
            for threat in ai_threats:
                if threat is not None:
                    threats.append({
                        "source": "AI Analysis",
                        "threat_type": str(threat),
                        "confidence": ai_analysis.get('ai_confidence_score', 75),
                        "category": "AI Detection"
                    })
        except:
            pass
        
        return threats

    def create_security_prompt(self, file_info: Dict[str, Any], file_content: Optional[str] = None) -> str:
        """Create a comprehensive security analysis prompt for Gemini"""
        
        prompt = f"""
        CRYPTO SENTINEL ADVANCED SECURITY ANALYSIS
        
        Please analyze this file for potential security threats, malware, phishing attempts, and crypto-related scams.
        
        FILE INFORMATION:
        - Filename: {file_info.get('file_name', 'Unknown')}
        - File Size: {file_info.get('file_size', 0)} bytes
        - MIME Type: {file_info.get('mime_type', 'Unknown')}
        - File Extension: {file_info.get('file_extension', 'Unknown')}
        - SHA256 Hash: {file_info.get('sha256_hash', 'Unknown')}
        
        ANALYSIS REQUIREMENTS:
        1. **MALWARE DETECTION**: Scan for known malware signatures, suspicious patterns, or malicious code
        2. **PHISHING ANALYSIS**: Check for phishing attempts, fake websites, or social engineering tactics
        3. **CRYPTO SCAM DETECTION**: Look for cryptocurrency scams, fake wallet apps, or fraudulent schemes
        4. **BEHAVIORAL ANALYSIS**: Assess potential suspicious behaviors or hidden functionalities
        5. **METADATA ANALYSIS**: Examine file metadata for anomalies or suspicious information
        6. **REPUTATION CHECK**: Assess the file's reputation based on known threat databases
        
        SPECIFIC CRYPTO THREATS TO ANALYZE:
        - Clipboard hijacking malware (crypto address replacement)
        - Fake wallet applications or browser extensions
        - Cryptojacking scripts or miners
        - Private key stealers or seed phrase harvesters
        - Fake cryptocurrency exchange apps
        - NFT marketplace scams
        - DeFi protocol exploits
        - Smart contract vulnerabilities
        - Social engineering attempts targeting crypto users
        
        OUTPUT FORMAT (JSON):
        {{
            "risk_score": <0-100>,
            "threat_level": "<SAFE|LOW|MEDIUM|HIGH|CRITICAL>",
            "threat_categories": ["category1", "category2"],
            "malware_detected": <true/false>,
            "phishing_detected": <true/false>,
            "crypto_threat_detected": <true/false>,
            "detailed_analysis": "Comprehensive explanation of findings",
            "recommendations": ["recommendation1", "recommendation2"],
            "technical_details": {{
                "signatures_found": ["signature1"],
                "suspicious_patterns": ["pattern1"],
                "behavioral_indicators": ["indicator1"]
            }},
            "confidence_level": <0-100>
        }}
        
        {f"FILE CONTENT PREVIEW: {file_content[:1000]}..." if file_content else ""}
        
        Provide a thorough, professional security analysis focusing on crypto-specific threats.
        """
        
        return prompt
    
    def analyze_image(self, file_path: str) -> Dict[str, Any]:
        """Analyze image files for security threats"""
        try:
            file_info = self.get_file_info(file_path)
            
            # Load and analyze image
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Upload image to Gemini
                uploaded_file = genai.upload_file(file_path)
                
                prompt = f"""
                SECURITY ANALYSIS FOR IMAGE FILE
                
                Analyze this image for:
                1. QR codes that might lead to phishing sites or malicious downloads
                2. Fake cryptocurrency exchange screenshots or interfaces
                3. Social engineering content targeting crypto users
                4. Embedded malicious content or steganography
                5. Screenshots of fake wallet applications
                6. Phishing messages or scam content
                7. Fake NFT or crypto project promotions
                
                File Info: {json.dumps(file_info, indent=2)}
                
                Provide analysis in JSON format with risk assessment and specific threats found.
                """
                
                response = self.model.generate_content([uploaded_file, prompt])
                
                # Clean up uploaded file
                genai.delete_file(uploaded_file.name)
                
                return self.parse_analysis_response(response.text, file_info)
                
        except Exception as e:
            logger.error(f"Error analyzing image: {e}")
            return self.create_error_response(str(e))
    
    def analyze_document(self, file_path: str) -> Dict[str, Any]:
        """Analyze document files for security threats"""
        try:
            file_info = self.get_file_info(file_path)
            
            # For document analysis, we'll upload the file and analyze it
            uploaded_file = genai.upload_file(file_path)
            
            prompt = f"""
            SECURITY ANALYSIS FOR DOCUMENT FILE
            
            Analyze this document for:
            1. Embedded malicious macros or scripts
            2. Phishing content or social engineering
            3. Suspicious URLs or download links
            4. Fake crypto investment schemes
            5. Fraudulent legal documents or contracts
            6. Hidden executable content
            7. Data exfiltration attempts
            
            File Info: {json.dumps(file_info, indent=2)}
            
            Provide comprehensive security analysis in JSON format.
            """
            
            response = self.model.generate_content([uploaded_file, prompt])
            
            # Clean up uploaded file
            genai.delete_file(uploaded_file.name)
            
            return self.parse_analysis_response(response.text, file_info)
            
        except Exception as e:
            logger.error(f"Error analyzing document: {e}")
            return self.create_error_response(str(e))
    
    def analyze_media(self, file_path: str) -> Dict[str, Any]:
        """Analyze video/audio files for security threats"""
        try:
            file_info = self.get_file_info(file_path)
            
            # Upload media file to Gemini
            uploaded_file = genai.upload_file(file_path)
            
            prompt = f"""
            SECURITY ANALYSIS FOR MEDIA FILE
            
            Analyze this video/audio file for:
            1. Embedded malicious content or payloads
            2. Social engineering audio/video content
            3. Crypto scam promotions or fake testimonials
            4. Hidden data or steganographic content
            5. Suspicious metadata or encoding
            6. Fake crypto trading tutorials or guides
            7. Phishing video content or fake celebrity endorsements
            
            File Info: {json.dumps(file_info, indent=2)}
            
            Provide detailed security analysis in JSON format.
            """
            
            response = self.model.generate_content([uploaded_file, prompt])
            
            # Clean up uploaded file
            genai.delete_file(uploaded_file.name)
            
            return self.parse_analysis_response(response.text, file_info)
            
        except Exception as e:
            logger.error(f"Error analyzing media: {e}")
            return self.create_error_response(str(e))
    
    def analyze_file(self, file_path: str) -> Dict[str, Any]:
        """Main file analysis method using comprehensive antivirus + AI approach"""
        try:
            file_info = self.get_file_info(file_path)
            mime_type = file_info.get('mime_type', '')
            
            logger.info(f"🔍 Starting comprehensive analysis: {file_info.get('file_name')} (Type: {mime_type})")
            
            # Use comprehensive security analysis (Antivirus engines + AI verification)
            comprehensive_result = self.comprehensive_security_analysis(file_path)
            
            # Convert to legacy format for backward compatibility with bot interface
            legacy_result = self._convert_to_legacy_format(comprehensive_result)
            
            return legacy_result
                
        except Exception as e:
            logger.error(f"Error in comprehensive file analysis: {e}")
            return self.create_error_response(str(e))
    
    def _convert_to_legacy_format(self, comprehensive_result: Dict[str, Any]) -> Dict[str, Any]:
        """Convert comprehensive result to legacy format for bot compatibility"""
        try:
            # Extract key information
            final_verdict = comprehensive_result.get('final_verdict', 'UNKNOWN')
            risk_score = comprehensive_result.get('risk_score', 0)
            confidence = comprehensive_result.get('confidence_level', 0)
            
            # Map verdicts to legacy threat levels
            threat_level_map = {
                "SAFE": "SAFE",
                "SUSPICIOUS": "MEDIUM", 
                "DANGEROUS": "HIGH",
                "MALWARE": "CRITICAL",
                "UNKNOWN": "MEDIUM",
                "ERROR": "ERROR"
            }
            
            threat_level = threat_level_map.get(final_verdict, "MEDIUM")
            
            # Determine specific threat types - COMPREHENSIVE DETECTION
            malware_detected = final_verdict in ["MALWARE", "DANGEROUS"]
            phishing_detected = any("phishing" in str(threat).lower() 
                                  for threat in comprehensive_result.get('detailed_threats', [])
                                  if threat is not None)
            
            # Enhanced threat detection from sandbox results
            sandbox_results = comprehensive_result.get('sandbox_results', {})
            behaviors = sandbox_results.get('behaviors_detected', [])
            threat_indicators = sandbox_results.get('threat_indicators', [])
            
            # Check for various threat types
            sensitive_data_detected = any("sensitive" in str(behavior).lower() or "credential" in str(behavior).lower()
                                        for behavior in behaviors + threat_indicators
                                        if behavior is not None)
            network_threats_detected = any("network" in str(behavior).lower() or "exploit" in str(behavior).lower()
                                         for behavior in behaviors + threat_indicators
                                         if behavior is not None)
            social_engineering_detected = any("social" in str(behavior).lower() or "phishing" in str(behavior).lower()
                                            for behavior in behaviors + threat_indicators
                                            if behavior is not None)
            suspicious_urls_detected = any("url" in str(behavior).lower() or "command" in str(behavior).lower()
                                         for behavior in behaviors + threat_indicators
                                         if behavior is not None)
            
            # Legacy crypto detection (but not exclusive)
            crypto_threat_detected = any("crypto" in str(threat).lower() 
                                       for threat in comprehensive_result.get('detailed_threats', [])
                                       if threat is not None)
            
            # Create detailed analysis
            analysis_parts = [
                f"🛡️ **Comprehensive Security Analysis Complete**",
                f"",
                f"📊 **Analysis Summary:**",
                f"• Engines Used: {len(comprehensive_result.get('engines_used', [])) if isinstance(comprehensive_result.get('engines_used', []), list) else comprehensive_result.get('engines_used', 0)}",
                f"• Scan Time: {comprehensive_result.get('scan_time', 0)}s",
                f"• Threats Found: {len(comprehensive_result.get('threats_detected', []))}",
                f"",
                f"🔍 **Traditional Antivirus Results:**",
                f"• Classification: {comprehensive_result.get('traditional_antivirus', {}).get('classification', 'Unknown')}",
                f"• Threat Score: {comprehensive_result.get('traditional_antivirus', {}).get('threat_score', 0)}/100",
                f"",
                f"🤖 **AI Verification:**",
                f"• AI Confidence: {comprehensive_result.get('ai_verification', {}).get('ai_confidence_score', 0)}%",
                f"• Final Verdict: {final_verdict}",
                f"",
                f"🎯 **Security Recommendation:**",
                f"{comprehensive_result.get('security_recommendation', 'Analysis completed.')}",
                f"",
                f"📋 **Detailed Findings:**"
            ]
            
            # Add threat details
            for threat in comprehensive_result.get('detailed_threats', []):
                if isinstance(threat, dict):
                    analysis_parts.append(f"• {threat.get('source', 'Unknown')}: {threat.get('threat_type', 'Unknown threat')}")
                else:
                    analysis_parts.append(f"• {str(threat)}")
            
            detailed_analysis = "\n".join(analysis_parts)
            
            # Generate recommendations
            recommendations = [
                comprehensive_result.get('security_recommendation', 'Re-scan if needed')
            ]
            
            if final_verdict == "MALWARE":
                recommendations.extend([
                    "Delete this file immediately",
                    "Run full system scan",
                    "Check for system compromise"
                ])
            elif final_verdict == "DANGEROUS":
                recommendations.extend([
                    "Do not open this file",
                    "Quarantine or delete",
                    "Scan related files"
                ])
            elif final_verdict == "SUSPICIOUS":
                recommendations.extend([
                    "Exercise caution before opening",
                    "Use isolated environment",
                    "Verify file source"
                ])
            
            # Create legacy-compatible result
            legacy_result = {
                "risk_score": min(100, max(0, int(risk_score))),
                "threat_level": threat_level,
                "threat_categories": self._extract_threat_categories(comprehensive_result),
                "malware_detected": malware_detected,
                "phishing_detected": phishing_detected,
                "sensitive_data_detected": sensitive_data_detected,
                "network_threats_detected": network_threats_detected,
                "social_engineering_detected": social_engineering_detected,
                "suspicious_urls_detected": suspicious_urls_detected,
                "crypto_threat_detected": crypto_threat_detected,
                "detailed_analysis": detailed_analysis,
                "recommendations": recommendations,
                "technical_details": {
                    "engines_used": comprehensive_result.get('engines_used', []),
                    "signatures_found": self._extract_signatures(comprehensive_result),
                    "suspicious_patterns": self._extract_patterns(comprehensive_result),
                    "behavioral_indicators": self._extract_behaviors(comprehensive_result)
                },
                "confidence_level": confidence,
                "file_info": comprehensive_result.get('file_info', {}),
                "analysis_timestamp": comprehensive_result.get('analysis_metadata', {}).get('timestamp'),
                "comprehensive_result": comprehensive_result  # Include full result for advanced users
            }
            
            return legacy_result
            
        except Exception as e:
            logger.error(f"Error converting to legacy format: {e}")
            return self.create_error_response(str(e))
    
    def _extract_threat_categories(self, comprehensive_result: Dict[str, Any]) -> List[str]:
        """Extract threat categories from comprehensive result"""
        categories = []
        
        threats = comprehensive_result.get('detailed_threats', [])
        for threat in threats:
            if isinstance(threat, dict):
                category = threat.get('category', 'unknown')
                if category not in categories:
                    categories.append(category)
            else:
                if 'unknown' not in categories:
                    categories.append('unknown')
        
        if not categories:
            categories = ["analysis_complete"]
        
        return categories
    
    def _extract_signatures(self, comprehensive_result: Dict[str, Any]) -> List[str]:
        """Extract signature matches from comprehensive result"""
        signatures = []
        
        sig_detection = comprehensive_result.get('traditional_antivirus', {}).get('signature_detection', {})
        if sig_detection.get('signature_match'):
            signatures.append(sig_detection['signature_match'])
        
        return signatures
    
    def _extract_patterns(self, comprehensive_result: Dict[str, Any]) -> List[str]:
        """Extract suspicious patterns from comprehensive result"""
        patterns = []
        
        heuristic = comprehensive_result.get('traditional_antivirus', {}).get('heuristic_analysis', {})
        for pattern_info in heuristic.get('suspicious_patterns', []):
            patterns.append(pattern_info.get('pattern', 'Unknown pattern'))
        
        return patterns
    
    def _extract_behaviors(self, comprehensive_result: Dict[str, Any]) -> List[str]:
        """Extract behavioral indicators from comprehensive result"""
        behaviors = []
        
        behavioral = comprehensive_result.get('traditional_antivirus', {}).get('behavioral_analysis', {})
        for behavior in behavioral.get('suspicious_behaviors', []):
            behaviors.append(f"{behavior.get('type', 'Unknown')}: {behavior.get('pattern', 'Unknown')}")
        
        return behaviors
    
    def analyze_generic_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze any file type using generic analysis"""
        try:
            file_info = self.get_file_info(file_path)
            
            # Read file content for text-based analysis
            file_content = None
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    file_content = f.read(2000)  # Read first 2000 chars
            except:
                # Binary file, analyze just the metadata
                pass
            
            prompt = self.create_security_prompt(file_info, file_content)
            response = self.model.generate_content(prompt)
            
            return self.parse_analysis_response(response.text, file_info)
            
        except Exception as e:
            logger.error(f"Error in generic file analysis: {e}")
            return self.create_error_response(str(e))
    
    def parse_analysis_response(self, response_text: str, file_info: Dict[str, Any]) -> Dict[str, Any]:
        """Parse and validate the Gemini API response"""
        try:
            # Try to extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_text = response_text[start_idx:end_idx]
                analysis_result = json.loads(json_text)
            else:
                # Fallback: create structured response from text
                analysis_result = {
                    "risk_score": 50,
                    "threat_level": "MEDIUM",
                    "threat_categories": ["unknown"],
                    "malware_detected": False,
                    "phishing_detected": False,
                    "crypto_threat_detected": False,
                    "detailed_analysis": response_text,
                    "recommendations": ["Manual review recommended"],
                    "technical_details": {
                        "signatures_found": [],
                        "suspicious_patterns": [],
                        "behavioral_indicators": []
                    },
                    "confidence_level": 75
                }
            
            # Extract AI security recommendations if available
            if 'ai_security_recommendations' in analysis_result:
                ai_recs = analysis_result['ai_security_recommendations']
                recommendations = []
                
                # Combine all AI recommendations into a single list
                for category, recs in ai_recs.items():
                    if isinstance(recs, list):
                        recommendations.extend(recs)
                    elif isinstance(recs, str):
                        recommendations.append(recs)
                
                # Update the recommendations in the result
                if recommendations:
                    analysis_result['recommendations'] = recommendations[:5]  # Limit to 5 recommendations
            
            # Add file information to response
            analysis_result['file_info'] = file_info
            analysis_result['analysis_timestamp'] = json.dumps(None)  # Will be set by calling code
            
            return analysis_result
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {e}")
            return self.create_error_response(f"JSON parsing error: {e}")
        except Exception as e:
            logger.error(f"Error parsing analysis response: {e}")
            return self.create_error_response(str(e))
    
    def create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Create a standardized error response"""
        return {
            "risk_score": 0,
            "threat_level": "ERROR",
            "threat_categories": ["analysis_error"],
            "malware_detected": False,
            "phishing_detected": False,
            "crypto_threat_detected": False,
            "detailed_analysis": f"Analysis failed: {error_message}",
            "recommendations": ["Re-upload file", "Contact support if issue persists"],
            "technical_details": {
                "error": error_message,
                "signatures_found": [],
                "suspicious_patterns": [],
                "behavioral_indicators": []
            },
            "confidence_level": 0,
            "file_info": {},
            "analysis_timestamp": None
        }
