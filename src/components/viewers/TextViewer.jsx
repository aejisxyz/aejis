import React, { useState } from 'react';
import { FaFileAlt, FaCopy, FaExpand } from 'react-icons/fa';
import './ViewerStyles.css';

const TextViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const content = fileContent?.content || previewData?.content || previewData?.text_content || '';
  const filename = fileContent?.filename || previewData?.filename || 'Text File';
  const fileSize = fileContent?.file_size || previewData?.file_size;
  const lineCount = content ? content.split('\n').length : 0;
  const charCount = content ? content.length : 0;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };


  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    );
  };

  const renderContent = () => {
    if (!content) {
      return (
        <div className="no-text-content">
          <FaFileAlt className="no-content-icon" />
          <h4>No Text Content</h4>
          <p>This file appears to be empty or the content could not be extracted.</p>
        </div>
      );
    }

    const lines = content.split('\n');
    
    return (
      <div className="text-content-display">
        <div className="text-lines">
          {lines.map((line, index) => (
            <div key={index} className="text-line">
              <span className="line-number">{index + 1}</span>
              <span className="line-content">
                {searchTerm ? highlightSearchTerm(line) : line}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`text-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaFileAlt className="viewer-icon text" />
          <span>Text Viewer</span>
          <span className="file-type-badge text">TEXT</span>
        </div>
        
        <div className="viewer-controls">
          <div className="text-search">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search in text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={handleCopy} 
              className={`control-btn ${copySuccess ? 'success' : ''}`}
              title="Copy Text"
            >
              <FaCopy />
            </button>
            <button 
              onClick={toggleFullscreen} 
              className="control-btn"
              title="Fullscreen"
            >
              <FaExpand />
            </button>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="text-info-bar">
          <div className="text-stats">
            <span className="stat-item">
              {lineCount.toLocaleString()} lines
            </span>
            <span className="stat-item">
              {charCount.toLocaleString()} characters
            </span>
            {fileSize && (
              <span className="stat-item">
                {formatFileSize(fileSize)}
              </span>
            )}
          </div>
          
          {searchTerm && (
            <div className="search-results">
              <span className="search-info">
                Searching for: "{searchTerm}"
              </span>
            </div>
          )}
        </div>

        <div className="text-content-container">
          {renderContent()}
        </div>
      </div>

      {copySuccess && (
        <div className="copy-notification">
          ✅ Text copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default TextViewer;


