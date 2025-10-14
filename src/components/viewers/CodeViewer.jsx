import React, { useState } from 'react';
import { FaCode, FaDownload, FaCopy, FaExpand, FaSearch } from 'react-icons/fa';
import './ViewerStyles.css';

const CodeViewer = ({ fileContent, previewData, onClose, detectedType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const content = fileContent?.content || previewData?.content || '';
  const filename = fileContent?.filename || previewData?.filename || 'Code File';
  const fileSize = fileContent?.file_size || previewData?.file_size;
  const language = detectLanguage(filename);
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
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const renderCodeContent = () => {
    if (!content) {
      return (
        <div className="no-code-content">
          <FaCode className="no-content-icon" />
          <h4>No Code Content</h4>
          <p>This file appears to be empty or the content could not be extracted.</p>
        </div>
      );
    }

    const lines = content.split('\n');
    
    return (
      <div className="code-content-display">
        <div className="code-lines">
          {lines.map((line, index) => (
            <div key={index} className="code-line">
              <span className="line-number">{index + 1}</span>
              <span className="line-content">
                <code className={`language-${language}`}>
                  {searchTerm ? highlightSearchTerm(line) : line}
                </code>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`code-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <FaCode className="viewer-icon code" />
          <span>Code Viewer</span>
          <span className="file-type-badge code">CODE</span>
          {language && (
            <span className="language-badge">{language.toUpperCase()}</span>
          )}
        </div>
        
        <div className="viewer-controls">
          <div className="code-search">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search in code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="action-controls">
            <button 
              onClick={handleCopy} 
              className={`control-btn ${copySuccess ? 'success' : ''}`}
              title="Copy Code"
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
        <div className="code-info-bar">
          <div className="code-stats">
            <span className="stat-item">
              📄 {lineCount.toLocaleString()} lines
            </span>
            <span className="stat-item">
              🔤 {charCount.toLocaleString()} characters
            </span>
            {fileSize && (
              <span className="stat-item">
                📏 {formatFileSize(fileSize)}
              </span>
            )}
            <span className="stat-item">
              💻 {language || 'Unknown'}
            </span>
          </div>
          
          {searchTerm && (
            <div className="search-results">
              <span className="search-info">
                Searching for: "{searchTerm}"
              </span>
            </div>
          )}
        </div>

        <div className="code-content-container">
          {renderCodeContent()}
        </div>
      </div>

      {copySuccess && (
        <div className="copy-notification">
          ✅ Code copied to clipboard!
        </div>
      )}
    </div>
  );
};

// Helper function to detect programming language from filename
const detectLanguage = (filename) => {
  if (!filename) return 'text';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'c',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'ps1': 'powershell',
    'bat': 'batch',
    'cmd': 'batch',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml'
  };
  
  return languageMap[extension] || 'text';
};

export default CodeViewer;


