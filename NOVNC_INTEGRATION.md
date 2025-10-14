# 🛡️ Aejis Security Platform - noVNC Browser Isolation

## Overview

Aejis now includes **noVNC-based remote browser isolation** for secure website previews. This provides a completely isolated browsing environment where users can safely interact with potentially malicious websites without any risk to their local system.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Windows 10/11 or macOS/Linux

### Start the Platform

**Windows:**
```bash
start-aejis.bat
```

**Linux/macOS:**
```bash
chmod +x start-aejis.sh
./start-aejis.sh
```

**Manual:**
```bash
docker-compose up --build -d
```

## 🌐 Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React web interface |
| **Backend** | http://localhost:5000 | Flask API server |
| **noVNC Browser** | http://localhost:6080 | Isolated browser container |

## 🔧 How It Works

### 1. **URL Analysis**
- User uploads a suspicious URL
- Backend performs comprehensive analysis (VirusTotal, AI, etc.)
- Results stored with analysis ID

### 2. **Secure Preview Options**
- **Standard Preview**: Custom proxy system (existing)
- **Isolated Browser**: noVNC container (new)

### 3. **noVNC Browser Session**
- Docker container with Ubuntu + Chrome/Firefox
- VNC server for remote access
- noVNC web client for browser interaction
- Complete isolation from host system

## 🛡️ Security Features

### **Complete Isolation**
- ✅ Browser runs in Docker container
- ✅ No access to host filesystem
- ✅ No network access to local network
- ✅ Ephemeral sessions (no persistence)

### **Extension-Free Environment**
- ✅ No browser extensions installed
- ✅ No crypto wallet interference
- ✅ Clean browser environment
- ✅ No tracking or analytics

### **Real-time Interaction**
- ✅ Full website functionality
- ✅ Click, scroll, type normally
- ✅ Form submissions work
- ✅ JavaScript execution

## 📱 Usage

### **For URL Analysis:**

1. **Upload URL** via web interface or Telegram bot
2. **View Analysis Results** with comprehensive security report
3. **Choose Preview Method:**
   - **"Open Safe Preview"** - Custom proxy system
   - **"Open Isolated Browser"** - noVNC container

### **Isolated Browser Features:**

- **Full Screen Mode** - Click "New Tab" for full window
- **Real-time Interaction** - Navigate websites normally
- **Session Management** - Automatic cleanup on close
- **Security Status** - Live connection indicators

## 🔧 Technical Details

### **Docker Architecture**
```
aejis-browser (noVNC)
├── Ubuntu 20.04
├── Chrome + Firefox
├── VNC Server (port 5900)
└── noVNC Web Client (port 6080)

aejis-backend (Flask)
├── Analysis Engine
├── noVNC Service
└── API Endpoints

aejis-frontend (React)
├── Results Display
├── NoVNC Viewer Component
└── Preview Controls
```

### **API Endpoints**

```bash
# Start browser session
GET /browser/{analysis_id}

# Get session status
GET /browser/{analysis_id}/status

# Stop session
POST /browser/{analysis_id}/stop

# Browser info
GET /browser/info
```

### **NoVNC Viewer Component**
- React component for browser integration
- Real-time status monitoring
- Session management
- Error handling and retry logic

## 🚨 Troubleshooting

### **Browser Not Starting**
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs aejis-browser

# Restart browser
docker-compose restart aejis-browser
```

### **VNC Connection Issues**
```bash
# Check VNC port
netstat -an | grep 6080

# Test VNC directly
curl http://localhost:6080
```

### **Performance Issues**
- Increase Docker memory allocation
- Close unused browser sessions
- Check system resources

## 🔄 Maintenance

### **Stop Platform**
```bash
docker-compose down
```

### **Update Platform**
```bash
docker-compose down
docker-compose pull
docker-compose up --build -d
```

### **View Logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f aejis-browser
```

## 🎯 Benefits Over Custom Proxy

| Feature | Custom Proxy | noVNC Browser |
|---------|-------------|---------------|
| **Isolation** | Partial | Complete |
| **Extensions** | Blocked (hacky) | None (clean) |
| **Functionality** | Limited | Full |
| **Maintenance** | High | Low |
| **Security** | Good | Excellent |
| **Performance** | Good | Excellent |

## 🚀 Future Enhancements

- **Multi-user Support** - Multiple concurrent sessions
- **Session Recording** - Capture user interactions
- **Advanced Automation** - Automated testing capabilities
- **Custom Browser Images** - Specialized browser configurations
- **Load Balancing** - Multiple browser containers

---

**Aejis Security Platform** - Advanced threat analysis with secure browser isolation 🛡️

