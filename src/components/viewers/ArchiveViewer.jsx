import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaFileArchive, FaDownload, FaFolder, FaFile, FaEye, FaTimes, FaSpinner, FaExpand, FaCompress } from 'react-icons/fa';
import API_URL from '../../config/api';
import './ViewerStyles.css';

const ArchiveViewer = ({ fileContentData, previewData, analysisId, onClose, detectedType }) => {
  console.log('🔍 ArchiveViewer render:', { archiveContents: previewData?.archive_contents, analysisId, fileContent: fileContentData });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContentData2, setFileContentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const archiveContents = previewData?.archive_contents || [];
  const filename = previewData?.filename || 'Archive';
  const fileSize = previewData?.file_size;
  const totalFiles = previewData?.total_files || archiveContents.length;

  const handleDownload = () => {
    console.log('Download archive:', filename);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileClick = async (file) => {
    if (file.is_dir) {
      console.log('Folder clicked:', file.path);
      return;
    }

    setLoading(true);
    setSelectedFile(file);
    
    try {
      const response = await fetch(`${API_URL}/preview/${analysisId}/file/${file.path}`);
      const data = await response.json();
      
      if (data.success) {
        setFileContentData(data);
      } else {
        setFileContentData({ error: data.error || 'Failed to load file' });
      }
    } catch (error) {
      console.error('Error fetching file:', error);
      setFileContentData({ error: 'Network error loading file' });
    } finally {
      setLoading(false);
    }
  };

  const closeFileViewer = () => {
    setSelectedFile(null);
    setFileContentData(null);
  };

  // Enhanced file list with modern UI
  const renderFileList = () => {
    if (!archiveContents || archiveContents.length === 0) {
      return (
        <div className="no-files">
          <div className="no-files-icon">📁</div>
          <div className="no-files-text">No files found in archive</div>
        </div>
      );
    }

    // Filter files based on search term
    const filteredFiles = archiveContents.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.path.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show first 500 filtered files
    const filesToShow = filteredFiles.slice(0, 500);
    
    return (
      <div className="file-list">
        <div className="file-list-header">
          <div className="file-count">
            <span className="file-count-number">{filesToShow.length}</span>
            <span className="file-count-text">
              {searchTerm ? `of ${filteredFiles.length} files` : `of ${archiveContents.length} files`}
            </span>
          </div>
          <div className="file-list-controls">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search files..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="file-grid">
          {filesToShow.map((file, index) => (
            <div 
              key={`${file.path}-${index}`}
              className="file-card"
              onClick={() => handleFileClick(file)}
            >
              <div className="file-card-header">
                <div className="file-icon-container">
                  <span className="file-icon">
                    {file.is_dir ? <FaFolder /> : <FaFile />}
                  </span>
                </div>
                <div className="file-actions">
                  {!file.is_dir && (
                    <button 
                      className="view-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileClick(file);
                      }}
                      title="View file content"
                    >
                      <FaEye />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="file-card-content">
                <div className="file-name" title={file.name || file.path}>
                  {file.name || file.path}
                </div>
                <div className="file-meta">
                  <span className="file-size">{formatFileSize(file.size)}</span>
                  {file.type && (
                    <>
                      <span className="file-separator">•</span>
                      <span className="file-type">{file.type}</span>
                    </>
                  )}
                </div>
                <div className="file-path" title={file.path}>
                  {file.path}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {archiveContents.length > 100 && (
          <div className="more-files-notice">
            <div className="more-files-icon">📄</div>
            <div className="more-files-text">
              <div className="more-files-count">+{archiveContents.length - 100} more files</div>
              <div className="more-files-subtitle">Use search to find specific files</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (archiveContents.length === 0) {
    return (
      <div className="archive-viewer">
        <div className="viewer-header">
          <div className="viewer-title">
            <FaFileArchive className="viewer-icon archive" />
            <span>Archive Viewer</span>
            <span className="file-type-badge archive">ARCHIVE</span>
          </div>
        </div>
        <div className="viewer-content">
          <div className="no-files">
            <FaFileArchive className="archive-icon-large" />
            <h4>No Files Found</h4>
            <p>This archive appears to be empty or could not be processed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`archive-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFileArchive className="viewer-icon archive" />
          <span>Archive Viewer</span>
          <span className="file-type-badge archive">ZIP</span>
        </div>
        
        <div className="viewer-controls">
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
        <div className="archive-browser">
          <div className="file-tree">
            {renderFileList()}
          </div>
        </div>

        {selectedFile && createPortal(
          <div className="file-viewer-modal">
            <div className="file-viewer-modal-backdrop" onClick={closeFileViewer}></div>
            <div className="file-viewer-modal-content">
              <div className="file-viewer-header">
                <div className="file-info">
                  <strong>{selectedFile.name}</strong>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
                <button className="close-btn" onClick={closeFileViewer}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="file-content">
                {loading ? (
                  <div className="loading">
                    <FaSpinner className="loading-spinner" />
                    <span>Loading file content...</span>
                  </div>
                ) : fileContentData2?.error ? (
                  <div className="error">
                    <strong>Error:</strong> {fileContentData2.error}
                  </div>
                ) : fileContentData2?.content ? (
                  <div className="file-text-content">
                    <pre>{fileContentData2.content}</pre>
                  </div>
                ) : (
                  <div className="no-content">
                    <span>Click a file to view its content</span>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default ArchiveViewer;