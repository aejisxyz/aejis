#!/usr/bin/env python3
"""
Simple Extension Demo Script
Demonstrates comprehensive file extension coverage
"""

import sys
from comprehensive_extension_mapping import (
    get_file_type_from_extension, 
    get_extension_statistics,
    COMPREHENSIVE_EXTENSION_MAPPING
)
from file_type_engine_mapping import get_engines_for_file_type

def main():
    """Demo the comprehensive extension system"""
    print("AEJIS COMPREHENSIVE EXTENSION COVERAGE DEMO")
    print("=" * 60)
    
    # Show statistics
    stats = get_extension_statistics()
    print(f"Total Extensions Covered: {stats['total_extensions']}")
    print(f"File Types Supported: {len([k for k in stats.keys() if k != 'total_extensions'])}")
    print("\nFile Type Coverage:")
    for file_type, count in stats.items():
        if file_type != 'total_extensions':
            print(f"  {file_type.upper():<12}: {count:>3} extensions")
    
    print("\n" + "=" * 60)
    print("SAMPLE FILE ANALYSIS:")
    print("=" * 60)
    
    # Test sample files
    test_files = [
        "malware.exe",      # Executable - 11 engines
        "document.pdf",     # Document - 9 engines  
        "archive.zip",      # Archive - 7 engines
        "image.jpg",        # Image - 8 engines
        "script.py",        # Code - 8 engines
        "wallet.sol",       # Blockchain - 11 engines
        "config.ini",       # Text - 8 engines
        "app.apk",          # Mobile - 7 engines
        "font.ttf",         # Font - 6 engines
        "drawing.dwg",      # CAD - 6 engines
        "game.unity3d",     # Game - 6 engines
        "database.sqlite",  # Database - 7 engines
        "website.html",     # Web - 7 engines
        "system.sys"        # System - 9 engines
    ]
    
    for filename in test_files:
        ext = filename[filename.rfind('.'):]
        file_type = get_file_type_from_extension(ext)
        engines = get_engines_for_file_type(file_type)
        
        print(f"{filename:<16} -> {file_type.value:<10} -> {len(engines):>2} engines")
    
    print("\n" + "=" * 60)
    print("HIGH-RISK FILE EXTENSIONS:")
    print("=" * 60)
    
    high_risk = ['.exe', '.dll', '.scr', '.bat', '.ps1', '.zip', '.rar', 
                 '.apk', '.ipa', '.sol', '.wallet', '.sys', '.drv']
    
    for ext in high_risk:
        file_type = get_file_type_from_extension(ext)
        engines = get_engines_for_file_type(file_type)
        print(f"{ext:<8} -> {file_type.value:<12} -> {len(engines)} engines")
    
    print("\n" + "=" * 60)
    print("SYSTEM STATUS: COMPREHENSIVE COVERAGE ACTIVE")
    print("All file extensions are mapped to optimal engines!")
    print("=" * 60)

if __name__ == "__main__":
    main()



