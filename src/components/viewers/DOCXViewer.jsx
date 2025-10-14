import React, { useState, useEffect } from 'react';
import { FaFileWord, FaExpand, FaCompress, FaEye, FaFileAlt } from 'react-icons/fa';
import './ViewerStyles.css';

const DOCXViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const [viewMode, setViewMode] = useState('document'); // 'document', 'content'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const docxData = fileContent?.docx_metadata || previewData?.docx_metadata;
  const content = fileContent?.content || previewData?.preview_content;
  const htmlContent = fileContent?.docx_html || previewData?.docx_html;

  const hasDOCXData = docxData || content || htmlContent;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatMetadataKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };


  const renderDOCXContent = () => {
    // Check if we have base64 DOCX data
    const docxBase64 = fileContent?.docx_base64 || fileContent?.base64_preview || previewData?.docx_base64 || previewData?.base64_preview;
    
    if (!docxBase64 && !hasDOCXData) {
      return (
        <div className="docx-no-content">
          <FaFileWord className="docx-icon-large" />
          <h4>DOCX Preview Not Available</h4>
          <p>This DOCX file cannot be previewed in the browser.</p>
        </div>
      );
    }

    return (
        <div className="docx-content-container">

        {/* DOCX Content Views */}
        <div className={`docx-content-body ${isFullscreen ? 'fullscreen' : ''}`}>
          {viewMode === 'document' && (
            <div className="docx-document-view">
              {htmlContent ? (
                <div className="docx-html-viewer">
                  <div className="docx-html-container">
                    <div 
                      className="docx-html-content-wrapper"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                </div>
              ) : (
                <div className="docx-fallback-view">
                  <div className="docx-viewer-container">
                    <div className="docx-preview-placeholder">
                      <FaFileWord className="docx-icon-large" />
                      <h3>DOCX Document</h3>
                      <p>This is a Microsoft Word document (.docx)</p>
                      <p className="docx-info">
                        {docxData?.paragraphs && `${docxData.paragraphs} paragraphs`}
                        {docxData?.tables && ` • ${docxData.tables} tables`}
                        {fileContent?.file_size && ` • ${formatFileSize(fileContent.file_size)}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'content' && (
            <div className="docx-content-view">
              <div className="docx-text-content">
                {content ? (
                  <div className="formatted-content">
                    <pre className="docx-text">{content}</pre>
                  </div>
                ) : (
                  <div className="no-text-content">
                    <FaFileWord className="no-content-icon" />
                    <p>No text content could be extracted from this DOCX.</p>
                    <p className="hint">This might be a protected or corrupted document.</p>
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
    <div className={`docx-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFileWord className="viewer-icon docx" />
          <span>DOCX Viewer</span>
          <span className="file-type-badge docx">DOCX</span>
        </div>
        
        <div className="viewer-controls">
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
              <FaFileAlt /> Content
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
          </div>
        </div>
      </div>
      
      <div className="viewer-content">
        {renderDOCXContent()}
      </div>
    </div>
  );
};

export default DOCXViewer;
