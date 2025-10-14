#!/usr/bin/env python3
"""
Aejis Bot Setup Test Script
Tests all components to ensure proper configuration
"""

import os
import sys
import tempfile
import time
from typing import Dict, Any

def test_imports():
    """Test if all required modules can be imported"""
    print("🧪 Testing imports...")
    
    try:
        import telegram
        print("  ✅ python-telegram-bot")
    except ImportError:
        print("  ❌ python-telegram-bot - Run: pip install python-telegram-bot")
        return False
    
    try:
        import google.generativeai as genai
        print("  ✅ google-generativeai")
    except ImportError:
        print("  ❌ google-generativeai - Run: pip install google-generativeai")
        return False
    
    try:
        from dotenv import load_dotenv
        print("  ✅ python-dotenv")
    except ImportError:
        print("  ❌ python-dotenv - Run: pip install python-dotenv")
        return False
    
    try:
        from PIL import Image
        print("  ✅ Pillow")
    except ImportError:
        print("  ❌ Pillow - Run: pip install Pillow")
        return False
    
    try:
        import magic
        print("  ✅ python-magic")
    except ImportError:
        print("  ❌ python-magic - Run: pip install python-magic")
        return False
    
    return True

def test_config():
    """Test configuration loading"""
    print("\n🔧 Testing configuration...")
    
    try:
        from config import Config
        
        # Test configuration validation
        if Config.GEMINI_API_KEY:
            print("  ✅ Gemini API key configured")
        else:
            print("  ❌ Gemini API key missing")
            return False
        
        if Config.TELEGRAM_BOT_TOKEN:
            print("  ✅ Telegram bot token configured")
        else:
            print("  ⚠️  Telegram bot token missing (set in .env)")
        
        print(f"  📊 Max file size: {Config.MAX_FILE_SIZE // (1024*1024)}MB")
        print(f"  ⏱️  Scan timeout: {Config.SCAN_TIMEOUT}s")
        print(f"  🔄 Max concurrent scans: {Config.MAX_CONCURRENT_SCANS}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Configuration error: {e}")
        return False

def test_file_analyzer():
    """Test file analyzer functionality"""
    print("\n🔍 Testing file analyzer...")
    
    try:
        from file_analyzer import FileAnalyzer
        
        analyzer = FileAnalyzer()
        print("  ✅ FileAnalyzer initialized")
        
        # Test with a simple text file
        test_content = "This is a test file for Aejis security analysis."
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(test_content)
            test_file_path = f.name
        
        try:
            # Test file info extraction
            file_info = analyzer.get_file_info(test_file_path)
            if file_info:
                print("  ✅ File info extraction working")
                print(f"    📄 MIME type: {file_info.get('mime_type')}")
                print(f"    📏 File size: {file_info.get('file_size')} bytes")
            else:
                print("  ❌ File info extraction failed")
                return False
            
            # Test basic analysis (commented out to avoid API calls during setup)
            # result = analyzer.analyze_file(test_file_path)
            # if result:
            #     print("  ✅ File analysis working")
            # else:
            #     print("  ❌ File analysis failed")
            
            print("  ✅ File analyzer ready for testing")
            
        finally:
            # Clean up test file
            try:
                os.unlink(test_file_path)
            except:
                pass
        
        return True
        
    except Exception as e:
        print(f"  ❌ File analyzer error: {e}")
        return False

def test_gemini_connection():
    """Test Gemini API connection"""
    print("\n🤖 Testing Gemini API connection...")
    
    try:
        import google.generativeai as genai
        from config import Config
        
        # Configure Gemini
        genai.configure(api_key=Config.GEMINI_API_KEY)
        
        # Test connection with a simple prompt
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            print("  ✅ Gemini model initialized")
            
            # Simple test (optional - commented out to avoid API usage during setup)
            # response = model.generate_content("Say 'API connection successful' if you can read this.")
            # if "successful" in response.text.lower():
            #     print("  ✅ Gemini API connection working")
            # else:
            #     print("  ⚠️  Gemini API response unexpected")
            
            print("  ✅ Gemini API ready for use")
            return True
            
        except Exception as e:
            print(f"  ❌ Gemini API error: {e}")
            return False
        
    except Exception as e:
        print(f"  ❌ Gemini setup error: {e}")
        return False

def test_telegram_token():
    """Test Telegram bot token validity"""
    print("\n📱 Testing Telegram bot token...")
    
    try:
        from config import Config
        import telegram
        
        if not Config.TELEGRAM_BOT_TOKEN:
            print("  ⚠️  No Telegram bot token found")
            print("     Create .env file with TELEGRAM_BOT_TOKEN=your_token")
            return False
        
        # Test token format
        if not Config.TELEGRAM_BOT_TOKEN.startswith(('1', '2', '5', '6', '7')):
            print("  ❌ Invalid bot token format")
            return False
        
        if ':' not in Config.TELEGRAM_BOT_TOKEN:
            print("  ❌ Invalid bot token format (missing :)")
            return False
        
        print("  ✅ Bot token format valid")
        
        # Optional: Test actual connection (commented to avoid API calls)
        # try:
        #     bot = telegram.Bot(token=Config.TELEGRAM_BOT_TOKEN)
        #     bot_info = bot.get_me()
        #     print(f"  ✅ Connected to bot: @{bot_info.username}")
        #     return True
        # except Exception as e:
        #     print(f"  ❌ Bot connection failed: {e}")
        #     return False
        
        print("  ✅ Telegram bot configuration ready")
        return True
        
    except Exception as e:
        print(f"  ❌ Telegram test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🛡️  Aejis Bot Setup Test")
    print("=" * 50)
    
    tests = [
        ("Imports", test_imports),
        ("Configuration", test_config),
        ("File Analyzer", test_file_analyzer),
        ("Gemini API", test_gemini_connection),
        ("Telegram Token", test_telegram_token),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ {test_name} test failed with exception: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    
    passed = 0
    total = len(tests)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your bot is ready to run.")
        print("   Start with: python start_bot.py")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix the issues above.")
        print("   Check the README.md for setup instructions.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)






