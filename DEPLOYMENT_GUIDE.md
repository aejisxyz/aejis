# 🛡️ Aejis Security - Deployment Guide

## 🎯 Architecture Overview

This deployment implements a **redirect-based architecture** where:
- **Telegram Bot**: Lightweight redirect service
- **Website**: Full analysis platform with real-time results
- **Backend**: Secure file processing and analysis

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Telegram Bot  │───▶│  Your Website    │───▶│  Analysis API   │
│  (Lightweight)  │    │  (Full Analysis) │    │  (VirusTotal)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
   Quick Redirect          File Upload &             70+ Engines
   & Instructions         Real-time Results          + Sandbox
```

## 📁 File Structure

```
Aejis/
├── main_redirect.py          # Lightweight Telegram bot
├── website_backend.py        # Flask web application
├── website_template.html     # Frontend template
├── virustotal_engine.py      # VirusTotal integration
├── file_analyzer.py          # Analysis engine
├── config.py                 # Configuration
└── templates/
    └── index.html           # Website template
```

## 🚀 Deployment Steps

### 1. **Telegram Bot Setup**

```bash
# Install dependencies
pip install python-telegram-bot

# Configure bot token in config.py
TELEGRAM_BOT_TOKEN = "your_bot_token_here"

# Update website URL in main_redirect.py
self.website_url = "https://your-domain.com"

# Run the bot
python main_redirect.py
```

### 2. **Website Backend Setup**

```bash
# Install Flask and dependencies
pip install flask werkzeug

# Configure VirusTotal API key
# Update virustotal_engine.py with your API key

# Run the website
python website_backend.py
```

### 3. **Web Server Deployment (Production)**

#### Option A: Using Gunicorn + Nginx

```bash
# Install Gunicorn
pip install gunicorn

# Create Gunicorn config
cat > gunicorn.conf.py << EOF
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
timeout = 120
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
EOF

# Run with Gunicorn
gunicorn -c gunicorn.conf.py website_backend:app
```

#### Option B: Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-c", "gunicorn.conf.py", "website_backend:app"]
```

```bash
# Build and run
docker build -t aejis-security .
docker run -p 5000:5000 aejis-security
```

### 4. **Domain and SSL Setup**

```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# Or using Cloudflare for SSL
# 1. Add domain to Cloudflare
# 2. Update nameservers
# 3. Enable SSL/TLS encryption
```

## 🔧 Configuration

### Environment Variables

```bash
# .env file
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VIRUSTOTAL_API_KEY=your_virustotal_api_key
GEMINI_API_KEY=your_gemini_api_key
WEBSITE_URL=https://your-domain.com
MAX_FILE_SIZE=52428800  # 50MB
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # File upload size limit
    client_max_body_size 50M;
}
```

## 🔒 Security Considerations

### 1. **File Upload Security**

```python
# In website_backend.py
ALLOWED_EXTENSIONS = {
    'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
    'zip', 'rar', '7z', 'tar', 'gz',
    'py', 'js', 'html', 'css', 'php', 'java', 'cpp', 'c',
    'mp4', 'avi', 'mp3', 'wav', 'ogg'
}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
```

### 2. **Rate Limiting**

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/upload', methods=['POST'])
@limiter.limit("10 per minute")
def upload_file():
    # Upload logic
```

### 3. **File Cleanup**

```python
import schedule
import time

def cleanup_old_files():
    """Clean up files older than 1 hour"""
    current_time = time.time()
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(file_path):
            if current_time - os.path.getctime(file_path) > 3600:  # 1 hour
                os.remove(file_path)

# Schedule cleanup every hour
schedule.every().hour.do(cleanup_old_files)
```

## 📊 Monitoring and Analytics

### 1. **Logging Configuration**

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/aejis.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

### 2. **Health Check Endpoint**

```python
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })
```

## 🚀 Production Deployment Checklist

- [ ] **Domain configured** with SSL certificate
- [ ] **Telegram bot** running and responding
- [ ] **Website backend** deployed and accessible
- [ ] **VirusTotal API** key configured
- [ ] **File upload limits** set appropriately
- [ ] **Rate limiting** implemented
- [ ] **Logging** configured
- [ ] **Monitoring** set up
- [ ] **Backup strategy** in place
- [ ] **Security headers** configured

## 📱 User Experience Flow

1. **User sends file to Telegram bot**
2. **Bot responds with redirect message**
3. **User clicks link to website**
4. **User uploads file on website**
5. **Real-time analysis progress shown**
6. **Detailed results displayed**
7. **Report can be downloaded/shared**

## 🔄 Maintenance

### Daily Tasks
- Monitor system health
- Check error logs
- Verify API quotas

### Weekly Tasks
- Update threat definitions
- Review security logs
- Performance optimization

### Monthly Tasks
- Security audit
- Backup verification
- System updates

## 📞 Support

For deployment issues or questions:
- Check logs in `/var/log/aejis/`
- Monitor system resources
- Verify API connectivity
- Test file upload functionality

---

**🎯 This architecture provides a scalable, secure, and professional file analysis platform!**

