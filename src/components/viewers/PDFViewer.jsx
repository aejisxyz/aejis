import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaExpand, FaCompress, FaEye, FaFileAlt, FaInfoCircle } from 'react-icons/fa';
import './ViewerStyles.css';

const PDFViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const [viewMode, setViewMode] = useState('document'); // 'document', 'content', 'metadata'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pdfData = fileContent?.pdf_metadata || previewData?.pdf_metadata;
  const content = fileContent?.content || previewData?.preview_content;

  // Check if we have PDF-specific data
  const hasPDFData = pdfData || content;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    // Implementation for downloading the PDF file
    console.log('Download PDF:', fileContent?.filename);
  };

  const renderPDFContent = () => {
    // Check if we have base64 PDF data
    const pdfBase64 = fileContent?.pdf_base64 || fileContent?.base64_preview || previewData?.pdf_base64 || previewData?.base64_preview;
    
    if (!pdfBase64 && !hasPDFData) {
      return (
        <div className="pdf-no-content">
          <FaFilePdf className="pdf-icon-large" />
          <h4>PDF Preview Not Available</h4>
          <p>This PDF file cannot be previewed in the browser.</p>
          <button onClick={handleDownload} className="download-btn">
            <FaDownload /> Download to View
          </button>
        </div>
      );
    }

    return (
      <div className="pdf-content-container">
        {/* PDF Viewer Header */}
        <div className="pdf-viewer-header">
          <div className="pdf-info">
            <FaFilePdf className="pdf-icon" />
            <div className="pdf-details">
              <h3>{fileContent?.filename || 'PDF Document'}</h3>
              <div className="pdf-meta">
                {pdfData?.page_count && (
                  <span className="meta-item">
                    📄 {pdfData.page_count} pages
                  </span>
                )}
                {fileContent?.file_size && (
                  <span className="meta-item">
                    📏 {formatFileSize(fileContent.file_size)}
                  </span>
                )}
                {pdfData?.metadata?.title && (
                  <span className="meta-item">
                    📝 {pdfData.metadata.title}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="pdf-controls">
            <div className="view-mode-tabs">
              <button
                className={`tab-btn ${viewMode === 'document' ? 'active' : ''}`}
                onClick={() => setViewMode('document')}
              >
                <FaEye /> Document
              </button>
              <button
                className={`tab-btn ${viewMode === 'content' ? 'active' : ''}`}
                onClick={() => setViewMode('content')}
              >
                <FaFileAlt /> Text
              </button>
              <button
                className={`tab-btn ${viewMode === 'metadata' ? 'active' : ''}`}
                onClick={() => setViewMode('metadata')}
              >
                <FaInfoCircle /> Metadata
              </button>
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={toggleFullscreen} 
                className="control-btn"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button 
                onClick={handleDownload} 
                className="control-btn download"
                title="Download PDF"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Content Views */}
        <div className={`pdf-content-body ${isFullscreen ? 'fullscreen' : ''}`}>
          {viewMode === 'document' && pdfBase64 && (
            <div className="pdf-document-view">
              <div className="content-header">
                <h4>📄 PDF Document</h4>
                <p className="content-description">
                  Original PDF document rendered in browser
                </p>
              </div>
              <div className="pdf-viewer-container">
                <object
                  data={`data:application/pdf;base64,${pdfBase64}`}
                  type="application/pdf"
                  className="pdf-object-viewer"
                  width="100%"
                  height="600px"
                >
                  <iframe
                    src={`data:application/pdf;base64,${pdfBase64}`}
                    className="pdf-iframe-viewer"
                    width="100%"
                    height="600px"
                    title="PDF Viewer"
                  >
                    <div className="pdf-fallback">
                      <p>Your browser doesn't support PDF viewing.</p>
                      <button onClick={handleDownload} className="download-btn">
                        <FaDownload /> Download PDF
                      </button>
                    </div>
                  </iframe>
                </object>
              </div>
            </div>
          )}

          {viewMode === 'content' && (
            <div className="pdf-content-view">
              <div className="content-header">
                <h4>📖 Extracted Text Content</h4>
                <p className="content-description">
                  Text and data extracted from the PDF document
                </p>
              </div>
              <div className="pdf-text-content">
                {content ? (
                  <div className="formatted-content">
                    <pre className="pdf-text">{content}</pre>
                  </div>
                ) : (
                  <div className="no-text-content">
                    <FaFilePdf className="no-content-icon" />
                    <p>No text content could be extracted from this PDF.</p>
                    <p className="hint">This might be a scanned document or contain only images.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'metadata' && (
            <div className="pdf-metadata-view">
              <div className="content-header">
                <h4>📋 Document Metadata</h4>
                <p className="content-description">
                  Technical information about the PDF document
                </p>
              </div>
              <div className="metadata-grid">
                {/* Basic Info */}
                <div className="metadata-section">
                  <h5>📄 Document Information</h5>
                  <div className="metadata-items">
                    {pdfData?.page_count && (
                      <div className="metadata-item">
                        <span className="metadata-label">Pages:</span>
                        <span className="metadata-value">{pdfData.page_count}</span>
                      </div>
                    )}
                    {fileContent?.file_size && (
                      <div className="metadata-item">
                        <span className="metadata-label">File Size:</span>
                        <span className="metadata-value">{formatFileSize(fileContent.file_size)}</span>
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

                {/* PDF Metadata */}
                {pdfData?.metadata && (
                  <div className="metadata-section">
                    <h5>📝 PDF Properties</h5>
                    <div className="metadata-items">
                      {Object.entries(pdfData.metadata).map(([key, value]) => (
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

                {/* Security Info */}
                {pdfData?.security && (
                  <div className="metadata-section">
                    <h5>🔒 Security Information</h5>
                    <div className="metadata-items">
                      {Object.entries(pdfData.security).map(([key, value]) => (
                        <div key={key} className="metadata-item">
                          <span className="metadata-label">{formatMetadataKey(key)}:</span>
                          <span className="metadata-value">{value ? 'Yes' : 'No'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`pdf-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFilePdf className="viewer-icon pdf" />
          <span>PDF Viewer</span>
          <span className="file-type-badge pdf">PDF</span>
        </div>
      </div>
      
      <div className="viewer-content">
        {renderPDFContent()}
      </div>
    </div>
  );
};

// Helper functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatMetadataKey = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default PDFViewer;
