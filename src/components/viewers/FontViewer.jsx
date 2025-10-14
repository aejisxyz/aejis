import React from 'react';
import { FaFont, FaDownload } from 'react-icons/fa';
import './ViewerStyles.css';

const FontViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const filename = fileContent?.filename || previewData?.filename || 'Font File';
  const fileSize = fileContent?.file_size || previewData?.file_size;

  const handleDownload = () => {
    console.log('Download font:', filename);
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
    <div className="font-viewer">
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFont className="viewer-icon font" />
          <span>Font Viewer</span>
          <span className="file-type-badge font">FONT</span>
        </div>
        
        <div className="viewer-controls">
          <div className="action-controls">
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Font"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="font-placeholder">
          <FaFont className="font-icon-large" />
          <h4>Font File</h4>
          <p>Font preview is not yet supported. Download the file to install and use it.</p>
          <div className="font-info">
            <div><strong>Filename:</strong> {filename}</div>
            {fileSize && <div><strong>Size:</strong> {formatFileSize(fileSize)}</div>}
          </div>
          <button onClick={handleDownload} className="download-btn">
            <FaDownload /> Download Font
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontViewer;






