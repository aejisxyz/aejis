import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft,
  FaFile,
  FaFileAlt,
  FaFileArchive,
  FaFileImage,
  FaFilePdf,
  FaCode,
  FaDownload,
  FaShieldAlt,
  FaEye,
  FaTimes,
  FaFolder,
  FaFolderOpen,
  FaChevronRight,
  FaChevronDown,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import SmartPreviewSwitcher from '../components/SmartPreviewSwitcher';
import './Preview.css';

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [loadingFileContent, setLoadingFileContent] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedArchiveFile, setSelectedArchiveFile] = useState(null);
  const [archiveFileContent, setArchiveFileContent] = useState(null);
  const [loadingArchiveFile, setLoadingArchiveFile] = useState(false);
  const [showArchiveFileViewer, setShowArchiveFileViewer] = useState(false);
  const [archiveFileMetadata, setArchiveFileMetadata] = useState(null);

  useEffect(() => {
    if (id) {
      fetchResults();
      fetchPreview();
    }
  }, [id]);

  const fetchResults = async () => {
    try {
      // Add cache-busting parameter to ensure fresh data
      const response = await axios.get(`http://localhost:5000/api/results/${id}?t=${Date.now()}`);
      setResults(response.data);
    } catch (err) {
      console.error('Results fetch error:', err);
    }
  };

  const fetchPreview = async () => {
    try {
      // Add cache-busting parameter to ensure fresh data
      const response = await axios.get(`http://localhost:5000/preview/${id}?t=${Date.now()}`);
      console.log('Preview data received:', response.data);
      console.log('Response status:', response.status);
      console.log('Preview data keys:', Object.keys(response.data));
      console.log('Preview type:', response.data.preview_type);
      console.log('Success:', response.data.success);
      
      
      setPreview(response.data);
    } catch (err) {
      console.error('Preview fetch error:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load file preview');
      toast.error('Failed to load preview');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFileContent = async (filePath) => {
    console.log('Opening file:', filePath);
    setSelectedFile(filePath);
    setLoadingFileContent(true);
    setShowFileViewer(true);

    try {
      const response = await axios.get(`http://localhost:5000/preview/${id}/file/${filePath}`);
      setFileContent(response.data);
      toast.success(`Opened ${response.data.filename || filePath}`);
    } catch (err) {
      console.error('File content fetch error:', err);
      setFileContent({ error: 'Failed to load file content', success: false });
      toast.error('Failed to load file content');
    } finally {
      setLoadingFileContent(false);
    }
  };

  const closeFileViewer = () => {
    setShowFileViewer(false);
    setSelectedFile(null);
    setFileContent(null);
  };

  const fetchArchiveFileContent = async (filePath, fileInfo) => {
    console.log('Opening archive file:', filePath);
    setSelectedArchiveFile(filePath);
    setLoadingArchiveFile(true);
    setShowArchiveFileViewer(true);
    setArchiveFileMetadata(fileInfo);

    try {
      const response = await axios.get(`http://localhost:5000/preview/${id}/archive-file/${encodeURIComponent(filePath)}`);
      setArchiveFileContent(response.data);
      toast.success(`Opened ${fileInfo.name}`);
    } catch (err) {
      console.error('Archive file content fetch error:', err);
      setArchiveFileContent({ 
        error: 'Failed to load file content', 
        success: false,
        filename: fileInfo.name,
        file_size: fileInfo.size,
        file_type: fileInfo.type
      });
      toast.error('Failed to load archive file content');
    } finally {
      setLoadingArchiveFile(false);
    }
  };

  const closeArchiveFileViewer = () => {
    setShowArchiveFileViewer(false);
    setSelectedArchiveFile(null);
    setArchiveFileContent(null);
    setArchiveFileMetadata(null);
  };

  // Image zoom and pan functionality
  const handleImageWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.1, Math.min(5, imageZoom + delta));
    setImageZoom(newZoom);
  };

  const handleImageMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  const handleImageMouseMove = (e) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleImageMouseUp = () => {
    setIsDragging(false);
  };

  const resetImageZoom = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const getFileIcon = (fileType, extension) => {
    // Handle error or unknown types
    if (fileType === 'error' || !fileType) {
      return <FaFile className="file-icon binary" />;
    }
    
    if (fileType === 'text' || ['.txt', '.log', '.md', '.json', '.xml', '.csv'].includes(extension)) {
      return <FaFileAlt className="file-icon text" />;
    } else if (fileType === 'image' || ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'].includes(extension)) {
      return <FaFileImage className="file-icon image" />;
    } else if (fileType === 'pdf' || extension === '.pdf') {
      return <FaFilePdf className="file-icon pdf" />;
    } else if (fileType === 'archive' || ['.zip', '.rar', '.7z', '.tar', '.gz'].includes(extension)) {
      return <FaFileArchive className="file-icon archive" />;
    } else if (['.py', '.js', '.html', '.css', '.php', '.java', '.cpp', '.c'].includes(extension)) {
      return <FaCode className="file-icon code" />;
    } else {
      return <FaFile className="file-icon binary" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to extract file information from preview data and results
  const getFileInfo = (preview, results) => {
    if (!preview && !results) return { filename: 'Unknown File', fileType: 'Unknown', fileSize: '0 B' };
    
    // Prioritize preview data for filename (current file information)
    let filename = preview?.filename || 
                  preview?.file_info?.filename || 
                  preview?.file_name || 
                  preview?.name ||
                  results?.file_info?.filename || 
                  results?.filename;
    
    // If no filename found, try to construct one from file_type
    if (!filename && preview?.file_type) {
      // If file_type is a descriptive type like "Image", create a generic filename
      if (preview.file_type === 'Image') {
        filename = 'image_file';
      } else if (preview.file_type === 'Document') {
        filename = 'document_file';
      } else if (preview.file_type === 'Video') {
        filename = 'video_file';
      } else if (preview.file_type === 'Audio') {
        filename = 'audio_file';
      } else if (preview.file_type === 'Archive') {
        filename = 'archive_file';
      } else if (preview.file_type === 'Code') {
        filename = 'code_file';
      } else if (preview.file_type === 'Text') {
        filename = 'text_file';
      } else {
        // For other types, use the file_type as filename
        filename = `file_${preview.file_type.toLowerCase()}`;
      }
    }
    
    // Fallback to Unknown File if still no filename
    if (!filename) {
      filename = 'Unknown File';
    }
    
    // Try different possible locations for file size (prioritize preview)
    const fileSizeBytes = preview?.file_size || 
                         preview?.file_info?.size || 
                         preview?.size || 
                         preview?.forensic_analysis?.file_size ||
                         results?.file_info?.size || 
                         results?.file_size || 
                         0;
    
    // Try different possible locations for file type
    let fileType = 'Unknown';
    
    // First, try to get file type from preview (current file info)
    if (preview?.file_type) {
      // Handle descriptive file types from backend
      if (preview.file_type === 'Image') {
        fileType = 'Image File';
      } else if (preview.file_type === 'Document') {
        fileType = 'Document File';
      } else if (preview.file_type === 'Video') {
        fileType = 'Video File';
      } else if (preview.file_type === 'Audio') {
        fileType = 'Audio File';
      } else if (preview.file_type === 'Archive') {
        fileType = 'Archive File';
      } else if (preview.file_type === 'Code') {
        fileType = 'Code File';
      } else if (preview.file_type === 'Text') {
        fileType = 'Text File';
      } else {
        // For extension-like types (e.g., '.pdf'), use the extension
        const ext = preview.file_type.replace('.', '');
        fileType = getFileTypeFromExtension(`file.${ext}`);
      }
    } else if (filename && filename !== 'Unknown File') {
      // Try to determine from filename
      fileType = getFileTypeFromExtension(filename);
    } else if (results?.file_info?.type && results.file_info.type !== 'Unknown') {
      fileType = results.file_info.type;
    } else if (results?.file_type && results.file_type !== 'Unknown') {
      fileType = results.file_type;
    }
    
    return {
      filename,
      fileType,
      fileSize: preview?.forensic_analysis?.file_size_human || formatFileSize(fileSizeBytes)
    };
  };

  const getFileTypeFromExtension = (filename) => {
    if (!filename) return 'Unknown';
    
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return 'Unknown';
    
    const typeMap = {
      // Images
      'jpg': 'JPEG Image', 'jpeg': 'JPEG Image', 'png': 'PNG Image', 'gif': 'GIF Image',
      'bmp': 'Bitmap Image', 'svg': 'SVG Vector', 'webp': 'WebP Image', 'ico': 'Icon',
      'tiff': 'TIFF Image', 'tif': 'TIFF Image',
      
      // Videos
      'mp4': 'MP4 Video', 'avi': 'AVI Video', 'mov': 'QuickTime Video', 'wmv': 'WMV Video',
      'flv': 'Flash Video', 'webm': 'WebM Video', 'mkv': 'Matroska Video', 'm4v': 'M4V Video',
      
      // Audio
      'mp3': 'MP3 Audio', 'wav': 'WAV Audio', 'flac': 'FLAC Audio', 'aac': 'AAC Audio',
      'ogg': 'OGG Audio', 'wma': 'WMA Audio', 'm4a': 'M4A Audio',
      
      // Documents
      'pdf': 'PDF Document', 'doc': 'Word Document', 'docx': 'Word Document',
      'txt': 'Text File', 'rtf': 'Rich Text', 'odt': 'OpenDocument Text',
      
      // Spreadsheets
      'xls': 'Excel Spreadsheet', 'xlsx': 'Excel Spreadsheet', 'csv': 'CSV File',
      'ods': 'OpenDocument Spreadsheet',
      
      // Presentations
      'ppt': 'PowerPoint Presentation', 'pptx': 'PowerPoint Presentation',
      'odp': 'OpenDocument Presentation',
      
      // Archives
      'zip': 'ZIP Archive', 'rar': 'RAR Archive', '7z': '7-Zip Archive',
      'tar': 'TAR Archive', 'gz': 'GZIP Archive', 'bz2': 'BZIP2 Archive',
      
      // Code
      'js': 'JavaScript', 'jsx': 'React JSX', 'ts': 'TypeScript', 'tsx': 'React TSX',
      'py': 'Python', 'java': 'Java', 'cpp': 'C++', 'c': 'C', 'h': 'C Header',
      'css': 'CSS', 'html': 'HTML', 'htm': 'HTML', 'xml': 'XML', 'json': 'JSON',
      'php': 'PHP', 'rb': 'Ruby', 'go': 'Go', 'rs': 'Rust', 'swift': 'Swift',
      
      // Executables
      'exe': 'Windows Executable', 'msi': 'Windows Installer', 'dmg': 'macOS Disk Image',
      'deb': 'Debian Package', 'rpm': 'RPM Package', 'app': 'macOS Application',
      
      // Fonts
      'ttf': 'TrueType Font', 'otf': 'OpenType Font', 'woff': 'Web Font',
      'woff2': 'Web Font 2', 'eot': 'Embedded OpenType',
      
      // Other
      'iso': 'ISO Image', 'bin': 'Binary File', 'dat': 'Data File'
    };
    
    return typeMap[ext] || `${ext.toUpperCase()} File`;
  };

  const organizeFilesByFolder = (files) => {
    const folders = {};
    const rootFiles = [];

    files.forEach(file => {
      const pathParts = file.path.split('/');
      if (pathParts.length === 1) {
        rootFiles.push(file);
      } else {
        const folder = pathParts[0];
        if (!folders[folder]) {
          folders[folder] = [];
        }
        folders[folder].push({
          ...file,
          name: pathParts.slice(1).join('/')
        });
      }
    });

    return { folders, rootFiles };
  };

  const filteredAndSortedFiles = () => {
    if (!preview?.archive_contents) return { folders: {}, rootFiles: [] };

    let filtered = preview.archive_contents.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort files
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'size':
          aVal = a.size;
          bVal = b.size;
          break;
        case 'type':
          aVal = a.type;
          bVal = b.type;
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return organizeFilesByFolder(filtered);
  };

  const toggleFolder = (folderName) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="sort-icon" />;
    return sortOrder === 'asc' ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />;
  };

  if (isLoading) {
    return (
      <div className="preview-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading file preview...</p>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    console.log('Preview error state:', { error, preview, isLoading });
    return (
      <div className="preview-container">
        <div className="error">
          <FaTimes className="error-icon" />
          <h2>Preview Not Available</h2>
          <p>{error || 'File preview could not be loaded'}</p>
          <p>Debug: error={error}, preview={preview}, isLoading={isLoading}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const { folders, rootFiles } = filteredAndSortedFiles();

  return (
    <div className="preview-page">
      <div className="preview-container">
        {/* Premium Preview Hero Section */}
        <div className="preview-hero-section">
          <div className="preview-hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          <div className="preview-hero-content">
            <div className="preview-hero-header">
              <h1 className="preview-hero-title">
                <span className="preview-title-part-1">File Preview</span>
                <span className="preview-title-part-2">& Analysis</span>
              </h1>
              <p className="preview-hero-subtitle">
                Advanced file inspection and forensic analysis tools
              </p>
            </div>
            
            <div className="preview-info-box">
              <div className="preview-text-container">
                <div className="preview-label-text">Analysis ID</div>
                <div className="preview-analysis-id">{preview?.analysis_id || id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Header */}
        <div className="nav-header">
          <div className="header-nav">
            <button 
              onClick={() => {
                console.log('Back button clicked');
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/results');
                }
              }} 
              className="back-button"
              title="Back to Previous Page"
            >
              <FaArrowLeft />
            </button>
          </div>
        </div>

      <div className="preview-content">
        {/* Sleek File Info Section */}
        <div className="file-info-section">
          <div className="file-info-container">
            
            <div className="file-details-section">
              <div className="file-name-container">
                {(() => {
                  const fileInfo = getFileInfo(preview, results);
                  return (
                    <>
                      <h2 className="file-name">{fileInfo.filename}</h2>
                      <div className="file-meta">
                        <span className="file-type">{fileInfo.fileType}</span>
                        <span className="file-size">{fileInfo.fileSize}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Forensic Analysis */}
        {preview.forensic_analysis && (
          <div className="forensic-analysis-section">
            <div className="forensic-header">
              <h3 className="forensic-title">Forensic Analysis</h3>
              <p className="forensic-subtitle">Ultra-detailed file analysis beyond standard tools</p>
            </div>
            
            <div className="forensic-sections">
              {/* Cryptographic Hashes */}
              <div className="premium-card hashes-card">
                <div className="card-glow"></div>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>Cryptographic Hashes</h3>
                    <span className="card-subtitle">File Integrity & Verification</span>
                  </div>
                  <div className="status-indicator active"></div>
                </div>
                <div className="card-metrics">
                <div className="hash-grid">
                  <div className="hash-item">
                    <span className="hash-label">MD5:</span>
                    <code className="hash-value">{preview.forensic_analysis.hashes?.md5}</code>
                  </div>
                  <div className="hash-item">
                    <span className="hash-label">SHA1:</span>
                    <code className="hash-value">{preview.forensic_analysis.hashes?.sha1}</code>
                  </div>
                  <div className="hash-item">
                    <span className="hash-label">SHA256:</span>
                    <code className="hash-value">{preview.forensic_analysis.hashes?.sha256}</code>
                  </div>
                  <div className="hash-item">
                    <span className="hash-label">SHA512:</span>
                    <code className="hash-value">{preview.forensic_analysis.hashes?.sha512}</code>
                  </div>
                </div>
                </div>
              </div>

              {/* Entropy Analysis */}
              <div className="premium-card entropy-card">
                <div className="card-glow"></div>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>Entropy Analysis</h3>
                    <span className="card-subtitle">Data Randomness & Encryption Detection</span>
                  </div>
                  <div className="status-indicator active"></div>
                </div>
                <div className="card-metrics">
                <div className="entropy-display">
                  <div className="entropy-score">
                    <span className="entropy-value">{preview.forensic_analysis.entropy}</span>
                    <span className="entropy-max">/8.0</span>
                  </div>
                  <div className="entropy-bar">
                    <div 
                      className="entropy-fill" 
                      style={{width: `${(preview.forensic_analysis.entropy / 8) * 100}%`}}
                    ></div>
                  </div>
                  <p className="entropy-interpretation">
                    {preview.forensic_analysis.entropy_interpretation}
                  </p>
                </div>
                </div>
              </div>

              {/* File Header Analysis */}
              <div className="premium-card header-card">
                <div className="card-glow"></div>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>File Header & Magic Bytes</h3>
                    <span className="card-subtitle">File Signature & Format Detection</span>
                  </div>
                  <div className="status-indicator active"></div>
                </div>
                <div className="card-metrics">
                <div className="header-analysis">
                  <div className="magic-bytes">
                    <span className="label">Magic Bytes:</span>
                    <code className="magic-value">{preview.forensic_analysis.file_header?.magic_bytes}</code>
                  </div>
                  <div className="header-interpretation">
                    <span className="label">Interpretation:</span>
                    <span className="interpretation-value">
                      {preview.forensic_analysis.file_header?.interpretation}
                    </span>
                  </div>
                </div>
                </div>
              </div>

              {/* Byte Frequency Analysis */}
              <div className="premium-card frequency-card">
                <div className="card-glow"></div>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>Byte Frequency Analysis</h3>
                    <span className="card-subtitle">Data Distribution & Patterns</span>
                  </div>
                  <div className="status-indicator active"></div>
                </div>
                <div className="card-metrics">
                <div className="byte-frequency">
                  <div className="frequency-stats">
                    <div className="stat-item">
                      <span className="stat-label">Unique Bytes:</span>
                      <span className="stat-value">{preview.forensic_analysis.byte_frequency?.unique_bytes}/256</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Bytes:</span>
                      <span className="stat-value">{preview.forensic_analysis.byte_frequency?.total_bytes?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="most-common-bytes">
                    <h5>Most Common Bytes:</h5>
                    <div className="byte-list">
                      {preview.forensic_analysis.byte_frequency?.most_common?.slice(0, 5).map((item, index) => (
                        <div key={index} className="byte-item">
                          <span className="byte-hex">{item.byte}</span>
                          <span className="byte-count">{item.count}</span>
                          <span className="byte-percentage">({item.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* Security Analysis */}
              <div className="premium-card security-card">
                <div className="card-glow"></div>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>Security Analysis</h3>
                    <span className="card-subtitle">Threat Detection & Risk Assessment</span>
                  </div>
                  <div className="status-indicator active"></div>
                </div>
                <div className="card-metrics">
                <div className="security-analysis">
                  <div className="risk-score">
                    <span className="risk-label">Risk Score:</span>
                    <span className={`risk-value ${preview.forensic_analysis.security_analysis?.risk_score > 50 ? 'high-risk' : 'low-risk'}`}>
                      {preview.forensic_analysis.security_analysis?.risk_score}/100
                    </span>
                  </div>
                  {preview.forensic_analysis.security_analysis?.suspicious_indicators?.length > 0 && (
                    <div className="suspicious-indicators">
                      <h5>⚠️ Suspicious Indicators:</h5>
                      <ul className="indicator-list">
                        {preview.forensic_analysis.security_analysis.suspicious_indicators.map((indicator, index) => (
                          <li key={index} className="indicator-item">{indicator}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                </div>
              </div>

              {/* Timestamp Analysis */}
              <div className="premium-card timestamp-card">
                <div className="card-glow"></div>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>Timestamp Analysis</h3>
                    <span className="card-subtitle">File Creation & Modification Times</span>
                  </div>
                  <div className="status-indicator active"></div>
                </div>
                <div className="card-metrics">
                <div className="timestamp-grid">
                  <div className="timestamp-item">
                    <span className="timestamp-label">Created:</span>
                    <span className="timestamp-value">{preview.forensic_analysis.timestamps?.created}</span>
                  </div>
                  <div className="timestamp-item">
                    <span className="timestamp-label">Modified:</span>
                    <span className="timestamp-value">{preview.forensic_analysis.timestamps?.modified}</span>
                  </div>
                  <div className="timestamp-item">
                    <span className="timestamp-label">Accessed:</span>
                    <span className="timestamp-value">{preview.forensic_analysis.timestamps?.accessed}</span>
                  </div>
                </div>
                </div>
              </div>

              {/* String Analysis */}
              {preview.forensic_analysis.string_analysis?.strings_found?.length > 0 && (
                <div className="premium-card string-card">
                  <div className="card-glow"></div>
                  <div className="card-header">
                    <div className="card-title-section">
                      <h3>String Analysis</h3>
                      <span className="card-subtitle">Text Extraction & Analysis</span>
                    </div>
                    <div className="status-indicator active"></div>
                  </div>
                  <div className="card-metrics">
                  <div className="string-analysis">
                    <div className="string-stats">
                      <span className="stat">Total Strings: {preview.forensic_analysis.string_analysis.total_strings}</span>
                      <span className="stat">Avg Length: {Math.round(preview.forensic_analysis.string_analysis.average_string_length)}</span>
                    </div>
                    <div className="string-list">
                      <h5>Found Strings:</h5>
                      {preview.forensic_analysis.string_analysis.strings_found.slice(0, 10).map((str, index) => (
                        <div key={index} className="string-item">
                          <code>"{str}"</code>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {/* Advanced Metadata */}
              <div className="premium-card metadata-card">
                <div className="card-glow"></div>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>Advanced Metadata</h3>
                    <span className="card-subtitle">File Properties & Characteristics</span>
                  </div>
                  <div className="status-indicator active"></div>
                </div>
                <div className="card-metrics">
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <span className="metadata-label">File Size:</span>
                    <span className="metadata-value">{preview.forensic_analysis.advanced_metadata?.file_size_human}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Permissions:</span>
                    <span className="metadata-value">{preview.forensic_analysis.advanced_metadata?.file_permissions}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Printable %:</span>
                    <span className="metadata-value">{preview.forensic_analysis.advanced_metadata?.printable_percentage?.toFixed(1)}%</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Null Bytes %:</span>
                    <span className="metadata-value">{preview.forensic_analysis.advanced_metadata?.zero_bytes_percentage?.toFixed(1)}%</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Binary File:</span>
                    <span className={`metadata-value ${preview.forensic_analysis.advanced_metadata?.is_likely_binary ? 'yes' : 'no'}`}>
                      {preview.forensic_analysis.advanced_metadata?.is_likely_binary ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Encrypted:</span>
                    <span className={`metadata-value ${preview.forensic_analysis.advanced_metadata?.is_likely_encrypted ? 'yes' : 'no'}`}>
                      {preview.forensic_analysis.advanced_metadata?.is_likely_encrypted ? 'Possibly' : 'No'}
                    </span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* PDF Preview */}
        {preview.preview_type === 'pdf' && (
          <div className="pdf-preview">
            <div className="pdf-header">
              <h3>PDF Document</h3>
              {preview.secure_extraction && (
                <span className="security-badge">Secure Analysis</span>
              )}
            </div>
            
            {preview.pdf_metadata && (
              <div className="pdf-metadata">
                <h4>Document Information</h4>
                <div className="metadata-grid">
                  {preview.pdf_metadata.page_count && (
                    <div className="metadata-item">
                      <strong>Pages:</strong> {preview.pdf_metadata.page_count}
                    </div>
                  )}
                  {preview.pdf_metadata.metadata?.title && (
                    <div className="metadata-item">
                      <strong>Title:</strong> {preview.pdf_metadata.metadata.title}
                    </div>
                  )}
                  {preview.pdf_metadata.metadata?.author && (
                    <div className="metadata-item">
                      <strong>Author:</strong> {preview.pdf_metadata.metadata.author}
                    </div>
                  )}
                  {preview.pdf_metadata.metadata?.creator && (
                    <div className="metadata-item">
                      <strong>Creator:</strong> {preview.pdf_metadata.metadata.creator}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="pdf-content">
              <h4>Extracted Text Content</h4>
              <div className="content-text">
                {preview.preview_content}
              </div>
            </div>
          </div>
        )}

        {/* Document Preview */}
        {preview.preview_type === 'document' && (
          <div className="document-preview">
            <div className="document-header">
              <h3>Document Preview</h3>
              {preview.secure_extraction && (
                <span className="security-badge">Secure Analysis</span>
              )}
            </div>
            
            {preview.document_metadata && (
              <div className="document-metadata">
                <div className="metadata-grid">
                  {preview.document_metadata.paragraph_count && (
                    <div className="metadata-item">
                      <strong>Paragraphs:</strong> {preview.document_metadata.paragraph_count}
                    </div>
                  )}
                  {preview.document_metadata.table_count && (
                    <div className="metadata-item">
                      <strong>Tables:</strong> {preview.document_metadata.table_count}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="document-content">
              <div className="content-text">
                {preview.preview_content}
              </div>
            </div>
          </div>
        )}

        {/* Code Preview */}
        {preview.preview_type === 'code' && (
          <div className="code-preview">
            <div className="code-header">
              <h3>Code Preview</h3>
              {preview.secure_extraction && (
                <span className="security-badge">Secure Analysis</span>
              )}
            </div>
            
            {preview.code_metadata && (
              <div className="code-metadata">
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <strong>Language:</strong> {preview.code_metadata.language}
                  </div>
                  <div className="metadata-item">
                    <strong>Lines:</strong> {preview.code_metadata.line_count}
                  </div>
                  <div className="metadata-item">
                    <strong>Characters:</strong> {preview.code_metadata.character_count}
                  </div>
                </div>
              </div>
            )}
            
            <div className="code-content">
              <div className="content-text">
                <pre className="code-block">{preview.preview_content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Generic Text Preview */}
        {preview.preview_type === 'text' && (
          <div className="text-preview">
            <div className="text-header">
              <h3>Text File</h3>
              {preview.secure_extraction && (
                <span className="security-badge">Secure Analysis</span>
              )}
            </div>
            
            <div className="text-content">
              <div className="content-text">
                <pre>{preview.preview_content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Archive Preview */}
        {preview.preview_type === 'archive' && preview.archive_contents && (
          <div className="archive-browser">
            <div className="archive-header">
              <h3>Archive Contents</h3>
              <div className="archive-stats">
                <span>{preview.total_files} files</span>
                <span>{formatFileSize(preview.total_extracted_size)} extracted</span>
              </div>
            </div>

            <div className="archive-controls">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="file-list">
              <div className="file-list-header">
                <div className="file-list-column name" onClick={() => handleSort('name')}>
                  Name {getSortIcon('name')}
                </div>
                <div className="file-list-column size" onClick={() => handleSort('size')}>
                  Size {getSortIcon('size')}
                </div>
                <div className="file-list-column type" onClick={() => handleSort('type')}>
                  Type {getSortIcon('type')}
                </div>
                <div className="file-list-column actions">Actions</div>
              </div>

              <div className="file-list-content">
                {/* Root files */}
                {rootFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    className="file-item interactive"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => fetchArchiveFileContent(file.path, file)}
                  >
                    <div className="file-item-content">
                      <div className="file-icon-container">
                        {getFileIcon(file.type, file.extension)}
                      </div>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <div className="file-meta">
                          <span className="file-size">{formatFileSize(file.size)}</span>
                          <span className="file-type">{file.type}</span>
                          {file.compressed_size && (
                            <span className="file-compressed">
                              Compressed: {formatFileSize(file.compressed_size)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="file-actions">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchArchiveFileContent(file.path, file);
                          }}
                        >
                          <FaEye /> View
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add download functionality later
                          }}
                        >
                          <FaDownload /> Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Folder files */}
                {Object.entries(folders).map(([folderName, files]) => (
                  <div key={folderName} className="folder-group">
                    <div
                      className="folder-header"
                      onClick={() => toggleFolder(folderName)}
                    >
                      {expandedFolders.has(folderName) ? (
                        <FaChevronDown className="folder-icon" />
                      ) : (
                        <FaChevronRight className="folder-icon" />
                      )}
                      {expandedFolders.has(folderName) ? (
                        <FaFolderOpen className="folder-icon" />
                      ) : (
                        <FaFolder className="folder-icon" />
                      )}
                      <span className="folder-name">{folderName}</span>
                      <span className="folder-count">({files.length} files)</span>
                    </div>

                    {expandedFolders.has(folderName) && (
                      <div className="folder-content">
                        {files.map((file, index) => (
                          <motion.div
                            key={index}
                            className="file-item folder-file interactive"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => fetchArchiveFileContent(file.path, file)}
                          >
                            <div className="file-item-content">
                              <div className="file-icon-container">
                                {getFileIcon(file.type, file.extension)}
                              </div>
                              <div className="file-details">
                                <span className="file-name">{file.name}</span>
                                <div className="file-meta">
                                  <span className="file-size">{formatFileSize(file.size)}</span>
                                  <span className="file-type">{file.type}</span>
                                  {file.compressed_size && (
                                    <span className="file-compressed">
                                      Compressed: {formatFileSize(file.compressed_size)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="file-actions">
                                <button 
                                  className="btn btn-sm btn-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fetchArchiveFileContent(file.path, file);
                                  }}
                                >
                                  <FaEye /> View
                                </button>
                                <button 
                                  className="btn btn-sm btn-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add download functionality later
                                  }}
                                >
                                  <FaDownload /> Download
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* File Content Viewer */}
        {selectedFile && (
          <div className="file-content-viewer">
            <div className="file-content-header">
              <h3>{fileContent?.filename}</h3>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedFile(null)}
              >
                <FaTimes /> Close
              </button>
            </div>
            
            {isLoadingFile ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading file content...</p>
              </div>
            ) : (
              <div className="file-content-body">
                {fileContent?.content_type === 'text' ? (
                  <pre className="file-content-text">{fileContent.content}</pre>
                ) : (
                  <div className="file-content-info">
                    <p>{fileContent?.content}</p>
                    <div className="file-info-details">
                      <p><strong>Size:</strong> {formatFileSize(fileContent?.file_size)}</p>
                      <p><strong>Type:</strong> {fileContent?.file_type}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Smart File Viewer Modal */}
      {showFileViewer && (
        <div className="file-viewer-modal">
          <div className="file-viewer-container">
            <div className="file-viewer-header">
              <div className="file-viewer-title">
                <FaFileAlt className="file-viewer-icon" />
                <span>{fileContent?.filename || selectedFile || 'File Viewer'}</span>
              </div>
              <div className="file-viewer-controls">
                {fileContent?.file_size && (
                  <span className="file-size">{formatFileSize(fileContent.file_size)}</span>
                )}
                <button onClick={closeFileViewer} className="close-button">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="file-viewer-content">
              {loadingFileContent ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading file content...</p>
                </div>
              ) : fileContent?.error ? (
                <div className="error-container">
                  <FaTimes className="error-icon" />
                  <h3>Failed to Load File</h3>
                  <p>{fileContent.error}</p>
                </div>
              ) : fileContent?.success ? (
                <SmartPreviewSwitcher
                  fileContent={fileContent}
                  previewData={null}
                  analysisId={id}
                  onClose={closeFileViewer}
                  imageZoom={imageZoom}
                  setImageZoom={setImageZoom}
                  imagePosition={imagePosition}
                  setImagePosition={setImagePosition}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  dragStart={dragStart}
                  setDragStart={setDragStart}
                  resetImageZoom={resetImageZoom}
                  handleImageWheel={handleImageWheel}
                  handleImageMouseDown={handleImageMouseDown}
                  handleImageMouseMove={handleImageMouseMove}
                  handleImageMouseUp={handleImageMouseUp}
                />
              ) : (
                <div className="no-content">
                  <FaFileAlt className="no-content-icon" />
                  <p>No content available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Archive File Viewer */}
      {showArchiveFileViewer && selectedArchiveFile && (
        <div className="archive-file-viewer">
          <div className="archive-file-header">
            <div className="archive-file-info">
              <div className="archive-file-icon">
                {archiveFileMetadata && getFileIcon(archiveFileMetadata.type, archiveFileMetadata.extension)}
              </div>
              <div className="archive-file-details">
                <h3>{archiveFileMetadata?.name || selectedArchiveFile}</h3>
                <div className="archive-file-meta">
                  <span>Size: {formatFileSize(archiveFileMetadata?.size || 0)}</span>
                  <span>Type: {archiveFileMetadata?.type || 'Unknown'}</span>
                  {archiveFileMetadata?.compressed_size && (
                    <span>Compressed: {formatFileSize(archiveFileMetadata.compressed_size)}</span>
                  )}
                </div>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              onClick={closeArchiveFileViewer}
            >
              <FaTimes /> Close
            </button>
          </div>
          
          {loadingArchiveFile ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading archive file content...</p>
            </div>
          ) : (
            <div className="archive-file-content">
              {archiveFileContent?.error ? (
                <div className="error">
                  <FaTimes className="error-icon" />
                  <h4>Error Loading File</h4>
                  <p>{archiveFileContent.error}</p>
                </div>
              ) : (
                <div className="archive-file-body">
                  {/* Text Files */}
                  {archiveFileContent?.content_type === 'text' && (
                    <div className="text-content">
                      <div className="content-header">
                        <h4>Text Content</h4>
                        <div className="content-stats">
                          <span>Lines: {archiveFileContent.content?.split('\n').length || 0}</span>
                          <span>Characters: {archiveFileContent.content?.length || 0}</span>
                        </div>
                      </div>
                      <div className="content-viewer">
                        <pre className="text-content">{archiveFileContent.content}</pre>
                      </div>
                    </div>
                  )}

                  {/* Image Files */}
                  {archiveFileContent?.content_type === 'image' && (
                    <div className="image-content">
                      <div className="content-header">
                        <h4>Image Preview</h4>
                        <div className="content-stats">
                          <span>Format: {archiveFileContent.image_metadata?.format}</span>
                          <span>Size: {archiveFileContent.image_metadata?.dimensions}</span>
                        </div>
                      </div>
                      <div className="image-viewer">
                        {archiveFileContent.thumbnail_base64 ? (
                          <img 
                            src={archiveFileContent.thumbnail_base64} 
                            alt="Archive file preview"
                            className="archive-image-preview"
                          />
                        ) : (
                          <div className="no-preview">
                            <FaFileImage />
                            <p>Image preview not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Font Files */}
                  {archiveFileContent?.content_type === 'font' && (
                    <div className="font-content">
                      <div className="content-header">
                        <h4>Font File Analysis</h4>
                        <div className="content-stats">
                          <span>Size: {formatFileSize(archiveFileContent.file_size)}</span>
                          <span>Type: {archiveFileContent.file_type}</span>
                        </div>
                      </div>
                      <div className="font-viewer">
                        {archiveFileContent.metadata && (
                          <div className="font-metadata">
                            <h5>Font Information</h5>
                            <div className="metadata-grid">
                              <div className="metadata-item">
                                <span>Font Name:</span>
                                <span>{archiveFileContent.metadata.font_name || 'Unknown'}</span>
                              </div>
                              <div className="metadata-item">
                                <span>Font Type:</span>
                                <span>{archiveFileContent.metadata.font_type || 'Unknown'}</span>
                              </div>
                              <div className="metadata-item">
                                <span>File Format:</span>
                                <span>{archiveFileContent.metadata.file_format || 'Font File'}</span>
                              </div>
                              <div className="metadata-item">
                                <span>MIME Type:</span>
                                <span>{archiveFileContent.metadata.mime_type}</span>
                              </div>
                              <div className="metadata-item">
                                <span>Tables:</span>
                                <span>{archiveFileContent.metadata.num_tables || 'Unknown'}</span>
                              </div>
                              <div className="metadata-item">
                                <span>Entropy:</span>
                                <span>{archiveFileContent.metadata.entropy?.toFixed(2)}/8.0</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="hex-viewer">
                          <h5>Font Header (first 512 bytes)</h5>
                          <pre className="hex-content">{archiveFileContent.content}</pre>
                        </div>
                        <div className="font-info">
                          <h5>Font Analysis</h5>
                          <p>This is a font file containing character glyphs and typography data. The hex dump shows the OpenType/TrueType font structure with table headers and metadata.</p>
                          <div className="font-features">
                            <h6>Detected Features:</h6>
                            <ul>
                              <li>OpenType Font (OTF) format</li>
                              <li>Contains character glyphs and metrics</li>
                              <li>Includes font metadata and naming information</li>
                              <li>Compressed within ZIP archive</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Binary Files */}
                  {archiveFileContent?.content_type === 'binary' && (
                    <div className="binary-content">
                      <div className="content-header">
                        <h4>Binary File Analysis</h4>
                        <div className="content-stats">
                          <span>Size: {formatFileSize(archiveFileContent.file_size)}</span>
                          <span>Type: {archiveFileContent.file_type}</span>
                        </div>
                      </div>
                      <div className="binary-viewer">
                        <div className="hex-viewer">
                          <h5>Hex Dump (first 512 bytes)</h5>
                          <pre className="hex-content">{archiveFileContent.content}</pre>
                        </div>
                        {archiveFileContent.metadata && (
                          <div className="binary-metadata">
                            <h5>File Metadata</h5>
                            <div className="metadata-grid">
                              <div className="metadata-item">
                                <span>MIME Type:</span>
                                <span>{archiveFileContent.metadata.mime_type}</span>
                              </div>
                              <div className="metadata-item">
                                <span>Entropy:</span>
                                <span>{archiveFileContent.metadata.entropy?.toFixed(2)}/8.0</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Generic Content */}
                  {!['text', 'image', 'binary'].includes(archiveFileContent?.content_type) && (
                    <div className="generic-content">
                      <div className="content-header">
                        <h4>File Content</h4>
                        <div className="content-stats">
                          <span>Type: {archiveFileContent?.content_type || 'Unknown'}</span>
                          <span>Size: {formatFileSize(archiveFileContent?.file_size || 0)}</span>
                        </div>
                      </div>
                      <div className="content-viewer">
                        <pre className="generic-content">{archiveFileContent?.content || 'No content available'}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Preview;