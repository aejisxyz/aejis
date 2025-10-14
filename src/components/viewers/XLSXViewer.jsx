import React, { useState } from 'react';
import { FaFileExcel, FaDownload, FaExpand, FaCompress, FaEye, FaFileAlt, FaInfoCircle, FaTable } from 'react-icons/fa';
import './ViewerStyles.css';

const XLSXViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const [viewMode, setViewMode] = useState('document'); // 'document', 'content', 'metadata'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const xlsxData = fileContent?.xlsx_metadata || previewData?.xlsx_metadata;
  const content = fileContent?.content || previewData?.preview_content;
  const htmlContent = fileContent?.xlsx_html || previewData?.xlsx_html;

  const hasXLSXData = xlsxData || content || htmlContent;

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

  const handleDownload = () => {
    const xlsxBase64 = fileContent?.xlsx_base64 || fileContent?.base64_preview || previewData?.xlsx_base64 || previewData?.base64_preview;
    if (xlsxBase64) {
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${xlsxBase64}`;
      link.download = fileContent?.filename || previewData?.filename || 'spreadsheet.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderXLSXContent = () => {
    const xlsxBase64 = fileContent?.xlsx_base64 || fileContent?.base64_preview || previewData?.xlsx_base64 || previewData?.base64_preview;
    
    if (!xlsxBase64 && !hasXLSXData) {
      return (
        <div className="xlsx-no-content">
          <FaFileExcel className="xlsx-icon-large" />
          <h4>XLSX Preview Not Available</h4>
          <p>This XLSX file cannot be previewed in the browser.</p>
          <button onClick={handleDownload} className="download-btn">
            <FaDownload /> Download to View
          </button>
        </div>
      );
    }

    return (
      <div className="xlsx-content-container">
        {/* XLSX Content Views */}
        <div className={`xlsx-content-body ${isFullscreen ? 'fullscreen' : ''}`}>
          {viewMode === 'document' && (
            <div className="xlsx-document-view">
              {htmlContent ? (
                <div className="xlsx-html-viewer">
                  <div className="xlsx-html-container">
                    <div 
                      className="xlsx-html-content-wrapper"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                </div>
              ) : (
                <div className="xlsx-fallback-view">
                  <div className="content-header">
                    <h4>XLSX Spreadsheet</h4>
                    <p className="content-description">
                      Spreadsheet preview not available - download to view in Excel
                    </p>
                  </div>
                  <div className="xlsx-viewer-container">
                    <div className="xlsx-preview-placeholder">
                      <FaFileExcel className="xlsx-icon-large" />
                      <h3>XLSX Spreadsheet</h3>
                      <p>This is a Microsoft Excel spreadsheet (.xlsx)</p>
                      <p className="xlsx-info">
                        {xlsxData?.sheets && `${xlsxData.sheets} sheets`}
                        {xlsxData?.total_rows && ` • ${xlsxData.total_rows} rows`}
                        {xlsxData?.max_columns && ` • ${xlsxData.max_columns} columns`}
                        {fileContent?.file_size && ` • ${formatFileSize(fileContent.file_size)}`}
                      </p>
                      <button onClick={handleDownload} className="download-btn large">
                        <FaDownload /> Download to Open in Excel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'content' && (
            <div className="xlsx-content-view">
              <div className="xlsx-text-content">
                {content ? (
                  <div className="formatted-content">
                    <pre className="xlsx-text">{content}</pre>
                  </div>
                ) : (
                  <div className="no-text-content">
                    <FaFileExcel className="no-content-icon" />
                    <p>No text content could be extracted from this XLSX.</p>
                    <p className="hint">This might be a protected or corrupted spreadsheet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'metadata' && (
            <div className="xlsx-metadata-view">
              <div className="content-header">
                <h4>Spreadsheet Metadata</h4>
                <p className="content-description">
                  Technical information about the XLSX spreadsheet
                </p>
              </div>
              <div className="metadata-grid">
                {/* Basic Info */}
                <div className="metadata-section">
                  <h5>Spreadsheet Information</h5>
                  <div className="metadata-items">
                    {xlsxData?.sheets && (
                      <div className="metadata-item">
                        <span className="metadata-label">Sheets:</span>
                        <span className="metadata-value">{xlsxData.sheets}</span>
                      </div>
                    )}
                    {xlsxData?.total_rows && (
                      <div className="metadata-item">
                        <span className="metadata-label">Total Rows:</span>
                        <span className="metadata-value">{xlsxData.total_rows}</span>
                      </div>
                    )}
                    {xlsxData?.max_columns && (
                      <div className="metadata-item">
                        <span className="metadata-label">Max Columns:</span>
                        <span className="metadata-value">{xlsxData.max_columns}</span>
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

                {/* XLSX Metadata */}
                {xlsxData?.metadata && (
                  <div className="metadata-section">
                    <h5>Workbook Properties</h5>
                    <div className="metadata-items">
                      {Object.entries(xlsxData.metadata).map(([key, value]) => (
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
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`xlsx-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFileExcel className="viewer-icon xlsx" />
          <span>XLSX Viewer</span>
          <span className="file-type-badge xlsx">XLSX</span>
        </div>
        
        <div className="viewer-controls">
          <div className="view-mode-tabs">
            <button
              className={`tab-btn ${viewMode === 'document' ? 'active' : ''}`}
              onClick={() => setViewMode('document')}
            >
              <FaEye /> Spreadsheet
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
        {renderXLSXContent()}
      </div>
    </div>
  );
};

export default XLSXViewer;






