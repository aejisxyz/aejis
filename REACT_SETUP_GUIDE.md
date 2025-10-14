# 🛡️ Aejis Security - React.js Setup Guide

## 🎯 Overview

This guide will help you set up the complete Aejis Security platform with:
- **React.js Frontend** - Modern, responsive web interface
- **Flask Backend** - Secure API for file analysis
- **Telegram Bot** - Lightweight redirect service

## 📁 Project Structure

```
Aejis/
├── src/                          # React frontend
│   ├── components/              # Reusable components
│   ├── pages/                   # Main pages
│   ├── App.js                   # Main app component
│   └── index.js                 # Entry point
├── public/                      # Static assets
├── main_redirect.py             # Telegram bot (redirect)
├── website_backend.py           # Flask API
├── virustotal_engine.py         # VirusTotal integration
├── file_analyzer.py             # Analysis engine
├── config.py                    # Configuration
├── package.json                 # React dependencies
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. **Install Dependencies**

#### Backend (Python)
```bash
# Install Python dependencies
pip install -r requirements.txt
```

#### Frontend (React)
```bash
# Install Node.js dependencies
npm install
```

### 2. **Configure Environment**

Update `config.py` with your API keys:
```python
TELEGRAM_BOT_TOKEN = "your_telegram_bot_token"
VIRUSTOTAL_API_KEY = "your_virustotal_api_key"
GEMINI_API_KEY = "your_gemini_api_key"
```

### 3. **Start the Services**

#### Terminal 1: Flask Backend
```bash
python website_backend.py
```
- API will run on: http://localhost:5000

#### Terminal 2: React Frontend
```bash
npm start
```
- Website will run on: http://localhost:3000

#### Terminal 3: Telegram Bot
```bash
python main_redirect.py
```
- Bot will redirect users to your website

## 🔧 Detailed Setup

### **Backend Setup (Flask API)**

1. **Install Python Dependencies:**
```bash
pip install Flask Flask-CORS Werkzeug requests python-telegram-bot google-generativeai docker Pillow python-magic
```

2. **Configure API Keys:**
   - Get VirusTotal API key from: https://www.virustotal.com/gui/my-apikey
   - Get Gemini API key from: https://makersuite.google.com/app/apikey
   - Get Telegram Bot token from: @BotFather

3. **Start the API:**
```bash
python website_backend.py
```

### **Frontend Setup (React.js)**

1. **Install Node.js Dependencies:**
```bash
npm install react react-dom react-scripts react-router-dom axios react-dropzone react-icons framer-motion react-hot-toast
```

2. **Start Development Server:**
```bash
npm start
```

3. **Build for Production:**
```bash
npm run build
```

### **Telegram Bot Setup**

1. **Update Website URL:**
   - Edit `main_redirect.py`
   - Change `self.website_url = "https://your-domain.com"`

2. **Start the Bot:**
```bash
python main_redirect.py
```

## 🌐 Deployment

### **Frontend Deployment (React)**

#### Option 1: Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the 'build' folder to Netlify
```

#### Option 2: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 3: GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### **Backend Deployment (Flask)**

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Procfile:
echo "web: gunicorn website_backend:app" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Option 2: DigitalOcean App Platform
```bash
# Create app.yaml:
name: aejis-security-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/aejis-security
    branch: main
  run_command: gunicorn website_backend:app
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
```

#### Option 3: AWS EC2
```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Install Python packages
pip3 install -r requirements.txt

# Configure Nginx
sudo nano /etc/nginx/sites-available/aejis-api
# Add configuration for reverse proxy

# Start services
sudo systemctl start nginx
python3 website_backend.py
```

## 🔒 Environment Variables

Create a `.env` file for production:

```bash
# Backend (.env)
TELEGRAM_BOT_TOKEN=your_bot_token
VIRUSTOTAL_API_KEY=your_virustotal_key
GEMINI_API_KEY=your_gemini_key
FLASK_ENV=production
SECRET_KEY=your_secret_key

# Frontend (.env)
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WEBSITE_URL=https://your-website-domain.com
```

## 📱 User Experience Flow

1. **User sends file to Telegram bot**
2. **Bot responds with redirect message**
3. **User clicks link to React website**
4. **Beautiful upload interface with drag & drop**
5. **Real-time analysis progress with 5 steps**
6. **Professional results with 70+ engine display**
7. **Downloadable reports and sharing options**

## 🎨 Features

### **React Frontend:**
- ✅ Modern, responsive design
- ✅ Drag & drop file upload
- ✅ Real-time progress tracking
- ✅ Professional results display
- ✅ Downloadable reports
- ✅ Share functionality
- ✅ Mobile-friendly interface
- ✅ Smooth animations with Framer Motion

### **Flask Backend:**
- ✅ RESTful API endpoints
- ✅ File upload handling
- ✅ Real-time status updates
- ✅ VirusTotal integration
- ✅ AI analysis
- ✅ Sandbox analysis
- ✅ CORS support for React
- ✅ Error handling

### **Telegram Bot:**
- ✅ Lightweight redirect service
- ✅ Professional messaging
- ✅ File type detection
- ✅ Size validation
- ✅ Quick redirect to website

## 🔧 Customization

### **Styling:**
- Edit CSS files in `src/components/` and `src/pages/`
- Modify color scheme in CSS variables
- Update branding in `src/components/Header.js`

### **API Endpoints:**
- Add new endpoints in `website_backend.py`
- Update React components to use new endpoints
- Modify error handling as needed

### **Bot Messages:**
- Customize messages in `main_redirect.py`
- Update website URL and branding
- Modify file handling logic

## 🐛 Troubleshooting

### **Common Issues:**

1. **CORS Errors:**
   - Ensure Flask-CORS is installed
   - Check CORS configuration in `website_backend.py`

2. **File Upload Issues:**
   - Check file size limits
   - Verify file type restrictions
   - Ensure proper error handling

3. **API Connection Issues:**
   - Verify API keys are correct
   - Check network connectivity
   - Review error logs

4. **React Build Issues:**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify Node.js version compatibility

### **Debug Mode:**
```bash
# Backend debug
export FLASK_DEBUG=1
python website_backend.py

# Frontend debug
npm start
# Check browser console for errors
```

## 📊 Performance Optimization

### **Frontend:**
- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize images and assets
- Use production build for deployment

### **Backend:**
- Implement caching for API responses
- Use connection pooling for database
- Optimize file processing
- Add rate limiting

## 🔐 Security Considerations

- Use HTTPS in production
- Implement proper authentication
- Validate all file uploads
- Sanitize user inputs
- Use environment variables for secrets
- Implement rate limiting
- Regular security updates

## 📈 Monitoring

- Add logging to track usage
- Monitor API performance
- Set up error tracking
- Implement health checks
- Monitor file upload success rates

---

**🎯 Your React.js Aejis Security platform is now ready!**

**Next Steps:**
1. Deploy to production
2. Set up monitoring
3. Customize branding
4. Add additional features
5. Scale as needed

**Need Help?** Check the troubleshooting section or review the code comments for detailed explanations.

