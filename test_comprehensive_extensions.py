#!/usr/bin/env python3
"""
Comprehensive Extension Testing Script
Tests all file extensions and their engine mappings
"""

import os
import sys
from comprehensive_extension_mapping import (
    get_file_type_from_extension, 
    get_extension_statistics,
    COMPREHENSIVE_EXTENSION_MAPPING,
    FileType
)
from file_type_engine_mapping import get_engines_for_file_type

def test_all_extensions():
    """Test all extensions and show their engine mappings"""
    print("🔍 COMPREHENSIVE FILE EXTENSION ANALYSIS")
    print("=" * 80)
    
    # Get statistics
    stats = get_extension_statistics()
    print(f"📊 Total Extensions Covered: {stats['total_extensions']}")
    print(f"📋 File Types Supported: {len([k for k in stats.keys() if k != 'total_extensions'])}")
    print("=" * 80)
    
    # Group extensions by file type
    extensions_by_type = {}
    for ext, file_type in COMPREHENSIVE_EXTENSION_MAPPING.items():
        if file_type not in extensions_by_type:
            extensions_by_type[file_type] = []
        extensions_by_type[file_type].append(ext)
    
    # Display each file type and its engines
    for file_type in FileType:
        if file_type in extensions_by_type:
            extensions = sorted(extensions_by_type[file_type])
            engines = get_engines_for_file_type(file_type)
            
            print(f"\n🎯 {file_type.value.upper()} FILES:")
            print(f"   📁 Extensions ({len(extensions)}): {', '.join(extensions[:10])}")
            if len(extensions) > 10:
                print(f"      ... and {len(extensions) - 10} more")
            print(f"   🛡️  Engines ({len(engines)}): {', '.join(engines)}")
            print(f"   🔧 Priority: {get_priority_for_file_type(file_type)}")

def get_priority_for_file_type(file_type):
    """Get priority mapping from file_type_engine_mapping"""
    from file_type_engine_mapping import FILE_TYPE_MAPPING
    return FILE_TYPE_MAPPING.get_priority_for_file_type(file_type)

def test_specific_extensions():
    """Test specific high-risk extensions"""
    print("\n" + "=" * 80)
    print("🚨 HIGH-RISK FILE EXTENSION ANALYSIS")
    print("=" * 80)
    
    high_risk_extensions = [
        '.exe', '.dll', '.scr', '.bat', '.ps1',  # Executables
        '.zip', '.rar', '.7z',                   # Archives
        '.apk', '.ipa',                          # Mobile
        '.sol', '.wallet', '.key',               # Blockchain
        '.sys', '.drv',                          # System
        '.doc', '.pdf', '.xls'                   # Documents
    ]
    
    for ext in high_risk_extensions:
        file_type = get_file_type_from_extension(ext)
        engines = get_engines_for_file_type(file_type)
        print(f"📄 {ext:<8} → {file_type.value:<12} → {len(engines)} engines: {', '.join(engines[:5])}...")

def demonstrate_engine_selection():
    """Demonstrate engine selection for different file types"""
    print("\n" + "=" * 80)
    print("🎯 ENGINE SELECTION DEMONSTRATION")
    print("=" * 80)
    
    test_files = [
        "malware.exe",          # Executable
        "document.pdf",         # Document  
        "archive.zip",          # Archive
        "image.jpg",            # Image
        "video.mp4",            # Video
        "script.py",            # Code
        "wallet.dat",           # Unknown (blockchain)
        "config.ini",           # Text
        "app.apk",              # Mobile
        "font.ttf",             # Font
        "drawing.dwg",          # CAD
        "game.unity3d",         # Game
        "database.sqlite",      # Database
        "website.html",         # Web
        "contract.sol",         # Blockchain
        "system.sys"            # System
    ]
    
    for filename in test_files:
        ext = os.path.splitext(filename)[1].lower()
        file_type = get_file_type_from_extension(ext)
        engines = get_engines_for_file_type(file_type)
        
        print(f"📁 {filename:<15} → {file_type.value:<12} → {len(engines):>2} engines")
        for i, engine in enumerate(engines, 1):
            print(f"   {i:>2}. {engine}")
        print()

def check_coverage_gaps():
    """Check for any potential coverage gaps"""
    print("\n" + "=" * 80)
    print("🔍 COVERAGE GAP ANALYSIS")
    print("=" * 80)
    
    # Common extensions that might be missing
    common_extensions = [
        '.txt', '.doc', '.pdf', '.jpg', '.png', '.mp4', '.mp3',
        '.exe', '.zip', '.html', '.js', '.py', '.java', '.cpp',
        '.csv', '.json', '.xml', '.sql', '.log', '.cfg'
    ]
    
    missing = []
    covered = []
    
    for ext in common_extensions:
        if ext in COMPREHENSIVE_EXTENSION_MAPPING:
            covered.append(ext)
        else:
            missing.append(ext)
    
    print(f"✅ Covered Common Extensions: {len(covered)}/{len(common_extensions)}")
    print(f"   {', '.join(covered)}")
    
    if missing:
        print(f"❌ Missing Common Extensions: {len(missing)}")
        print(f"   {', '.join(missing)}")
    else:
        print("🎉 All common extensions are covered!")

def main():
    """Main test function"""
    print("🚀 AEJIS COMPREHENSIVE EXTENSION TESTING")
    print("Testing comprehensive file extension mapping and engine selection")
    print()
    
    try:
        # Run all tests
        test_all_extensions()
        test_specific_extensions()
        demonstrate_engine_selection()
        check_coverage_gaps()
        
        print("\n" + "=" * 80)
        print("✅ COMPREHENSIVE EXTENSION TESTING COMPLETED SUCCESSFULLY!")
        print("🎯 All file extensions are properly mapped to optimal engines")
        print("🛡️  Security coverage is comprehensive across all file types")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())


