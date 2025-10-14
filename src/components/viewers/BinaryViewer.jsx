import React from 'react';
import { FaFile, FaDownload } from 'react-icons/fa';
import './ViewerStyles.css';

const BinaryViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const content = fileContent?.content || previewData?.content || '';
  const filename = fileContent?.filename || previewData?.filename || 'Binary File';
  const fileSize = fileContent?.file_size || previewData?.file_size;

  const handleDownload = () => {
    console.log('Download binary:', filename);
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
    <div className="binary-viewer">
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFile className="viewer-icon binary" />
          <span>Binary Viewer</span>
          <span className="file-type-badge binary">BINARY</span>
        </div>
        
        <div className="viewer-controls">
          <div className="action-controls">
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download File"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        {content ? (
          <div className="binary-content-view">
            <div className="content-header">
              <h4>🔧 Binary File Preview</h4>
              <p className="content-description">
                Hexadecimal representation of the binary data
              </p>
            </div>
            <div className="binary-hex-display">
              <pre className="hex-content">{content}</pre>
            </div>
          </div>
        ) : (
          <div className="binary-placeholder">
            <FaFile className="binary-icon-large" />
            <h4>Binary File</h4>
            <p>This is a binary file that cannot be displayed as text.</p>
            <div className="binary-info">
              <div><strong>Filename:</strong> {filename}</div>
              {fileSize && <div><strong>Size:</strong> {formatFileSize(fileSize)}</div>}
            </div>
            <button onClick={handleDownload} className="download-btn">
              <FaDownload /> Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryViewer;






