@echo off
echo 🚀 Starting Aejis Security Platform with noVNC Browser Isolation...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Create necessary directories
if not exist "analysis_data" mkdir analysis_data
if not exist "frontend\node_modules" mkdir frontend\node_modules

REM Build and start containers
echo 📦 Building and starting containers...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...

REM Check backend
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on http://localhost:5000
) else (
    echo ❌ Backend is not responding
)

REM Check frontend
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on http://localhost:3000
) else (
    echo ❌ Frontend is not responding
)

REM Check noVNC browser
curl -s http://localhost:6080 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ noVNC Browser is running on http://localhost:6080
) else (
    echo ❌ noVNC Browser is not responding
)

echo.
echo 🎉 Aejis Security Platform is ready!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 🖥️  noVNC Browser: http://localhost:6080
echo.
echo 💡 To stop the platform, run: docker-compose down
echo 📊 To view logs, run: docker-compose logs -f
pause

