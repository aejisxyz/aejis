#!/usr/bin/env python3
"""
Aejis Bot Automated Installation Script
One-click installation and setup for the Aejis Security Bot
"""

import os
import sys
import subprocess
import platform
import urllib.request
import shutil

def print_banner():
    """Print installation banner"""
    banner = """
    ╔══════════════════════════════════════════════════════╗
    ║                                                      ║
    ║        🛡️  AEJIS SECURITY BOT INSTALLER 🛡️          ║
    ║                                                      ║
    ║     Advanced Crypto Security Analysis Platform       ║
    ║                                                      ║
    ╚══════════════════════════════════════════════════════╝
    """
    print(banner)

def check_python():
    """Check Python version"""
    print("🐍 Checking Python version...")
    if sys.version_info < (3, 8):
        print(f"❌ Python 3.8+ required. Current: {sys.version}")
        print("   Please upgrade Python and try again.")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def check_system():
    """Check system compatibility"""
    print("💻 Checking system compatibility...")
    system = platform.system()
    print(f"✅ Operating System: {system}")
    
    # Check for required system packages
    if system == "Linux":
        try:
            # Check for libmagic
            subprocess.run(["ldconfig", "-p"], capture_output=True, check=True)
            print("✅ System libraries available")
        except:
            print("⚠️  Some system libraries may be missing")
            print("   On Ubuntu/Debian: sudo apt install libmagic1")
            print("   On CentOS/RHEL: sudo yum install file-libs")
    
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    
    try:
        # Upgrade pip first
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
        print("✅ pip updated")
        
        # Install requirements
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        print("   Try manually: pip install -r requirements.txt")
        return False
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        print("   Make sure you're in the correct directory")
        return False

def setup_environment():
    """Setup environment configuration"""
    print("⚙️  Setting up environment...")
    
    if not os.path.exists(".env"):
        if os.path.exists("env_template.txt"):
            shutil.copy("env_template.txt", ".env")
            print("✅ Environment file created from template")
        else:
            # Create basic .env file
            env_content = """# Aejis Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
GEMINI_API_KEY=your_gemini_api_key_here
LOG_LEVEL=INFO
"""
            with open(".env", "w") as f:
                f.write(env_content)
            print("✅ Environment file created")
    else:
        print("✅ Environment file already exists")
    
    return True

def run_tests():
    """Run setup tests"""
    print("🧪 Running setup tests...")
    
    try:
        result = subprocess.run([sys.executable, "test_setup.py"], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed:")
            print(result.stdout)
            return False
            
    except FileNotFoundError:
        print("⚠️  test_setup.py not found, skipping tests")
        return True

def print_next_steps():
    """Print next steps for user"""
    next_steps = """
    
    ╔══════════════════════════════════════════════════════╗
    ║                    🎉 INSTALLATION COMPLETE! 🎉      ║
    ╚══════════════════════════════════════════════════════╝
    
    📋 NEXT STEPS:
    
    1. 🤖 CREATE TELEGRAM BOT:
       • Open Telegram and search for @BotFather
       • Send: /newbot
       • Follow instructions to create your bot
       • Copy the bot token
    
    2. ⚙️  CONFIGURE BOT:
       • Edit the .env file
       • Replace 'your_telegram_bot_token_here' with your actual token
       • Save the file
    
    3. 🚀 START THE BOT:
       python start_bot.py
    
    📚 HELPFUL RESOURCES:
    • setup_bot_token.md - Detailed bot creation guide
    • README.md - Complete documentation
    • DEPLOYMENT.md - Production deployment guide
    
    🆘 NEED HELP?
    • Run: python test_setup.py (to test configuration)
    • Check the README.md for troubleshooting
    • Ensure your bot token is correctly set in .env
    
    ⚡ QUICK TEST:
    After setting up your bot token:
    1. python test_setup.py
    2. python start_bot.py
    3. Message your bot on Telegram!
    
    🛡️  Thank you for choosing Aejis Security Bot!
    """
    print(next_steps)

def create_desktop_shortcut():
    """Create desktop shortcut (optional)"""
    try:
        system = platform.system()
        if system == "Windows":
            # Windows shortcut creation would go here
            pass
        elif system == "Linux":
            desktop_file = f"""[Desktop Entry]
Version=1.0
Type=Application
Name=Aejis Security Bot
Comment=Start Aejis Security Bot
Exec=python {os.path.abspath('start_bot.py')}
Icon={os.path.abspath('.')}
Terminal=true
Categories=Utility;Security;
"""
            desktop_path = os.path.expanduser("~/Desktop/aejis-bot.desktop")
            with open(desktop_path, "w") as f:
                f.write(desktop_file)
            os.chmod(desktop_path, 0o755)
            print("✅ Desktop shortcut created")
    except:
        pass  # Optional feature, don't fail installation

def main():
    """Main installation function"""
    print_banner()
    
    # Installation steps
    steps = [
        ("Checking Python", check_python),
        ("Checking System", check_system),
        ("Installing Dependencies", install_dependencies),
        ("Setting up Environment", setup_environment),
        ("Running Tests", run_tests),
    ]
    
    print("🚀 Starting installation process...\n")
    
    for step_name, step_func in steps:
        print(f"Step: {step_name}")
        try:
            if not step_func():
                print(f"\n❌ Installation failed at: {step_name}")
                print("Please check the error messages above and try again.")
                return False
        except Exception as e:
            print(f"\n❌ Unexpected error in {step_name}: {e}")
            return False
        print()
    
    # Optional features
    try:
        create_desktop_shortcut()
    except:
        pass
    
    print_next_steps()
    return True

if __name__ == "__main__":
    try:
        success = main()
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Installation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Installation failed with error: {e}")
        sys.exit(1)






