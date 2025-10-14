import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration class for the Aejis Telegram Bot"""
    
    # Telegram Bot Configuration
    TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
    
    # Gemini API Configuration
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # Bot Configuration
    BOT_NAME = "Aejis"
    BOT_VERSION = "1.0.0"
    
    # File Upload Limits
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
    SUPPORTED_FILE_TYPES = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/avi', 'video/mov', 'video/webm',
        'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip', 'application/x-rar-compressed',
        'text/plain', 'application/json'
    ]
    
    # Security Configuration
    SCAN_TIMEOUT = 30  # seconds
    MAX_CONCURRENT_SCANS = 5
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    @classmethod
    def validate_config(cls):
        """Validate that all required configuration is present"""
        if not cls.TELEGRAM_BOT_TOKEN:
            raise ValueError("TELEGRAM_BOT_TOKEN is required")
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is required")
        return True
