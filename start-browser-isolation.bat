@echo off
echo 🚀 Starting Aejis Browser Isolation System...
echo 🛡️ 100%% Commercial-friendly (no licensing restrictions)
echo 🔒 Complete isolation with random location spoofing
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Build the browser isolation image
echo 🔨 Building Aejis Browser Isolation image...
docker build -f Dockerfile.browser-isolation -t aejis-browser-isolation:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build browser isolation image
    pause
    exit /b 1
)

echo ✅ Browser isolation image built successfully
echo.

REM Start the browser isolation system
echo 🚀 Starting Aejis Browser Isolation System...
docker-compose -f docker-compose.browser-isolation.yml up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start browser isolation system
    pause
    exit /b 1
)

echo ✅ Aejis Browser Isolation System started successfully!
echo.
echo 🌐 Web Interface: http://localhost:6080
echo 🔒 VNC Server: localhost:5901
echo 🛡️ Complete isolation active
echo 🌍 Random location spoofing enabled
echo.
echo Press any key to continue...
pause >nul
