import React, { useState } from 'react';
import { FaFileImage, FaSearchPlus, FaSearchMinus, FaExpandArrowsAlt, FaDownload, FaInfoCircle } from 'react-icons/fa';
import './ViewerStyles.css';

const ImageViewer = ({ 
  fileContent, 
  previewData, 
  onClose, 
  detectedType,
  imageZoom,
  setImageZoom,
  imagePosition,
  setImagePosition,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  resetImageZoom,
  handleImageWheel,
  handleImageMouseDown,
  handleImageMouseMove,
  handleImageMouseUp
}) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get image data from either fileContent or previewData
  const imageSource = fileContent?.image_base64 || 
                     (previewData?.base64_preview ? `data:${previewData.mime_type || 'image/jpeg'};base64,${previewData.base64_preview}` : null) ||
                     fileContent?.content;

  const filename = fileContent?.filename || previewData?.filename || 'Image';
  const fileSize = fileContent?.file_size || previewData?.file_size;
  const imageMetadata = fileContent?.image_metadata || previewData?.metadata;

  const handleZoomIn = () => {
    const newZoom = Math.min(5, imageZoom + 0.25);
    setImageZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, imageZoom - 0.25);
    setImageZoom(newZoom);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      resetImageZoom();
    }
  };

  const handleDownload = () => {
    if (imageSource) {
      const link = document.createElement('a');
      link.href = imageSource;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!imageSource) {
    return (
      <div className="image-viewer no-image">
        <div className="viewer-header">
          <div className="viewer-title">
            <FaFileImage className="viewer-icon image" />
            <span>Image Viewer</span>
            <span className="file-type-badge image">IMAGE</span>
          </div>
        </div>
        
        <div className="viewer-content">
          <div className="no-image-content">
            <FaFileImage className="no-image-icon" />
            <h4>Image Not Available</h4>
            <p>The image could not be loaded or displayed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFileImage className="viewer-icon image" />
          <span>Image Viewer</span>
          <span className="file-type-badge image">IMAGE</span>
        </div>
        
        <div className="viewer-controls">
          <div className="zoom-controls">
            <button 
              onClick={handleZoomOut} 
              className="control-btn"
              title="Zoom Out"
            >
              <FaSearchMinus />
            </button>
            <span className="zoom-level">
              {Math.round(imageZoom * 100)}%
            </span>
            <button 
              onClick={handleZoomIn} 
              className="control-btn"
              title="Zoom In"
            >
              <FaSearchPlus />
            </button>
            <button 
              onClick={resetImageZoom} 
              className="control-btn reset"
              title="Reset Zoom"
            >
              1:1
            </button>
          </div>
          
          <div className="action-controls">
            <button 
              onClick={() => setShowMetadata(!showMetadata)} 
              className={`control-btn ${showMetadata ? 'active' : ''}`}
              title="Show Metadata"
            >
              <FaInfoCircle />
            </button>
            <button 
              onClick={toggleFullscreen} 
              className="control-btn"
              title="Fullscreen"
            >
              <FaExpandArrowsAlt />
            </button>
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Image"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="image-content-container">
          {/* Image Display */}
          <div className="image-display-area">
            <div 
              className="image-zoom-container"
              onWheel={handleImageWheel}
              onMouseDown={handleImageMouseDown}
              onMouseMove={handleImageMouseMove}
              onMouseUp={handleImageMouseUp}
              onMouseLeave={handleImageMouseUp}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <img 
                src={imageSource} 
                alt={filename}
                className="preview-image-full"
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease'
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Image Metadata Panel */}
          {showMetadata && (
            <div className="image-metadata-panel">
              <div className="metadata-header">
                <h4>📷 Image Information</h4>
                <button 
                  onClick={() => setShowMetadata(false)}
                  className="close-metadata-btn"
                >
                  ×
                </button>
              </div>
              
              <div className="metadata-content">
                {/* Basic Info */}
                <div className="metadata-section">
                  <h5>File Details</h5>
                  <div className="metadata-items">
                    <div className="metadata-item">
                      <span className="metadata-label">Filename:</span>
                      <span className="metadata-value">{filename}</span>
                    </div>
                    {fileSize && (
                      <div className="metadata-item">
                        <span className="metadata-label">File Size:</span>
                        <span className="metadata-value">{formatFileSize(fileSize)}</span>
                      </div>
                    )}
                    {fileContent?.file_type && (
                      <div className="metadata-item">
                        <span className="metadata-label">File Type:</span>
                        <span className="metadata-value">{fileContent.file_type}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Properties */}
                {imageMetadata && (
                  <div className="metadata-section">
                    <h5>Image Properties</h5>
                    <div className="metadata-items">
                      {Object.entries(imageMetadata).map(([key, value]) => (
                        value && (
                          <div key={key} className="metadata-item">
                            <span className="metadata-label">{formatMetadataKey(key)}:</span>
                            <span className="metadata-value">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* View Information */}
                <div className="metadata-section">
                  <h5>View Information</h5>
                  <div className="metadata-items">
                    <div className="metadata-item">
                      <span className="metadata-label">Current Zoom:</span>
                      <span className="metadata-value">{Math.round(imageZoom * 100)}%</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Position:</span>
                      <span className="metadata-value">
                        X: {Math.round(imagePosition.x)}, Y: {Math.round(imagePosition.y)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Footer Info */}
        <div className="image-footer">
          <div className="image-info">
            <span className="filename">{filename}</span>
            {fileSize && <span className="file-size">{formatFileSize(fileSize)}</span>}
          </div>
          
          <div className="zoom-info">
            <span>Use mouse wheel to zoom • Drag to pan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format metadata keys
const formatMetadataKey = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default ImageViewer;

