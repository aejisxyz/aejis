#!/usr/bin/env python3
"""
Aejis Bot Startup Script
Easy startup with configuration validation and error handling
"""

import sys
import os
import subprocess
import logging

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    return True

def check_dependencies():
    """Check if all required dependencies are installed"""
    try:
        import telegram
        import google.generativeai
        import dotenv
        import PIL
        print("✅ Core dependencies are installed")
        
        # Check optional magic library
        try:
            import magic
            print("✅ python-magic library available")
        except ImportError:
            print("⚠️ python-magic not available (using fallback file detection)")
        
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Run: pip install -r requirements.txt")
        return False

def check_environment():
    """Check environment configuration"""
    from dotenv import load_dotenv
    load_dotenv()
    
    issues = []
    
    # Check for bot token
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        issues.append("TELEGRAM_BOT_TOKEN not found in environment")
    
    # Check for Gemini API key (optional check since it's in config)
    gemini_key = os.getenv('GEMINI_API_KEY')
    if not gemini_key:
        print("⚠️  GEMINI_API_KEY not in .env (using default from config.py)")
    
    if issues:
        print("❌ Environment issues:")
        for issue in issues:
            print(f"   • {issue}")
        print("\nCreate a .env file with your configuration:")
        print("   cp env_template.txt .env")
        print("   # Edit .env with your bot token")
        return False
    
    print("✅ Environment configuration looks good")
    return True

def main():
    """Main startup function"""
    print("🛡️  Starting Aejis Security Bot...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("\nTo install dependencies:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    print("=" * 50)
    print("🚀 Starting bot...")
    print("Press Ctrl+C to stop the bot")
    print("=" * 50)
    
    try:
        # Import and run the bot
        from main import main as run_bot
        run_bot()
    except KeyboardInterrupt:
        print("\n\n🛑 Bot stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error starting bot: {e}")
        print("Check the logs above for more details")
        sys.exit(1)

if __name__ == "__main__":
    main()
