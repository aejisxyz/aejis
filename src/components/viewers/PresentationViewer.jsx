import React from 'react';
import { FaPlay, FaDownload } from 'react-icons/fa';
import './ViewerStyles.css';

const PresentationViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const filename = fileContent?.filename || previewData?.filename || 'Presentation';
  const fileSize = fileContent?.file_size || previewData?.file_size;

  const handleDownload = () => {
    console.log('Download presentation:', filename);
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
    <div className="presentation-viewer">
      <div className="viewer-header">
        <div className="viewer-title">
          <FaPlay className="viewer-icon presentation" />
          <span>Presentation Viewer</span>
          <span className="file-type-badge presentation">PRESENTATION</span>
        </div>
        
        <div className="viewer-controls">
          <div className="action-controls">
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Presentation"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="presentation-placeholder">
          <FaPlay className="presentation-icon-large" />
          <h4>Presentation File</h4>
          <p>Presentation preview is not yet supported. Download the file to open it.</p>
          <div className="presentation-info">
            <div><strong>Filename:</strong> {filename}</div>
            {fileSize && <div><strong>Size:</strong> {formatFileSize(fileSize)}</div>}
          </div>
          <button onClick={handleDownload} className="download-btn">
            <FaDownload /> Download Presentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationViewer;






