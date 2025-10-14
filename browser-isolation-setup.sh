#!/bin/bash
# Aejis Browser Isolation Setup Script
# Configures complete browser isolation with security hardening

echo "🔒 Setting up browser isolation environment..."

# Wait for X server
while ! xdpyinfo -display :1 >/dev/null 2>&1; do
    echo "⏳ Waiting for X server..."
    sleep 1
done

echo "✅ X server ready, configuring browser isolation..."

# Configure Firefox for maximum security
mkdir -p ~/.mozilla/firefox/isolated.profile
cat > ~/.mozilla/firefox/isolated.profile/prefs.js << 'EOF'
// Aejis Browser Isolation - Maximum Security Configuration
user_pref("browser.startup.homepage", "about:blank");
user_pref("browser.startup.page", 0);
user_pref("browser.shell.checkDefaultBrowser", false);
user_pref("browser.dom.window.dump.enabled", false);
user_pref("javascript.enabled", false);
user_pref("dom.disable_beforeunload", true);
user_pref("dom.disable_window_open_feature.close", true);
user_pref("dom.disable_window_open_feature.location", true);
user_pref("dom.disable_window_open_feature.menubar", true);
user_pref("dom.disable_window_open_feature.resizable", true);
user_pref("dom.disable_window_open_feature.scrollbars", true);
user_pref("dom.disable_window_open_feature.status", true);
user_pref("dom.disable_window_open_feature.toolbar", true);
user_pref("dom.disable_window_open_feature.personalbar", true);
user_pref("privacy.trackingprotection.enabled", true);
user_pref("privacy.trackingprotection.pbmode.enabled", true);
user_pref("network.cookie.cookieBehavior", 2);
user_pref("network.cookie.lifetimePolicy", 2);
user_pref("browser.cache.disk.enable", false);
user_pref("browser.cache.memory.enable", false);
user_pref("browser.cache.offline.enable", false);
user_pref("media.peerconnection.enabled", false);
user_pref("media.navigator.enabled", false);
user_pref("geo.enabled", false);
user_pref("dom.webnotifications.enabled", false);
user_pref("dom.push.enabled", false);
user_pref("dom.serviceWorkers.enabled", false);
user_pref("browser.privatebrowsing.autostart", true);
EOF

# Configure Chromium for maximum security
mkdir -p ~/.config/chromium/Default
cat > ~/.config/chromium/Default/Preferences << 'EOF'
{
   "browser": {
      "check_default_browser": false
   },
   "profile": {
      "default_content_settings": {
         "cookies": 2,
         "images": 1,
         "javascript": 2,
         "plugins": 2,
         "popups": 2,
         "geolocation": 2,
         "notifications": 2,
         "media_stream": 2
      },
      "content_settings": [],
      "managed_default_content_settings": {
         "cookies": 2,
         "images": 1,
         "javascript": 2,
         "plugins": 2,
         "popups": 2,
         "geolocation": 2,
         "notifications": 2,
         "media_stream": 2
      }
   }
}
EOF

# Set up random location spoofing
echo "🌍 Setting up location spoofing..."
sudo ~/browser-isolation/location-spoofer.sh

# Configure network isolation
echo "🔒 Configuring network isolation..."
sudo iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT
sudo iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
sudo iptables -A OUTPUT -j DROP

echo "✅ Browser isolation setup complete!"
echo "🛡️ Maximum security configuration active"
echo "🌍 Random location spoofing enabled"
echo "🔒 Network isolation configured"
