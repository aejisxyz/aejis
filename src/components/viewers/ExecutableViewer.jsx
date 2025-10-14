import React from 'react';
import { FaCog, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import './ViewerStyles.css';

const ExecutableViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const filename = fileContent?.filename || previewData?.filename || 'Executable File';
  const fileSize = fileContent?.file_size || previewData?.file_size;

  const handleDownload = () => {
    console.log('Download executable:', filename);
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
    <div className="executable-viewer">
      <div className="viewer-header">
        <div className="viewer-title">
          <FaCog className="viewer-icon executable" />
          <span>Executable Viewer</span>
          <span className="file-type-badge executable">EXECUTABLE</span>
        </div>
        
        <div className="viewer-controls">
          <div className="action-controls">
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Executable"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="executable-placeholder">
          <div className="warning-section">
            <FaExclamationTriangle className="warning-icon" />
            <h4>⚠️ Executable File</h4>
            <div className="warning-message">
              <p><strong>Security Warning:</strong> This is an executable file that can run code on your system.</p>
              <p>Only download and run files from trusted sources.</p>
            </div>
          </div>
          
          <div className="executable-info">
            <div><strong>Filename:</strong> {filename}</div>
            {fileSize && <div><strong>Size:</strong> {formatFileSize(fileSize)}</div>}
            <div><strong>Type:</strong> Executable Program</div>
          </div>
          
          <div className="executable-actions">
            <button onClick={handleDownload} className="download-btn warning">
              <FaDownload /> Download (Use Caution)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutableViewer;






