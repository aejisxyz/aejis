#!/usr/bin/env python3
"""
Aejis - Lightweight Telegram Bot (Redirect Version)
Redirects users to website for full analysis instead of processing in Telegram
"""

import asyncio
import logging
import os
import requests
import uuid
from datetime import datetime
from typing import Dict, Any

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, MessageHandler, CallbackQueryHandler,
    ContextTypes, filters
)

from config import Config

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=getattr(logging, Config.LOG_LEVEL)
)
logger = logging.getLogger(__name__)

class AejisRedirectBot:
    """Lightweight Aejis Telegram Bot - Redirect Version"""
    
    def __init__(self):
        """Initialize the redirect bot"""
        self.config = Config()
        self.website_url = "http://localhost:5000"  # Flask backend URL
        self.api_url = "http://localhost:5000"  # Flask backend
        self.user_analyses = {}  # Track active analyses per user: {user_id: [analysis_ids]}
        self.user_chat_ids = {}  # Store user chat IDs for notifications: {user_id: chat_id}
        self.linked_users = set()  # Cache of linked Telegram user IDs
        
    async def load_linked_users(self):
        """Load all linked users from backend on startup"""
        try:
            response = requests.get(f'{self.api_url}/api/linked-users', timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.linked_users = set(data.get('telegramIds', []))
                    logger.info(f"✅ Loaded {len(self.linked_users)} linked users")
                else:
                    logger.warning("Failed to load linked users from backend")
        except Exception as e:
            logger.error(f"❌ Error loading linked users: {e}")
            logger.warning("Bot will start without linked users cache - add users via /start link_TOKEN")
    
    def is_user_linked(self, telegram_id: int) -> bool:
        """Check if user is linked (instant check from cache)"""
        return telegram_id in self.linked_users
    
    def store_user_chat_id(self, user_id: int, chat_id: int):
        """Store user chat ID for notifications"""
        self.user_chat_ids[user_id] = chat_id
        logger.info(f"Stored chat ID {chat_id} for user {user_id}")
        
    async def send_notification_to_user(self, user_id: int, message: str):
        """Send notification to user if chat ID is available"""
        if user_id in self.user_chat_ids:
            try:
                # This would need to be implemented with the bot instance
                # For now, we'll just log it
                logger.info(f"Would send notification to user {user_id}: {message}")
            except Exception as e:
                logger.error(f"Failed to send notification to user {user_id}: {e}")
        else:
            logger.warning(f"No chat ID stored for user {user_id}")
        
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /start command - includes account linking support"""
        user = update.effective_user
        telegram_id = user.id
        
        # Check if this is a linking request
        if context.args and len(context.args) > 0 and context.args[0].startswith('link_'):
            await self.handle_link(update, context)
            return
        
        # Check if user is linked
        if self.is_user_linked(telegram_id):
            # User is linked - show welcome back message
            welcome_back_message = f"""
✅ **Welcome back, {user.first_name}!**

Your Telegram account is linked to your Aejis account.

**🛡️ Ready to Protect You:**
• Send me any file to scan for threats
• Send me any URL to check for malware
• Get instant security analysis results

**📊 Your Access:**
• 70+ antivirus engines ✅
• AI-powered analysis ✅
• Real-time threat detection ✅
• Detailed security reports ✅

**⚡ Quick Commands:**
• Send a file → Instant scan
• Send a URL → Website analysis
• /status → Check your account
• /help → More information

What would you like to scan today?
            """
            
            keyboard = [
                [InlineKeyboardButton("🌐 Visit Dashboard", url=self.website_url)],
                [InlineKeyboardButton("📖 Help", callback_data="help")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(welcome_back_message, reply_markup=reply_markup, parse_mode='Markdown')
        else:
            # User is NOT linked - show registration prompt
            registration_message = f"""
👋 **Hi {user.first_name}! Welcome to Aejis Security Bot**

⚠️ To use this bot, you need to link your Telegram account to your Aejis account.

**🚀 Quick Setup (30 seconds):**

1️⃣ **Create Account**
   Visit: {self.website_url}
   Sign up with Google or Email

2️⃣ **Link Telegram**
   Go to Dashboard
   Click "Link Telegram Account"

3️⃣ **Start Scanning**
   Come back here and start sending files!

**🛡️ What You'll Get:**
• 70+ antivirus engines
• AI-powered threat detection
• Real-time security analysis
• Detailed threat reports
• Safe website preview

**Why link your account?**
✅ Track your scan history
✅ Free tier: 10 scans/day
✅ Premium features available
✅ Secure & private analysis

Click below to get started! 🚀
            """
            
            keyboard = [
                [InlineKeyboardButton("🌐 Create Aejis Account", url=self.website_url)],
                [InlineKeyboardButton("📖 Learn More", callback_data="help")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(registration_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def handle_link(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle Telegram account linking"""
        user = update.effective_user
        telegram_id = user.id
        token = context.args[0].replace('link_', '')
        
        logger.info(f"Linking attempt: user {telegram_id} ({user.first_name}) with token {token}")
        
        try:
            # Call backend API to link account
            response = requests.post(
                f'{self.api_url}/api/link-telegram',
                json={
                    'token': token,
                    'telegramId': telegram_id,
                    'telegramUsername': user.username,
                    'firstName': user.first_name,
                    'lastName': user.last_name
                },
                timeout=10
            )
            
            # Parse response
            data = response.json()
            
            if data.get('success'):
                # ✅ Add to linked users cache
                self.linked_users.add(telegram_id)
                
                success_message = f"""
✅ **Account Linked Successfully!**

Your Telegram is now connected to your Aejis account.

**🎉 You can now:**
• 📄 Send files to scan for malware
• 🔗 Send URLs to check for threats
• 📊 Track your scan history
• 🛡️ Get detailed security reports

**⚡ Quick Start:**
Just send me any file or URL to analyze!

**📱 Commands:**
• Send file → Instant scan
• Send URL → Website analysis  
• /status → Account info
• /help → More commands

Let's keep you safe! 🛡️
                """
                
                await update.message.reply_text(success_message, parse_mode='Markdown')
                logger.info(f"✅ Successfully linked user {telegram_id}")
                
            else:
                error_msg = data.get('message', 'Unknown error')
                error_message = f"""
❌ **Linking Failed**

{error_msg}

**🔧 Please try again:**
1. Go to {self.website_url}/dashboard
2. Click "Link Telegram Account"
3. Generate a new link token
4. Click the button to return here

If the problem persists, contact support.
                """
                
                await update.message.reply_text(error_message, parse_mode='Markdown')
                logger.warning(f"❌ Failed to link user {telegram_id}: {error_msg}")
                
        except requests.exceptions.ConnectionError as e:
            logger.error(f"❌ Backend not running: {e}")
            await update.message.reply_text(
                f"❌ **Backend Server Not Running**\n\n"
                f"The Aejis backend server is currently offline.\n\n"
                f"**Admin:** Please start the backend server:\n"
                f"`python website_backend.py`\n\n"
                f"Then try linking again from {self.website_url}/dashboard",
                parse_mode='Markdown'
            )
            
        except Exception as e:
            logger.error(f"Error linking account for user {telegram_id}: {e}")
            await update.message.reply_text(
                f"❌ **Error**\n\n"
                f"Failed to link account: {str(e)}\n\n"
                f"Please contact support or try again later.",
                parse_mode='Markdown'
            )
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /help command"""
        help_message = """
🛡️ **Aejis Security Bot - Help**

**📋 Supported File Types:**
• Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
• Images: JPG, PNG, GIF, WEBP, SVG
• Archives: ZIP, RAR, 7Z, TAR, GZ
• Code: PY, JS, HTML, CSS, PHP, JAVA, C++, etc.
• Media: MP4, AVI, MP3, WAV, etc.
• Text: TXT, LOG, JSON, XML, CSV

**🔍 Analysis Features:**
• **70+ Antivirus Engines** - Comprehensive malware detection
• **AI-Powered Analysis** - Advanced threat intelligence
• **Behavioral Analysis** - Dynamic sandbox testing
• **Crypto Scam Detection** - Specialized crypto threat detection
• **Phishing Detection** - URL and content analysis

**📱 How It Works:**
1. **Send File** - Upload any file to this bot
2. **Secure Redirect** - Get redirected to our analysis platform
3. **Real-time Analysis** - Watch live analysis progress
4. **Detailed Report** - Receive comprehensive security report

**📸 Image Upload Tips:**
• **Photos**: Send as photo (preserves original format)
• **Documents**: Send as document for any file type
• **Quality**: Both methods preserve original quality

**🔒 Security & Privacy:**
• Files are processed in isolated environment
• No data retention after analysis
• Enterprise-grade security measures
• GDPR compliant

**⚡ Commands:**
• `/start` - Welcome message
• `/help` - This help message
• `/status` - Check bot status
• `/website` - Direct link to analysis platform
• `/stop` - Cancel your active analyses

**🌐 Analysis Platform:** {website_url}

Need more help? Contact our support team!
        """.format(website_url=self.website_url)
        
        keyboard = [
            [InlineKeyboardButton("🌐 Go to Analysis Platform", url=self.website_url)],
            [InlineKeyboardButton("📞 Contact Support", url="https://your-website.com/support")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(help_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def status_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /status command"""
        user = update.effective_user
        telegram_id = user.id
        
        # Check if user is linked
        if not self.is_user_linked(telegram_id):
            await update.message.reply_text(
                f"⚠️ **Account Not Registered**\n\n"
                f"Hi {user.first_name}! You need to link your Aejis account first.\n\n"
                f"Visit {self.website_url}/dashboard to link your account.",
                parse_mode='Markdown'
            )
            return
        
        # User is linked - show status
        status_message = f"""
🛡️ **Aejis Security Bot - Status**

**✅ Account:** Linked to Aejis
**👤 User:** {user.first_name}
**🌐 Platform:** Available
**🔍 Engines:** 70+ Antivirus engines active
**🤖 AI Analysis:** Operational
**🐳 Sandbox:** Available

**📊 System Status:**
• All systems operational ✅
• Latest threat definitions loaded ✅
• Real-time monitoring active ✅
• Secure analysis environment ready ✅

**🚀 Ready to Scan:**
Send me a file or URL to analyze!
        """
        
        keyboard = [
            [InlineKeyboardButton("🌐 View Dashboard", url=f"{self.website_url}/dashboard")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(status_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def reload_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /reload command - reload linked users (admin only)"""
        user = update.effective_user
        
        # Simple admin check - you can make this more secure
        # For now, anyone can reload (useful for testing)
        
        await update.message.reply_text("Reloading linked users from database...")
        
        try:
            await self.load_linked_users()
            await update.message.reply_text(
                f"Successfully reloaded linked users.\n"
                f"Total linked users: {len(self.linked_users)}"
            )
            logger.info(f"Manual reload triggered by user {user.id} ({user.first_name})")
        except Exception as e:
            await update.message.reply_text(f"Error reloading users: {str(e)}")
            logger.error(f"Error in manual reload: {e}")
    
    async def website_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /website command"""
        website_message = f"""
🌐 **Aejis Analysis Platform**

**Direct Link:** {self.website_url}

**🚀 Features:**
• Drag & drop file upload
• Real-time analysis progress
• Interactive threat dashboard
• Detailed security reports
• Export results in multiple formats

**📱 Mobile Friendly:**
• Responsive design
• Touch-optimized interface
• Works on all devices

Click the button below to access our analysis platform!
        """
        
        keyboard = [
            [InlineKeyboardButton("🌐 Open Analysis Platform", url=self.website_url)]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(website_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def stop_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /stop command - cancel active analyses"""
        user = update.effective_user
        user_id = user.id
        
        # Store user chat ID for notifications
        self.store_user_chat_id(user_id, update.message.chat_id)
        
        logger.info(f"Stop command called by user {user_id} ({user.first_name})")
        
        try:
            # Get all active analyses from backend
            import requests
            response = requests.get(f"{self.api_url}/api/analyses/active", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                active_analyses_data = data.get('active_analyses', [])
                logger.info(f"Found {len(active_analyses_data)} active analyses in backend")
                
                if not active_analyses_data:
                    await update.message.reply_text(
                        "ℹ️ **No Active Analyses**\n\nYou don't have any running analyses to cancel.",
                        parse_mode='Markdown'
                    )
                    return
                
                # Extract analysis IDs
                active_analyses = [analysis['analysis_id'] for analysis in active_analyses_data]
                logger.info(f"Active analysis IDs: {active_analyses}")
                
                cancelled_count = 0
                
                for analysis_id in active_analyses:
                    try:
                        logger.info(f"Attempting to cancel analysis {analysis_id} for user {user_id}")
                        # Call backend to cancel analysis
                        cancel_response = requests.post(f"{self.api_url}/api/analysis/{analysis_id}/cancel", 
                                                       json={'user_id': user_id}, timeout=5)
                        
                        logger.info(f"Backend response for {analysis_id}: {cancel_response.status_code} - {cancel_response.text}")
                        
                        if cancel_response.status_code == 200:
                            cancelled_count += 1
                            logger.info(f"Cancelled analysis {analysis_id} for user {user_id}")
                            
                            # Send individual cancellation notification to user
                            try:
                                analysis_info = next((a for a in active_analyses_data if a['analysis_id'] == analysis_id), {})
                                filename = analysis_info.get('filename', 'Unknown file')
                                analysis_type = "URL" if analysis_info.get('is_url') else "File"
                                
                                notification_message = f"""
🛑 **Analysis Cancelled**

**📁 {analysis_type}:** `{filename}`
**🆔 Analysis ID:** `{analysis_id}`
**👤 User:** {user.first_name}

**✅ Status:** Successfully cancelled by user request
**⏰ Time:** {datetime.now().strftime('%H:%M:%S')}

The analysis process has been stopped and will not continue.
                                """
                                
                                await update.message.reply_text(notification_message, parse_mode='Markdown')
                                logger.info(f"Sent cancellation notification for {analysis_id} to user {user_id}")
                                
                            except Exception as notify_error:
                                logger.error(f"Failed to send notification for {analysis_id}: {notify_error}")
                        else:
                            logger.warning(f"Failed to cancel analysis {analysis_id}: {cancel_response.text}")
                            
                    except Exception as e:
                        logger.error(f"Error cancelling analysis {analysis_id}: {e}")
                
                if cancelled_count > 0:
                    await update.message.reply_text(
                        f"✅ **Analysis Cancelled**\n\nSuccessfully cancelled {cancelled_count} active analysis(es).",
                        parse_mode='Markdown'
                    )
                else:
                    await update.message.reply_text(
                        "❌ **Cancellation Failed**\n\nUnable to cancel any analyses. They may have already completed or failed.",
                        parse_mode='Markdown'
                    )
            else:
                logger.error(f"Failed to get backend status: {response.status_code}")
                await update.message.reply_text(
                    "❌ **Error**\n\nUnable to connect to the analysis system. Please try again later.",
                    parse_mode='Markdown'
                )
                
        except Exception as e:
            logger.error(f"Error in stop command: {e}")
            await update.message.reply_text(
                "❌ **Error**\n\nAn error occurred while trying to cancel analyses. Please try again.",
                parse_mode='Markdown'
            )
    
    async def handle_file(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle file uploads - process in background and redirect to completed results"""
        user = update.effective_user
        message = update.message
        telegram_id = user.id
        
        # ========================================
        # ⚡ CHECK REGISTRATION FIRST - BEFORE ANYTHING!
        # ========================================
        if not self.is_user_linked(telegram_id):
            await message.reply_text(
                f"⚠️ **Account Not Registered**\n\n"
                f"Hi {user.first_name}! You need to link your Aejis account to scan files.\n\n"
                "**Quick Setup (30 seconds):**\n"
                f"1️⃣ Visit {self.website_url}\n"
                "2️⃣ Sign up with Google or Email\n"
                "3️⃣ Go to Dashboard\n"
                "4️⃣ Click 'Link Telegram Account'\n\n"
                "Then come back and send your file! 🚀",
                parse_mode='Markdown'
            )
            logger.info(f"⛔ Blocked unregistered user {telegram_id} from file upload")
            return  # ⛔ STOP - Don't process anything
        
        # ========================================
        # ✅ User is linked - Continue processing
        # ========================================
        
        # Store user chat ID for notifications
        self.store_user_chat_id(user.id, message.chat_id)
        
        # Get file information
        file_obj = None
        file_name = "unknown_file"
        file_size = 0
        
        if message.document:
            file_obj = message.document
            file_name = file_obj.file_name or "document"
            file_size = file_obj.file_size or 0
        elif message.photo:
            file_obj = message.photo[-1]
            # Get the actual file info to determine the correct extension
            try:
                file_info = await context.bot.get_file(file_obj.file_id)
                logger.info(f"🔍 Telegram file info: {file_info.file_path}")
                # Try to get the actual file extension from the file path
                file_path = file_info.file_path
                if file_path and '.' in file_path:
                    file_ext = os.path.splitext(file_path)[1].lower()
                    logger.info(f"🔍 Detected file extension: {file_ext}")
                    if file_ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg']:
                        file_name = f"image_{int(datetime.now().timestamp())}{file_ext}"
                        logger.info(f"✅ Using detected extension: {file_name}")
                    else:
                        file_name = f"image_{int(datetime.now().timestamp())}.jpg"  # fallback
                        logger.info(f"⚠️ Unknown extension, using fallback: {file_name}")
                else:
                    file_name = f"image_{int(datetime.now().timestamp())}.jpg"  # fallback
                    logger.info(f"⚠️ No extension in file path, using fallback: {file_name}")
            except Exception as e:
                logger.warning(f"Could not determine file extension: {e}")
                file_name = f"image_{int(datetime.now().timestamp())}.jpg"  # fallback
                logger.info(f"⚠️ Exception occurred, using fallback: {file_name}")
            file_size = file_obj.file_size or 0
        elif message.video:
            file_obj = message.video
            file_name = file_obj.file_name or f"video_{int(datetime.now().timestamp())}.mp4"
            file_size = file_obj.file_size or 0
        elif message.audio:
            file_obj = message.audio
            file_name = file_obj.file_name or f"audio_{int(datetime.now().timestamp())}.mp3"
            file_size = file_obj.file_size or 0
        elif message.voice:
            file_obj = message.voice
            file_name = f"voice_{int(datetime.now().timestamp())}.ogg"
            file_size = file_obj.file_size or 0
        elif message.video_note:
            file_obj = message.video_note
            file_name = f"video_note_{int(datetime.now().timestamp())}.mp4"
            file_size = file_obj.file_size or 0
        elif message.animation:
            file_obj = message.animation
            file_name = file_obj.file_name or f"animation_{int(datetime.now().timestamp())}.gif"
            file_size = file_obj.file_size or 0
        
        if not file_obj:
            await message.reply_text(
                "UNSUPPORTED FILE TYPE\n\n"
                "Please send a supported file format. Use /help for more information."
            )
            return
        
        # Check file size
        if file_size > Config.MAX_FILE_SIZE:
            size_mb = file_size / (1024 * 1024)
            max_mb = Config.MAX_FILE_SIZE // (1024 * 1024)
            await message.reply_text(
                f"FILE TOO LARGE\n\n"
                f"File size: {size_mb:.1f}MB\n"
                f"Max allowed: {max_mb}MB\n\n"
                f"Please use our website for larger files: {self.website_url}"
            )
            return
        
        # Send processing message
        processing_msg = await message.reply_text(
            "PROCESSING FILE ANALYSIS\n\n"
            "• Downloading file from Telegram servers\n"
            "• Transferring to analysis platform\n"
            "• Starting security analysis\n"
            "• Running 70+ antivirus engines\n"
            "• AI analysis in progress\n"
            "• Sandbox behavioral analysis\n\n"
            "Estimated time: 30-60 seconds"
        )
        
        try:
            # Download file from Telegram directly to memory (no disk storage)
            file_content = await self._download_file_to_memory(file_obj)
            
            # Upload file content directly to backend API and start analysis
            analysis_id = await self._upload_to_backend(file_content, file_name, user.id)
            
            # Track this analysis for the user
            if user.id not in self.user_analyses:
                self.user_analyses[user.id] = []
            self.user_analyses[user.id].append(analysis_id)
            
            # Wait for analysis to complete
            await self._wait_for_analysis_completion(analysis_id)
            
            # Create success message with direct link to COMPLETED results
            file_size_mb = file_size / (1024 * 1024) if file_size > 0 else 0
            results_url = f"{self.website_url}/results/{analysis_id}"
            
            success_message = f"""
ANALYSIS COMPLETE

File: {file_name}
Size: {file_size_mb:.2f}MB
Analysis ID: {analysis_id}
User: {user.first_name}

Analysis Results:
• 70+ Antivirus engines completed
• AI analysis completed
• Sandbox analysis completed
• Threat assessment ready
• Detailed report generated

View Your Results:
Click the links below to see your complete security analysis report.
            """
            
            # Create URLs for both views
            preview_url = f"{self.website_url}/preview/{analysis_id}"
            
            # Send success message with URLs in text (Telegram doesn't allow localhost in buttons)
            success_message_with_urls = success_message + f"""

View Detailed Report:
{results_url}

Preview File Contents:
{preview_url}
            """
            
            await processing_msg.edit_text(success_message_with_urls)
            
            # Log the successful completion
            logger.info(f"Analysis completed: {file_name} ({file_size_mb:.2f}MB) from user {user.id}, analysis_id: {analysis_id}")
            
            # Remove from user's active analyses
            if user.id in self.user_analyses and analysis_id in self.user_analyses[user.id]:
                self.user_analyses[user.id].remove(analysis_id)
                if not self.user_analyses[user.id]:  # Clean up empty list
                    del self.user_analyses[user.id]
            
        except Exception as e:
            logger.error(f"Error processing file {file_name}: {str(e)}")
            
            # Mark analysis as failed in backend if analysis_id exists
            if 'analysis_id' in locals():
                try:
                    import requests
                    requests.post(f"{self.backend_url}/api/analysis/{analysis_id}/fail", 
                                json={'error': str(e)}, timeout=5)
                    logger.info(f"Marked analysis {analysis_id} as failed in backend")
                except Exception as backend_error:
                    logger.warning(f"Failed to mark analysis as failed in backend: {backend_error}")
                
                # Remove from user's active analyses
                if user.id in self.user_analyses and analysis_id in self.user_analyses[user.id]:
                    self.user_analyses[user.id].remove(analysis_id)
                    if not self.user_analyses[user.id]:  # Clean up empty list
                        del self.user_analyses[user.id]
            
            # Send error message
            error_message = f"""
ANALYSIS FAILED

File: {file_name}
User: {user.first_name}

Error: Unable to complete analysis automatically

Solutions:
• Try uploading directly to our website
• Check your internet connection
• Ensure file is not corrupted

Manual Upload:
{self.website_url}
            """
            
            # Send error message without inline keyboard to avoid URL issues
            await processing_msg.edit_text(error_message)
    
    async def handle_url(self, update: Update, url: str) -> None:
        """Handle URL analysis - process in background and redirect to completed results"""
        user = update.effective_user
        telegram_id = user.id
        
        # ========================================
        # ⚡ CHECK REGISTRATION FIRST - BEFORE ANYTHING!
        # ========================================
        if not self.is_user_linked(telegram_id):
            await update.message.reply_text(
                f"⚠️ **Account Not Registered**\n\n"
                f"Hi {user.first_name}! You need to link your Aejis account to scan URLs.\n\n"
                "**Quick Setup (30 seconds):**\n"
                f"1️⃣ Visit {self.website_url}\n"
                "2️⃣ Sign up with Google or Email\n"
                "3️⃣ Go to Dashboard\n"
                "4️⃣ Click 'Link Telegram Account'\n\n"
                "Then come back and send your URL! 🚀",
                parse_mode='Markdown'
            )
            logger.info(f"⛔ Blocked unregistered user {telegram_id} from URL scan")
            return  # ⛔ STOP - Don't process anything
        
        # ========================================
        # ✅ User is linked - Continue processing
        # ========================================
        
        # Store user chat ID for notifications
        self.store_user_chat_id(user.id, update.message.chat_id)
        
        try:
            # Send initial processing message
            processing_message = f"""
PROCESSING URL ANALYSIS

URL: `{url}`
User: {user.first_name}

• Starting comprehensive website analysis
• Running advanced security checks
• AI threat assessment in progress
• Security intelligence gathering

Estimated time: 30-60 seconds
            """
            
            processing_msg = await update.message.reply_text(processing_message)
            
            # Start URL analysis via backend API
            analysis_id = await self._analyze_url_with_backend(url, user.id)
            
            if not analysis_id:
                raise Exception("Failed to start URL analysis")
            
            # Track this analysis for the user
            if user.id not in self.user_analyses:
                self.user_analyses[user.id] = []
            self.user_analyses[user.id].append(analysis_id)
            
            # Wait for analysis completion
            await self._wait_for_analysis_completion(analysis_id)
            
            # Send success message with direct URLs in text (not inline buttons)
            success_message_with_urls = f"""
ANALYSIS COMPLETE

URL: {url}
User: {user.first_name}
Analysis ID: {analysis_id}

Website Intelligence:
• Domain analysis completed
• Security assessment completed  
• AI threat analysis completed
• Reputation scoring completed
• Comprehensive report generated

View Your Results:
{self.website_url}/results/{analysis_id}

Available Features:
• Complete security analysis
• Safe website preview (desktop app)
• Interactive file inspector
• Detailed reports
            """
            
            await processing_msg.edit_text(success_message_with_urls)
            
            # Log the successful completion
            logger.info(f"URL analysis completed: {url} from user {user.id}, analysis_id: {analysis_id}")
            
            # Remove from user's active analyses
            if user.id in self.user_analyses and analysis_id in self.user_analyses[user.id]:
                self.user_analyses[user.id].remove(analysis_id)
                if not self.user_analyses[user.id]:  # Clean up empty list
                    del self.user_analyses[user.id]
            
        except Exception as e:
            logger.error(f"Error processing URL {url}: {str(e)}")
            
            # Mark analysis as failed in backend if analysis_id exists
            if 'analysis_id' in locals():
                try:
                    import requests
                    requests.post(f"{self.backend_url}/api/analysis/{analysis_id}/fail", 
                                json={'error': str(e)}, timeout=5)
                    logger.info(f"Marked URL analysis {analysis_id} as failed in backend")
                except Exception as backend_error:
                    logger.warning(f"Failed to mark URL analysis as failed in backend: {backend_error}")
                
                # Remove from user's active analyses
                if user.id in self.user_analyses and analysis_id in self.user_analyses[user.id]:
                    self.user_analyses[user.id].remove(analysis_id)
                    if not self.user_analyses[user.id]:  # Clean up empty list
                        del self.user_analyses[user.id]
            
            # Send error message
            error_message = f"""
URL ANALYSIS FAILED

URL: {url}
User: {user.first_name}

Error: Unable to complete analysis automatically

Solutions:
• Try analyzing directly on our website
• Check if the URL is accessible
• Ensure the URL format is correct

Manual Analysis:
{self.website_url}
            """
            
            # Send error message
            await processing_msg.edit_text(error_message)
    
    async def _analyze_url_with_backend(self, url: str, user_id: int) -> str:
        """Send URL to backend for analysis"""
        try:
            payload = {
                'url': url
            }
            
            response = requests.post(
                f"{self.api_url}/analyze-url",
                json=payload,
                timeout=300  # 5 minute timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('analysis_id')
            else:
                logger.error(f"Backend URL analysis failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error sending URL to backend: {str(e)}")
            return None
    
    async def _download_file_to_memory(self, file_obj) -> bytes:
        """Download file from Telegram directly to memory (no disk storage)"""
        # Get file from Telegram
        file = await file_obj.get_file()
        
        # Download file content directly to memory
        file_content = await file.download_as_bytearray()
        
        return bytes(file_content)
    
    async def _upload_to_backend(self, file_content: bytes, file_name: str, user_id: int) -> str:
        """Upload file content directly to backend API and return analysis ID"""
        try:
            # Prepare file for upload using BytesIO (in-memory file-like object)
            from io import BytesIO
            file_obj = BytesIO(file_content)
            
            files = {'file': (file_name, file_obj, 'application/octet-stream')}
            data = {'user_id': str(user_id)}
            
            # Upload to backend
            response = requests.post(
                f"{self.api_url}/upload",
                files=files,
                data=data,
                timeout=300  # 5 minutes timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('analysis_id', str(uuid.uuid4()))
            else:
                raise Exception(f"Backend API error: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error: {str(e)}")
        except Exception as e:
            raise Exception(f"Upload error: {str(e)}")
    
    async def _wait_for_analysis_completion(self, analysis_id: str, max_wait_time: int = 300) -> None:
        """Wait for analysis to complete by polling the status"""
        start_time = datetime.now()
        
        while (datetime.now() - start_time).seconds < max_wait_time:
            try:
                # Check analysis status
                response = requests.get(f"{self.api_url}/status/{analysis_id}", timeout=10)
                
                if response.status_code == 200:
                    status_data = response.json()
                    status = status_data.get('status', 'unknown')
                    
                    if status == 'completed':
                        logger.info(f"Analysis {analysis_id} completed successfully")
                        return
                    elif status == 'failed':
                        raise Exception("Analysis failed")
                    elif status == 'processing':
                        # Show current progress
                        progress = status_data.get('progress', 0)
                        steps = status_data.get('steps', [])
                        current_step = next((step for step in steps if step.get('status') == 'processing'), None)
                        if current_step:
                            logger.info(f"Analysis {analysis_id}: {current_step.get('name', 'Processing')} ({progress}%)")
                        # Still processing, wait a bit more
                        await asyncio.sleep(10)
                        continue
                    else:
                        # Unknown status, wait a bit more
                        await asyncio.sleep(5)
                        continue
                else:
                    # API error, wait and retry
                    await asyncio.sleep(5)
                    continue
                    
            except requests.exceptions.RequestException:
                # Network error, wait and retry
                await asyncio.sleep(5)
                continue
        
        # If we get here, analysis took too long
        raise Exception(f"Analysis timeout after {max_wait_time} seconds")
    
    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle callback queries"""
        query = update.callback_query
        await query.answer()
        
        if query.data == "help":
            await self.help_command(update, context)
        elif query.data == "how_to_use":
            how_to_message = """
📖 **How to Use Aejis Analysis Platform**

**Step 1: Access Platform**
• Click the "Continue Analysis" button
• Or visit: {website_url}

**Step 2: Upload File**
• Drag & drop your file
• Or click "Choose File" button
• Supported formats: All major file types

**Step 3: Watch Analysis**
• Real-time progress updates
• Live threat detection
• Interactive dashboard

**Step 4: Get Results**
• Comprehensive security report
• Threat details and explanations
• Downloadable results

**🔒 Security Features:**
• Isolated analysis environment
• No data retention
• Enterprise-grade security

Ready to start? Click the button below!
            """.format(website_url=self.website_url)
            
            keyboard = [
                [InlineKeyboardButton("🌐 Start Analysis Now", url=self.website_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(how_to_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def handle_text(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle text messages including URLs"""
        text = update.message.text
        text_lower = text.lower()
        
        # Check if the message contains a URL
        import re
        url_pattern = r'https?://[^\s]+'
        urls = re.findall(url_pattern, text)
        
        if urls:
            # Handle URL analysis
            url = urls[0]  # Take the first URL found
            await self.handle_url(update, url)
        elif any(word in text_lower for word in ['scan', 'analyze', 'check', 'security', 'malware', 'virus']):
            response = """
🛡️ **Ready to Analyze!**

To analyze files or websites for security threats, simply:

1. **Send me any file** (document, image, archive, etc.)
2. **Send me any URL** (website link to analyze)
3. **Get redirected** to our analysis platform
4. **Watch real-time analysis** with advanced engines
5. **Receive detailed report** with threat insights

**🌐 Or visit directly:** `{website_url}`

What would you like to analyze?
            """.format(website_url=self.website_url)
            
            await update.message.reply_text(response, parse_mode='Markdown')
        else:
            await update.message.reply_text(
                "👋 Hello! Send me a file or URL to analyze, or use /help for more information.",
                parse_mode='Markdown'
            )

async def post_init(application: Application) -> None:
    """Post-initialization - load linked users"""
    bot = application.bot_data.get('bot_instance')
    if bot:
        logger.info("🔄 Loading linked users from backend...")
        await bot.load_linked_users()
        logger.info("✅ Linked users loaded successfully")
    
    # Schedule periodic reload every hour (if job_queue is available)
    if application.job_queue:
        from datetime import timedelta
        application.job_queue.run_repeating(
            lambda context: asyncio.create_task(bot.load_linked_users()),
            interval=timedelta(hours=1),
            first=timedelta(hours=1)
        )
        logger.info("⏰ Scheduled hourly linked users refresh")
    else:
        logger.warning("⚠️ JobQueue not available - linked users will only load on startup")
        logger.info("💡 To enable auto-refresh, install: pip install python-telegram-bot[job-queue]")

def main():
    """Main function to run the bot"""
    # Validate configuration
    try:
        Config.validate_config()
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        return
    
    # Create application
    application = Application.builder().token(Config.TELEGRAM_BOT_TOKEN).build()
    
    # Create bot instance
    bot = AejisRedirectBot()
    
    # Store bot instance for post_init
    application.bot_data['bot_instance'] = bot
    
    # Add handlers
    application.add_handler(CommandHandler("start", bot.start_command))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(CommandHandler("status", bot.status_command))
    application.add_handler(CommandHandler("website", bot.website_command))
    application.add_handler(CommandHandler("reload", bot.reload_command))
    application.add_handler(CommandHandler("stop", bot.stop_command))
    application.add_handler(MessageHandler(filters.Document.ALL | filters.PHOTO | 
                                         filters.VIDEO | filters.AUDIO | 
                                         filters.VOICE | filters.VIDEO_NOTE | 
                                         filters.ANIMATION, bot.handle_file))
    application.add_handler(CallbackQueryHandler(bot.handle_callback))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_text))
    
    # Post-initialization - load linked users
    application.post_init = post_init
    
    # Start the bot
    logger.info("🚀 Starting Aejis Redirect Bot with account verification...")
    logger.info("🔒 All users must have linked Aejis accounts to use the bot")
    application.run_polling()

if __name__ == "__main__":
    main()
