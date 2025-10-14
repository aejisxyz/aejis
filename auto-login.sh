#!/bin/bash

# Auto-login script for Aejis Browser Isolation
echo "🚀 Starting Aejis Browser Isolation Auto-Login..."

# Set up display
export DISPLAY=:1

# Kill any existing login screens
pkill -f lightdm
pkill -f gdm
pkill -f sddm

# Start XFCE session directly for aejis user
su - aejis -c "startxfce4 &" &

# Wait a moment for XFCE to start
sleep 5

# Launch Chrome with target URL
if [ ! -z "$TARGET_URL" ]; then
    echo "🌐 Launching browser for: $TARGET_URL"
    su - aejis -c "DISPLAY=:1 google-chrome --new-window --start-maximized $TARGET_URL &"
else
    echo "🌐 Launching browser for: https://www.google.com"
    su - aejis -c "DISPLAY=:1 google-chrome --new-window --start-maximized https://www.google.com &"
fi

echo "✅ Auto-login completed!"
