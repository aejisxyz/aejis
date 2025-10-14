import React from 'react';
import { FaMusic, FaDownload } from 'react-icons/fa';
import './ViewerStyles.css';

const AudioViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const filename = fileContent?.filename || previewData?.filename || 'Audio File';
  const fileSize = fileContent?.file_size || previewData?.file_size;

  const handleDownload = () => {
    console.log('Download audio:', filename);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="audio-viewer">
      <div className="viewer-header">
        <div className="viewer-title">
          <FaMusic className="viewer-icon audio" />
          <span>Audio Viewer</span>
          <span className="file-type-badge audio">AUDIO</span>
        </div>
        
        <div className="viewer-controls">
          <div className="action-controls">
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Audio"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="audio-placeholder">
          <FaMusic className="audio-icon-large" />
          <h4>Audio File</h4>
          <p>Audio preview is not yet supported. Download the file to play it.</p>
          <div className="audio-info">
            <div><strong>Filename:</strong> {filename}</div>
            {fileSize && <div><strong>Size:</strong> {formatFileSize(fileSize)}</div>}
          </div>
          <button onClick={handleDownload} className="download-btn">
            <FaDownload /> Download Audio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioViewer;






