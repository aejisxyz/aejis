#!/bin/bash
# Aejis Location Spoofer - Random Location Spoofing for Browser Isolation
# Changes browser location to random places for enhanced privacy

echo "🌍 Setting up random location spoofing..."

# List of random locations (lat, lon, country, city)
LOCATIONS=(
    "40.7128,-74.0060,US,New York"
    "51.5074,-0.1278,GB,London"
    "48.8566,2.3522,FR,Paris"
    "35.6762,139.6503,JP,Tokyo"
    "52.5200,13.4050,DE,Berlin"
    "41.9028,12.4964,IT,Rome"
    "55.7558,37.6176,RU,Moscow"
    "39.9042,116.4074,CN,Beijing"
    "37.5665,126.9780,KR,Seoul"
    "19.4326,-99.1332,MX,Mexico City"
    "23.1291,113.2644,CN,Guangzhou"
    "28.6139,77.2090,IN,New Delhi"
    "33.8688,151.2093,AU,Sydney"
    "43.6532,-79.3832,CA,Toronto"
    "25.2048,55.2708,AE,Dubai"
    "1.3521,103.8198,SG,Singapore"
    "22.3193,114.1694,HK,Hong Kong"
    "59.9311,10.7579,NO,Oslo"
    "59.3293,18.0686,SE,Stockholm"
    "55.6761,12.5683,DK,Copenhagen"
)

# Select random location
RANDOM_INDEX=$((RANDOM % ${#LOCATIONS[@]}))
SELECTED_LOCATION=${LOCATIONS[$RANDOM_INDEX]}

# Parse location data
IFS=',' read -r LAT LON COUNTRY CITY <<< "$SELECTED_LOCATION"

echo "🎯 Selected random location: $CITY, $COUNTRY ($LAT, $LON)"

# Configure system timezone (simplified)
case $COUNTRY in
    "US") TZ="America/New_York" ;;
    "GB") TZ="Europe/London" ;;
    "FR") TZ="Europe/Paris" ;;
    "JP") TZ="Asia/Tokyo" ;;
    "DE") TZ="Europe/Berlin" ;;
    "IT") TZ="Europe/Rome" ;;
    "RU") TZ="Europe/Moscow" ;;
    "CN") TZ="Asia/Shanghai" ;;
    "KR") TZ="Asia/Seoul" ;;
    "MX") TZ="America/Mexico_City" ;;
    "IN") TZ="Asia/Kolkata" ;;
    "AU") TZ="Australia/Sydney" ;;
    "CA") TZ="America/Toronto" ;;
    "AE") TZ="Asia/Dubai" ;;
    "SG") TZ="Asia/Singapore" ;;
    "HK") TZ="Asia/Hong_Kong" ;;
    "NO") TZ="Europe/Oslo" ;;
    "SE") TZ="Europe/Stockholm" ;;
    "DK") TZ="Europe/Copenhagen" ;;
    *) TZ="UTC" ;;
esac

export TZ
echo "🕐 Timezone set to: $TZ"

# Create location spoofing environment variables
export AEJIS_FAKE_LAT=$LAT
export AEJIS_FAKE_LON=$LON
export AEJIS_FAKE_COUNTRY=$COUNTRY
export AEJIS_FAKE_CITY=$CITY

# Create location spoofing script for browsers
cat > /tmp/location-spoof.js << EOF
// Aejis Location Spoofing Script
// Overrides geolocation API with random location

(function() {
    'use strict';
    
    const fakeLocation = {
        latitude: $LAT,
        longitude: $LON,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
    };
    
    // Override geolocation API
    if (navigator.geolocation) {
        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
        const originalWatchPosition = navigator.geolocation.watchPosition;
        
        navigator.geolocation.getCurrentPosition = function(success, error, options) {
            if (success) {
                success(fakeLocation);
            }
        };
        
        navigator.geolocation.watchPosition = function(success, error, options) {
            if (success) {
                success(fakeLocation);
            }
            return 1; // Return a watch ID
        };
    }
    
    // Override timezone
    const originalDate = Date;
    Date = function(...args) {
        const date = new originalDate(...args);
        // Timezone is already set by system
        return date;
    };
    
    console.log('🌍 Aejis Location Spoofing Active: $CITY, $COUNTRY');
})();
EOF

echo "✅ Location spoofing configured"
echo "📍 Fake location: $CITY, $COUNTRY"
echo "🌍 Coordinates: $LAT, $LON"
echo "🕐 Timezone: $TZ"
