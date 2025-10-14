#!/bin/bash
# Media Player Test Script for Aejis Browser Isolation
# Tests VLC and MPV with various video formats

echo "🎬 Aejis Media Player Test Suite"
echo "================================"

# Test if VLC is installed
if command -v vlc &> /dev/null; then
    echo "✅ VLC Media Player: Installed"
    VLC_VERSION=$(vlc --version 2>/dev/null | head -n1)
    echo "   Version: $VLC_VERSION"
else
    echo "❌ VLC Media Player: Not found"
fi

# Test if MPV is installed
if command -v mpv &> /dev/null; then
    echo "✅ MPV Media Player: Installed"
    MPV_VERSION=$(mpv --version 2>/dev/null | head -n1)
    echo "   Version: $MPV_VERSION"
else
    echo "❌ MPV Media Player: Not found"
fi

# Test FFmpeg support
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg: Installed"
    FFMPEG_VERSION=$(ffmpeg -version 2>/dev/null | head -n1)
    echo "   Version: $FFMPEG_VERSION"
else
    echo "❌ FFmpeg: Not found"
fi

echo ""
echo "📂 Supported Formats:"
echo "   • MP4 (H.264/H.265)"
echo "   • AVI (Various codecs)"
echo "   • MOV (QuickTime)"
echo "   • MKV (Matroska)"
echo "   • WMV, FLV, WebM"
echo "   • Audio: MP3, WAV, OGG, FLAC"

echo ""
echo "🎯 Usage Instructions:"
echo "1. Upload video files through Aejis web interface"
echo "2. Files will be analyzed and saved securely"
echo "3. Access isolated browser at: http://localhost:6080"
echo "4. Open file manager (Thunar) in the desktop"
echo "5. Double-click video files to open with VLC/MPV"
echo ""
echo "🖱️  Manual Commands:"
echo "   vlc /path/to/video.mp4    # Open with VLC"
echo "   mpv /path/to/video.mp4    # Open with MPV"
echo ""
echo "🔧 Configuration Files:"
echo "   VLC: ~/.config/vlc/vlcrc"
echo "   MPV: ~/.config/mpv/mpv.conf"
