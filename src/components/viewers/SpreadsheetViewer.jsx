import React from 'react';
import { FaTable, FaDownload } from 'react-icons/fa';
import './ViewerStyles.css';

const SpreadsheetViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const filename = fileContent?.filename || previewData?.filename || 'Spreadsheet';
  const fileSize = fileContent?.file_size || previewData?.file_size;

  const handleDownload = () => {
    console.log('Download spreadsheet:', filename);
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
    <div className="spreadsheet-viewer">
      <div className="viewer-header">
        <div className="viewer-title">
          <FaTable className="viewer-icon spreadsheet" />
          <span>Spreadsheet Viewer</span>
          <span className="file-type-badge spreadsheet">SPREADSHEET</span>
        </div>
        
        <div className="viewer-controls">
          <div className="action-controls">
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Spreadsheet"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="spreadsheet-placeholder">
          <FaTable className="spreadsheet-icon-large" />
          <h4>Spreadsheet File</h4>
          <p>Spreadsheet preview is not yet supported. Download the file to open it.</p>
          <div className="spreadsheet-info">
            <div><strong>Filename:</strong> {filename}</div>
            {fileSize && <div><strong>Size:</strong> {formatFileSize(fileSize)}</div>}
          </div>
          <button onClick={handleDownload} className="download-btn">
            <FaDownload /> Download Spreadsheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetViewer;






