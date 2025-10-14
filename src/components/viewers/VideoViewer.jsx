import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaDownload, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';
import API_URL from '../../config/api';
import './ViewerStyles.css';

const VideoViewer = ({ fileContent, previewData, onClose, detectedType, analysisId }) => {
  console.log('🎥 VideoViewer - Props received:', { fileContent, previewData, detectedType, analysisId });
  
  const filename = fileContent?.filename || previewData?.filename || 'Video File';
  const fileSize = fileContent?.file_size || previewData?.file_size;
  const metadata = previewData?.metadata || {};
  
  console.log('🎥 VideoViewer - Extracted data:', { filename, fileSize, metadata });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Generate video URL for streaming
  const getVideoUrl = () => {
    if (analysisId) {
      const url = `${API_URL}/stream-video/${analysisId}`;
      console.log('🎥 VideoViewer - Generated video URL:', url);
      return url;
    }
    console.log('🎥 VideoViewer - No analysisId provided');
    return null;
  };

  const handleDownload = () => {
    if (analysisId) {
      const downloadUrl = `${API_URL}/download/${analysisId}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMimeType = () => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'mkv': 'video/x-matroska',
      'webm': 'video/webm',
      'ogg': 'video/ogg'
    };
    return mimeTypes[ext] || 'video/mp4';
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const videoUrl = getVideoUrl();
  console.log('🎥 VideoViewer - videoUrl:', videoUrl);

  return (
    <div className="video-viewer" ref={containerRef}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaPlay className="viewer-icon video" />
          <span>Video Viewer</span>
          <span className="file-type-badge video">VIDEO</span>
        </div>
        
        <div className="viewer-controls">
          <div className="action-controls">
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Video"
            >
              <FaDownload />
            </button>
            <button 
              onClick={toggleFullscreen} 
              className="control-btn fullscreen"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        {videoUrl ? (
          <div className="video-container">
            {isLoading && (
              <div className="video-loading">
                <div className="loading-spinner"></div>
                <p>Loading video...</p>
              </div>
            )}
            
            <video
              ref={videoRef}
              className="video-player"
              controls={false}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={(e) => {
                console.error('🎥 VideoViewer - Video error:', e);
                setError('Failed to load video. This format may not be supported in the browser.');
                setIsLoading(false);
              }}
              onLoadStart={() => {
                console.log('🎥 VideoViewer - Video load started');
                setIsLoading(true);
              }}
              onCanPlay={() => {
                console.log('🎥 VideoViewer - Video can play');
                setIsLoading(false);
              }}
              preload="metadata"
            >
              <source src={videoUrl} type={getMimeType()} />
              Your browser does not support the video tag.
            </video>

            {error && (
              <div className="video-error">
                <p>{error}</p>
                <button onClick={handleDownload} className="download-btn">
                  <FaDownload /> Download Video
                </button>
              </div>
            )}

            <div className="video-controls">
              <button 
                className="play-pause-btn"
                onClick={togglePlayPause}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="progress-bar" onClick={handleSeek}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>

              <button 
                className="volume-btn"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

          </div>
        ) : (
          <div className="video-placeholder">
            <FaPlay className="video-icon-large" />
            <h4>Video File</h4>
            <p>Video streaming not available. Download the file to view it.</p>
            <button onClick={handleDownload} className="download-btn">
              <FaDownload /> Download Video
            </button>
          </div>
        )}

        {/* Video Info Below Player */}
        <div className="video-info-below">
          <div className="video-metadata">
            <div><strong>Filename:</strong> {filename}</div>
            {fileSize && <div><strong>Size:</strong> {formatFileSize(fileSize)}</div>}
            {metadata.dimensions && <div><strong>Resolution:</strong> {metadata.dimensions}</div>}
            {metadata.duration && <div><strong>Duration:</strong> {formatTime(metadata.duration)}</div>}
            {metadata.fps && <div><strong>FPS:</strong> {metadata.fps.toFixed(2)}</div>}
            {metadata.codec && <div><strong>Codec:</strong> {metadata.codec}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;






