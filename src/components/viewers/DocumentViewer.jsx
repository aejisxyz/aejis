import React, { useState } from 'react';
import { FaFileAlt, FaDownload, FaExpand, FaInfoCircle } from 'react-icons/fa';
import './ViewerStyles.css';

const DocumentViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const [viewMode, setViewMode] = useState('content'); // 'content', 'metadata'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const content = fileContent?.content || previewData?.content || '';
  const filename = fileContent?.filename || previewData?.filename || 'Document';
  const fileSize = fileContent?.file_size || previewData?.file_size;
  const documentMetadata = fileContent?.document_metadata || previewData?.document_metadata;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    console.log('Download document:', filename);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDocumentContent = () => {
    if (!content) {
      return (
        <div className="no-document-content">
          <FaFileAlt className="no-content-icon" />
          <h4>No Document Content</h4>
          <p>The document content could not be extracted or displayed.</p>
          <button onClick={handleDownload} className="download-btn">
            <FaDownload /> Download to View
          </button>
        </div>
      );
    }

    return (
      <div className="document-content-container">
        {viewMode === 'content' && (
          <div className="document-content-view">
            <div className="content-header">
              <h4>📄 Document Content</h4>
              <p className="content-description">
                Extracted text content from the document
              </p>
            </div>
            <div className="document-text-content">
              <div className="formatted-content">
                <div className="document-text">{content}</div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'metadata' && (
          <div className="document-metadata-view">
            <div className="content-header">
              <h4>📋 Document Metadata</h4>
              <p className="content-description">
                Technical information about the document
              </p>
            </div>
            <div className="metadata-grid">
              {/* Basic Info */}
              <div className="metadata-section">
                <h5>📄 Document Information</h5>
                <div className="metadata-items">
                  {filename && (
                    <div className="metadata-item">
                      <span className="metadata-label">Filename:</span>
                      <span className="metadata-value">{filename}</span>
                    </div>
                  )}
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

              {/* Document Metadata */}
              {documentMetadata && (
                <div className="metadata-section">
                  <h5>📝 Document Properties</h5>
                  <div className="metadata-items">
                    {Object.entries(documentMetadata).map(([key, value]) => (
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

              {/* Content Statistics */}
              {content && (
                <div className="metadata-section">
                  <h5>📊 Content Statistics</h5>
                  <div className="metadata-items">
                    <div className="metadata-item">
                      <span className="metadata-label">Character Count:</span>
                      <span className="metadata-value">{content.length.toLocaleString()}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Word Count:</span>
                      <span className="metadata-value">{content.split(/\s+/).filter(word => word.length > 0).length.toLocaleString()}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Paragraph Count:</span>
                      <span className="metadata-value">{content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`document-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFileAlt className="viewer-icon document" />
          <span>Document Viewer</span>
          <span className="file-type-badge document">DOCUMENT</span>
        </div>
        
        <div className="viewer-controls">
          <div className="view-mode-tabs">
            <button
              className={`tab-btn ${viewMode === 'content' ? 'active' : ''}`}
              onClick={() => setViewMode('content')}
            >
              📄 Content
            </button>
            <button
              className={`tab-btn ${viewMode === 'metadata' ? 'active' : ''}`}
              onClick={() => setViewMode('metadata')}
            >
              <FaInfoCircle /> Metadata
            </button>
          </div>
          
          <div className="action-controls">
            <button 
              onClick={toggleFullscreen} 
              className="control-btn"
              title="Fullscreen"
            >
              <FaExpand />
            </button>
            <button 
              onClick={handleDownload} 
              className="control-btn download"
              title="Download Document"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="document-info-bar">
          <div className="document-stats">
            <span className="stat-item">
              📄 {filename}
            </span>
            {fileSize && (
              <span className="stat-item">
                📏 {formatFileSize(fileSize)}
              </span>
            )}
            {content && (
              <span className="stat-item">
                🔤 {content.length.toLocaleString()} characters
              </span>
            )}
          </div>
        </div>

        <div className="document-content-container">
          {renderDocumentContent()}
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

export default DocumentViewer;


