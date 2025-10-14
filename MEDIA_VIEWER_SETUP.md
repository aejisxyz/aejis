# Aejis Media Viewer Setup

## Overview
Your Aejis browser isolation container now includes comprehensive media viewing capabilities with VLC and MPV players.

## Supported Formats
✅ **Video Formats:**
- `.mp4` (H.264, H.265)
- `.avi` (Various codecs)
- `.mov` (QuickTime)
- `.mkv` (Matroska)
- `.wmv`, `.flv`, `.webm`

✅ **Audio Formats:**
- `.mp3`, `.wav`, `.ogg`, `.flac`

## Media Players Installed

### 1. VLC Media Player
- **Full-featured** media player
- **Universal codec support**
- **Advanced streaming capabilities**
- **Configured for optimal performance**

### 2. MPV Media Player
- **Lightweight** and fast
- **GPU acceleration** enabled
- **High-quality video scaling**
- **Minimal resource usage**

## Additional Components
- **FFmpeg** - Complete codec library
- **GStreamer** - Multimedia framework
- **PulseAudio** - Audio system
- **Thunar** - File manager with media previews

## How to Use

### Via Web Interface (VNC)
1. Access: `http://localhost:6080/vnc.html`
2. Open file manager (Thunar)
3. Navigate to uploaded files
4. Double-click any video file
5. Choose VLC or MPV to open

### Via Command Line
```bash
# Open with VLC
vlc /path/to/video.mp4

# Open with MPV
mpv /path/to/video.mp4
```

## File Associations
All media files are automatically associated with VLC by default:
- Video files open with VLC
- Audio files open with VLC
- Alternative: Right-click → "Open with MPV"

## Configuration

### VLC Settings
- **Location:** `~/.config/vlc/vlcrc`
- **Privacy dialogs:** Disabled
- **Auto-resize:** Enabled
- **Fullscreen controls:** Optimized

### MPV Settings
- **Location:** `~/.config/mpv/mpv.conf`
- **GPU acceleration:** Enabled
- **High-quality scaling:** Active
- **Hardware decoding:** Auto-detected

## Rebuilding Container

To apply these changes:

```bash
# Stop existing container
docker-compose down

# Rebuild with media support
docker-compose build aejis-browser

# Start with new capabilities
docker-compose up -d
```

## Testing

Run the media test script in the container:
```bash
./media-test.sh
```

## Security Features
- **Isolated environment** - All media playback in sandboxed container
- **No host system access** - Files processed securely
- **Network isolation** - Media players run in controlled environment
- **Memory limits** - Prevents resource exhaustion

## Performance Optimization
- **GPU acceleration** enabled where available
- **Efficient codecs** prioritized
- **Memory caching** optimized
- **CPU usage** minimized

Your Aejis system now provides enterprise-grade media viewing capabilities while maintaining maximum security through containerization.
