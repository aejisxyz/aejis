#!/bin/bash

# Aejis Security Platform Startup Script
echo "🚀 Starting Aejis Security Platform with noVNC Browser Isolation..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create necessary directories
mkdir -p analysis_data
mkdir -p frontend/node_modules

# Build and start containers
echo "📦 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

# Check backend
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:5000"
else
    echo "❌ Backend is not responding"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not responding"
fi

# Check noVNC browser
if curl -s http://localhost:6080 > /dev/null; then
    echo "✅ noVNC Browser is running on http://localhost:6080"
else
    echo "❌ noVNC Browser is not responding"
fi

echo ""
echo "🎉 Aejis Security Platform is ready!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🖥️  noVNC Browser: http://localhost:6080"
echo ""
echo "💡 To stop the platform, run: docker-compose down"
echo "📊 To view logs, run: docker-compose logs -f"

