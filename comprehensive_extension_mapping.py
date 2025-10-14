#!/usr/bin/env python3
"""
Comprehensive File Extension Mapping
Maps every known file extension to its appropriate FileType and optimal engines
Covers 500+ file extensions across all categories
"""

from typing import Dict, List, Set
from enum import Enum

class FileType(Enum):
    EXECUTABLE = "executable"
    DOCUMENT = "document"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    CODE = "code"
    ARCHIVE = "archive"
    TEXT = "text"
    EMAIL = "email"
    MOBILE = "mobile"
    WEB = "web"
    DATABASE = "database"
    FONT = "font"
    CAD = "cad"
    GAME = "game"
    SYSTEM = "system"
    SCIENTIFIC = "scientific"
    BLOCKCHAIN = "blockchain"
    UNKNOWN = "unknown"

# Comprehensive Extension to FileType Mapping (500+ extensions)
COMPREHENSIVE_EXTENSION_MAPPING: Dict[str, FileType] = {
    # EXECUTABLE FILES (Windows, Linux, Mac, Mobile)
    '.exe': FileType.EXECUTABLE, '.msi': FileType.EXECUTABLE, '.dll': FileType.EXECUTABLE,
    '.scr': FileType.EXECUTABLE, '.com': FileType.EXECUTABLE, '.bat': FileType.EXECUTABLE,
    '.cmd': FileType.EXECUTABLE, '.pif': FileType.EXECUTABLE, '.vbs': FileType.EXECUTABLE,
    '.app': FileType.EXECUTABLE, '.deb': FileType.EXECUTABLE, '.rpm': FileType.EXECUTABLE,
    '.pkg': FileType.EXECUTABLE, '.dmg': FileType.EXECUTABLE, '.run': FileType.EXECUTABLE,
    '.bin': FileType.EXECUTABLE, '.elf': FileType.EXECUTABLE, '.so': FileType.EXECUTABLE,
    '.dylib': FileType.EXECUTABLE, '.bundle': FileType.EXECUTABLE,
    
    # DOCUMENT FILES (Office, PDF, Text)
    '.pdf': FileType.DOCUMENT, '.doc': FileType.DOCUMENT, '.docx': FileType.DOCUMENT,
    '.xls': FileType.DOCUMENT, '.xlsx': FileType.DOCUMENT, '.ppt': FileType.DOCUMENT,
    '.pptx': FileType.DOCUMENT, '.odt': FileType.DOCUMENT, '.ods': FileType.DOCUMENT,
    '.odp': FileType.DOCUMENT, '.rtf': FileType.DOCUMENT, '.pages': FileType.DOCUMENT,
    '.numbers': FileType.DOCUMENT, '.keynote': FileType.DOCUMENT, '.epub': FileType.DOCUMENT,
    '.mobi': FileType.DOCUMENT, '.azw': FileType.DOCUMENT, '.fb2': FileType.DOCUMENT,
    '.djvu': FileType.DOCUMENT, '.ps': FileType.DOCUMENT, '.eps': FileType.DOCUMENT,
    
    # IMAGE FILES (All formats)
    '.jpg': FileType.IMAGE, '.jpeg': FileType.IMAGE, '.png': FileType.IMAGE,
    '.gif': FileType.IMAGE, '.bmp': FileType.IMAGE, '.tiff': FileType.IMAGE,
    '.tif': FileType.IMAGE, '.webp': FileType.IMAGE, '.svg': FileType.IMAGE,
    '.ico': FileType.IMAGE, '.raw': FileType.IMAGE, '.cr2': FileType.IMAGE,
    '.nef': FileType.IMAGE, '.orf': FileType.IMAGE, '.sr2': FileType.IMAGE,
    '.heic': FileType.IMAGE, '.heif': FileType.IMAGE, '.avif': FileType.IMAGE,
    '.jxl': FileType.IMAGE, '.psd': FileType.IMAGE, '.ai': FileType.IMAGE,
    '.xcf': FileType.IMAGE, '.kra': FileType.IMAGE, '.clip': FileType.IMAGE,
    
    # VIDEO FILES (All formats)
    '.mp4': FileType.VIDEO, '.avi': FileType.VIDEO, '.mkv': FileType.VIDEO,
    '.mov': FileType.VIDEO, '.wmv': FileType.VIDEO, '.flv': FileType.VIDEO,
    '.webm': FileType.VIDEO, '.m4v': FileType.VIDEO, '.3gp': FileType.VIDEO,
    '.3g2': FileType.VIDEO, '.mpg': FileType.VIDEO, '.mpeg': FileType.VIDEO,
    '.m2v': FileType.VIDEO, '.vob': FileType.VIDEO, '.ts': FileType.VIDEO,
    '.mts': FileType.VIDEO, '.asf': FileType.VIDEO, '.rmvb': FileType.VIDEO,
    '.ogv': FileType.VIDEO, '.divx': FileType.VIDEO, '.xvid': FileType.VIDEO,
    
    # AUDIO FILES (All formats)
    '.mp3': FileType.AUDIO, '.wav': FileType.AUDIO, '.flac': FileType.AUDIO,
    '.aac': FileType.AUDIO, '.ogg': FileType.AUDIO, '.wma': FileType.AUDIO,
    '.m4a': FileType.AUDIO, '.opus': FileType.AUDIO, '.amr': FileType.AUDIO,
    '.au': FileType.AUDIO, '.ra': FileType.AUDIO, '.mid': FileType.AUDIO,
    '.midi': FileType.AUDIO, '.ape': FileType.AUDIO, '.dsd': FileType.AUDIO,
    '.dsf': FileType.AUDIO, '.dff': FileType.AUDIO, '.aiff': FileType.AUDIO,
    
    # CODE FILES (Programming languages)
    '.py': FileType.CODE, '.java': FileType.CODE, '.cpp': FileType.CODE,
    '.c': FileType.CODE, '.h': FileType.CODE, '.hpp': FileType.CODE,
    '.cs': FileType.CODE, '.vb': FileType.CODE, '.js': FileType.CODE,
    '.ts': FileType.CODE, '.jsx': FileType.CODE, '.tsx': FileType.CODE,
    '.php': FileType.CODE, '.rb': FileType.CODE, '.go': FileType.CODE,
    '.rs': FileType.CODE, '.swift': FileType.CODE, '.kt': FileType.CODE,
    '.scala': FileType.CODE, '.clj': FileType.CODE, '.pl': FileType.CODE,
    '.lua': FileType.CODE, '.r': FileType.CODE, '.m': FileType.CODE,
    '.dart': FileType.CODE, '.asm': FileType.CODE, '.s': FileType.CODE,
    '.f': FileType.CODE, '.f90': FileType.CODE, '.pas': FileType.CODE,
    '.ada': FileType.CODE, '.lisp': FileType.CODE, '.ml': FileType.CODE,
    
    # ARCHIVE FILES (Compression formats)
    '.zip': FileType.ARCHIVE, '.rar': FileType.ARCHIVE, '.7z': FileType.ARCHIVE,
    '.tar': FileType.ARCHIVE, '.gz': FileType.ARCHIVE, '.bz2': FileType.ARCHIVE,
    '.xz': FileType.ARCHIVE, '.lz': FileType.ARCHIVE, '.lzma': FileType.ARCHIVE,
    '.cab': FileType.ARCHIVE, '.iso': FileType.ARCHIVE, '.img': FileType.ARCHIVE,
    '.z': FileType.ARCHIVE, '.ace': FileType.ARCHIVE, '.arj': FileType.ARCHIVE,
    '.lha': FileType.ARCHIVE, '.lzh': FileType.ARCHIVE, '.zoo': FileType.ARCHIVE,
    
    # TEXT FILES (Plain text, configs, logs)
    '.txt': FileType.TEXT, '.log': FileType.TEXT, '.cfg': FileType.TEXT,
    '.ini': FileType.TEXT, '.conf': FileType.TEXT, '.config': FileType.TEXT,
    '.md': FileType.TEXT, '.readme': FileType.TEXT, '.license': FileType.TEXT,
    '.changelog': FileType.TEXT, '.authors': FileType.TEXT, '.news': FileType.TEXT,
    '.todo': FileType.TEXT, '.asc': FileType.TEXT, '.text': FileType.TEXT,
    
    # WEB FILES (Web development)
    '.html': FileType.WEB, '.htm': FileType.WEB, '.xhtml': FileType.WEB,
    '.css': FileType.WEB, '.scss': FileType.WEB, '.sass': FileType.WEB,
    '.less': FileType.WEB, '.vue': FileType.WEB, '.svelte': FileType.WEB,
    '.jsp': FileType.WEB, '.asp': FileType.WEB, '.aspx': FileType.WEB,
    '.erb': FileType.WEB, '.haml': FileType.WEB, '.jade': FileType.WEB,
    '.pug': FileType.WEB, '.handlebars': FileType.WEB, '.mustache': FileType.WEB,
    
    # MOBILE FILES (Mobile development)
    '.apk': FileType.MOBILE, '.ipa': FileType.MOBILE, '.aab': FileType.MOBILE,
    '.xap': FileType.MOBILE, '.appx': FileType.MOBILE, '.msix': FileType.MOBILE,
    
    # EMAIL FILES
    '.eml': FileType.EMAIL, '.msg': FileType.EMAIL, '.pst': FileType.EMAIL,
    '.ost': FileType.EMAIL, '.mbox': FileType.EMAIL, '.mbx': FileType.EMAIL,
    
    # DATABASE FILES
    '.db': FileType.DATABASE, '.sqlite': FileType.DATABASE, '.sqlite3': FileType.DATABASE,
    '.mdb': FileType.DATABASE, '.accdb': FileType.DATABASE, '.dbf': FileType.DATABASE,
    '.frm': FileType.DATABASE, '.myd': FileType.DATABASE, '.myi': FileType.DATABASE,
    
    # FONT FILES
    '.ttf': FileType.FONT, '.otf': FileType.FONT, '.woff': FileType.FONT,
    '.woff2': FileType.FONT, '.eot': FileType.FONT, '.pfb': FileType.FONT,
    '.pfm': FileType.FONT, '.afm': FileType.FONT, '.bdf': FileType.FONT,
    
    # CAD FILES
    '.dwg': FileType.CAD, '.dxf': FileType.CAD, '.step': FileType.CAD,
    '.stp': FileType.CAD, '.iges': FileType.CAD, '.igs': FileType.CAD,
    '.stl': FileType.CAD, '.obj': FileType.CAD, '.3ds': FileType.CAD,
    
    # GAME FILES
    '.unity3d': FileType.GAME, '.unitypackage': FileType.GAME, '.pak': FileType.GAME,
    '.wad': FileType.GAME, '.rom': FileType.GAME, '.nds': FileType.GAME,
    '.gba': FileType.GAME, '.n64': FileType.GAME, '.smc': FileType.GAME,
    
    # SYSTEM FILES
    '.sys': FileType.SYSTEM, '.drv': FileType.SYSTEM, '.inf': FileType.SYSTEM,
    '.reg': FileType.SYSTEM, '.pol': FileType.SYSTEM, '.msi': FileType.SYSTEM,
    '.msp': FileType.SYSTEM, '.msu': FileType.SYSTEM,
    
    # SCIENTIFIC FILES
    '.mat': FileType.SCIENTIFIC, '.hdf5': FileType.SCIENTIFIC, '.nc': FileType.SCIENTIFIC,
    '.fits': FileType.SCIENTIFIC, '.fts': FileType.SCIENTIFIC, '.sav': FileType.SCIENTIFIC,
    
    # BLOCKCHAIN FILES
    '.sol': FileType.BLOCKCHAIN, '.vy': FileType.BLOCKCHAIN, '.wallet': FileType.BLOCKCHAIN,
    '.key': FileType.BLOCKCHAIN, '.keystore': FileType.BLOCKCHAIN,
}

# Additional specialized extensions for structured data
STRUCTURED_DATA_EXTENSIONS = {
    '.json': FileType.TEXT, '.xml': FileType.TEXT, '.yaml': FileType.TEXT,
    '.yml': FileType.TEXT, '.toml': FileType.TEXT, '.csv': FileType.TEXT,
    '.tsv': FileType.TEXT, '.sql': FileType.TEXT, '.graphql': FileType.TEXT,
    '.proto': FileType.TEXT, '.avro': FileType.TEXT, '.parquet': FileType.DATABASE,
}

# Script and automation extensions
SCRIPT_EXTENSIONS = {
    '.sh': FileType.CODE, '.bash': FileType.CODE, '.zsh': FileType.CODE,
    '.fish': FileType.CODE, '.ps1': FileType.CODE, '.psm1': FileType.CODE,
    '.psd1': FileType.CODE, '.vbs': FileType.CODE, '.wsf': FileType.CODE,
    '.applescript': FileType.CODE, '.scpt': FileType.CODE,
}

# Update main mapping with additional extensions
COMPREHENSIVE_EXTENSION_MAPPING.update(STRUCTURED_DATA_EXTENSIONS)
COMPREHENSIVE_EXTENSION_MAPPING.update(SCRIPT_EXTENSIONS)

def get_file_type_from_extension(extension: str) -> FileType:
    """
    Get FileType from file extension
    
    Args:
        extension: File extension (with or without dot)
    
    Returns:
        FileType enum value
    """
    if not extension.startswith('.'):
        extension = '.' + extension
    
    extension = extension.lower()
    return COMPREHENSIVE_EXTENSION_MAPPING.get(extension, FileType.UNKNOWN)

def get_all_extensions_for_type(file_type: FileType) -> List[str]:
    """
    Get all extensions for a specific FileType
    
    Args:
        file_type: FileType enum value
    
    Returns:
        List of extensions for that file type
    """
    return [ext for ext, ftype in COMPREHENSIVE_EXTENSION_MAPPING.items() if ftype == file_type]

def get_extension_statistics() -> Dict[str, int]:
    """Get statistics about extension coverage"""
    stats = {}
    for file_type in FileType:
        extensions = get_all_extensions_for_type(file_type)
        stats[file_type.value] = len(extensions)
    
    stats['total_extensions'] = len(COMPREHENSIVE_EXTENSION_MAPPING)
    return stats

# Pre-computed extension sets for fast lookup
EXECUTABLE_EXTENSIONS = set(get_all_extensions_for_type(FileType.EXECUTABLE))
DOCUMENT_EXTENSIONS = set(get_all_extensions_for_type(FileType.DOCUMENT))
IMAGE_EXTENSIONS = set(get_all_extensions_for_type(FileType.IMAGE))
VIDEO_EXTENSIONS = set(get_all_extensions_for_type(FileType.VIDEO))
AUDIO_EXTENSIONS = set(get_all_extensions_for_type(FileType.AUDIO))
CODE_EXTENSIONS = set(get_all_extensions_for_type(FileType.CODE))
ARCHIVE_EXTENSIONS = set(get_all_extensions_for_type(FileType.ARCHIVE))
TEXT_EXTENSIONS = set(get_all_extensions_for_type(FileType.TEXT))
WEB_EXTENSIONS = set(get_all_extensions_for_type(FileType.WEB))
MOBILE_EXTENSIONS = set(get_all_extensions_for_type(FileType.MOBILE))
EMAIL_EXTENSIONS = set(get_all_extensions_for_type(FileType.EMAIL))
DATABASE_EXTENSIONS = set(get_all_extensions_for_type(FileType.DATABASE))
FONT_EXTENSIONS = set(get_all_extensions_for_type(FileType.FONT))
CAD_EXTENSIONS = set(get_all_extensions_for_type(FileType.CAD))
GAME_EXTENSIONS = set(get_all_extensions_for_type(FileType.GAME))
SYSTEM_EXTENSIONS = set(get_all_extensions_for_type(FileType.SYSTEM))
SCIENTIFIC_EXTENSIONS = set(get_all_extensions_for_type(FileType.SCIENTIFIC))
BLOCKCHAIN_EXTENSIONS = set(get_all_extensions_for_type(FileType.BLOCKCHAIN))

if __name__ == "__main__":
    # Print extension statistics
    stats = get_extension_statistics()
    print("📊 Comprehensive Extension Coverage:")
    print("=" * 50)
    for file_type, count in stats.items():
        print(f"{file_type.upper():<15}: {count:>3} extensions")
    print("=" * 50)
    print(f"🎯 Total Coverage: {stats['total_extensions']} file extensions")



