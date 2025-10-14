# 🛡️ Aejis

**Advanced Security Analysis Platform**

Comprehensive file and URL security analysis with Telegram Bot integration, powered by AI and multi-engine scanning.

## ✨ Features

- 🔍 **File Analysis** - Scan any file type with 70+ antivirus engines
- 🌐 **URL Analysis** - Check websites for phishing and security threats
- 🤖 **Telegram Bot** - Easy access via @Aejis_Bot
- 🖥️ **Web Dashboard** - Modern React-based interface
- 🔒 **Firebase Auth** - Secure account system with Google sign-in
- 🐳 **Docker Isolation** - Safe file preview in isolated containers
- 📊 **Real-time Results** - Instant security analysis with detailed reports

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **Docker** (for file isolation)
- **Telegram Bot Token** (from [@BotFather](https://t.me/BotFather))
- **Firebase Account** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aejisxyz/aejis.git
   cd aejis
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and tokens
   ```

5. **Start the services**
   ```bash
   # Backend
   python website_backend.py
   
   # Telegram Bot
   python main_redirect.py
   
   # Frontend
   npm start
   ```

## 📋 Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Firebase (for frontend - prefix with REACT_APP_)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# API URLs
WEBSITE_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000

# Optional
GEMINI_API_KEY=your_gemini_api_key_here
LOG_LEVEL=INFO
```

## 🏗️ Architecture

```
Frontend (React)     →  Vercel / Nginx
Backend (Flask)      →  VPS / Cloud
Telegram Bot (Python)→  VPS / Cloud
Docker (Isolation)   →  Same as Backend
```

## 🔒 Security

- End-to-end encryption for file transfers
- Docker-based file isolation
- Firebase authentication
- No permanent file storage
- Account-based bot access control

## 📱 Usage

### Telegram Bot
1. Open [@Aejis_Bot](https://t.me/Aejis_Bot)
2. Link your Aejis account
3. Send files or URLs for analysis
4. Get instant security reports

### Web Dashboard
1. Visit your deployment URL
2. Sign in with Google or Email
3. Link Telegram account
4. Upload files or enter URLs
5. View detailed analysis results

## 📊 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Recommended:**
- Frontend: Vercel (free tier)
- Backend + Bot: Hetzner VPS (€4.50/month)
- Domain: Cloudflare (~$10/year)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/aejisxyz/aejis/issues)
- **Documentation**: Check `/docs` folder
- **Website**: [aejis.xyz](https://aejis.xyz)

## ⭐ Acknowledgments

- Google Gemini AI for advanced threat detection
- Telegram Bot API for seamless integration
- Firebase for authentication infrastructure
- Docker for secure file isolation

---

<div align="center">

**Made with ❤️ by Aejis**

[Website](https://aejis.xyz) · [Telegram](https://t.me/Aejis_Bot) · [GitHub](https://github.com/aejisxyz/aejis)

</div>

