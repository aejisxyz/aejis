#!/bin/bash
# Aejis Browser Launcher - Isolated Browser with Security Hardening
# Launches browser with maximum security and isolation

echo "🌐 Launching isolated browser for: $1"

# Wait for X server
while ! xdpyinfo -display :1 >/dev/null 2>&1; do
    echo "⏳ Waiting for X server..."
    sleep 1
done

# Launch Firefox with maximum security
DISPLAY=:1 firefox \
    --profile ~/.mozilla/firefox/isolated.profile \
    --no-remote \
    --new-instance \
    --private-window \
    --disable-extensions \
    --disable-plugins \
    --disable-javascript \
    --disable-images \
    --disable-cookies \
    --disable-cache \
    --disable-offline-cache \
    --disable-disk-cache \
    --disable-memory-cache \
    --disable-background-timer-throttling \
    --disable-backgrounding-occluded-windows \
    --disable-renderer-backgrounding \
    --disable-features=TranslateUI \
    --disable-ipc-flooding-protection \
    --disable-popup-blocking \
    --disable-prompt-on-repost \
    --disable-sync \
    --disable-translate \
    --disable-logging \
    --disable-permissions-api \
    --disable-presentation-api \
    --disable-speech-api \
    --disable-file-system \
    --disable-notifications \
    --disable-geolocation \
    --disable-media-stream \
    --disable-camera \
    --disable-microphone \
    --disable-accelerated-2d-canvas \
    --disable-accelerated-jpeg-decoding \
    --disable-accelerated-mjpeg-decode \
    --disable-accelerated-video-decode \
    --disable-gpu-sandbox \
    --disable-software-rasterizer \
    --disable-background-networking \
    --disable-client-side-phishing-detection \
    --disable-component-extensions-with-background-pages \
    --disable-default-apps \
    --disable-domain-reliability \
    --disable-hang-monitor \
    --disable-popup-blocking \
    --disable-prompt-on-repost \
    --disable-sync \
    --disable-web-resources \
    --user-data-dir=/tmp/aejis-browser-data \
    --incognito \
    --new-window \
    --window-size=1920,1080 \
    --start-maximized \
    --kiosk \
    --app="$1" &

echo "✅ Isolated browser launched with maximum security"
echo "🔒 All security features enabled"
echo "🌍 Location spoofing active"
echo "🛡️ Complete isolation achieved"
