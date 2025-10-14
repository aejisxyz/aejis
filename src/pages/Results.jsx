import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEye, 
  FaFile, 
  FaFileImage, 
  FaFileVideo, 
  FaFileAudio, 
  FaFilePdf, 
  FaFileArchive, 
  FaFileCode, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint, 
  FaExclamationTriangle, 
  FaSpinner, 
  FaCogs,
  FaChevronDown,
  FaChevronRight,
  FaFolder,
  FaFolderOpen,
  FaTimes,
  FaArrowLeft,
  FaExpand
} from 'react-icons/fa';
import NoVNCViewer from '../components/NoVNCViewer';
import SmartPreviewSwitcher from '../components/SmartPreviewSwitcher';
import ArchiveViewer from '../components/viewers/ArchiveViewer';
import API_URL from '../config/api';
import './Results.css';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  
  // Debug previewData changes
  useEffect(() => {
    console.log('🔄 previewData changed:', previewData?.preview_type);
  }, [previewData]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showNoVNC, setShowNoVNC] = useState(false);
  const [archiveFileContent, setArchiveFileContent] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter to ensure fresh data
      const response = await axios.get(`${API_URL}/api/results/${id}?t=${Date.now()}`);
      setResults(response.data);
      
      // Load preview data after results are loaded
      if (response.data) {
        loadPreviewData(response.data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreviewData = async (data = null) => {
    if (!id) return;
    
    setPreviewLoading(true);
    try {
      const dataToUse = data || results?.results || results;
      const filename = dataToUse?.filename || '';
      const isArchiveFile = /\.(zip|rar|7z|tar|gz|bz2)$/i.test(filename);
      
      // Check if this requires Docker-based secure preview (for certain file types)
      const isDockersecureFile = /\.(pdf|docx|xlsx|pptx|exe|dll|msi|apk|deb|rpm|dmg|pkg|jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico)$/i.test(filename);
      console.log('🔍 isDockersecureFile check:', { filename, isDockersecureFile, isArchiveFile });
      
      // Force PPTX files to use Docker preview
      if (filename.toLowerCase().endsWith('.pptx')) {
        console.log('🎯 Forcing PPTX to use Docker preview');
      }
      
      console.log('🔍 DEBUG - Data structure:', { 
        results_keys: Object.keys(results || {}), 
        dataToUse_keys: Object.keys(dataToUse || {}),
        filename, 
        isArchiveFile, 
        isDockersecureFile, 
        timestamp: new Date().toISOString() 
      });
      
      // Debug: Check what filename properties are available
      console.log('🔍 DEBUG - Filename search:', {
        'dataToUse.filename': dataToUse?.filename,
        'dataToUse.file_name': dataToUse?.file_name,
        'dataToUse.name': dataToUse?.name,
        'dataToUse.original_filename': dataToUse?.original_filename,
        'dataToUse.original_name': dataToUse?.original_name,
        'dataToUse.analysis_id': dataToUse?.analysis_id,
        'dataToUse.id': dataToUse?.id
      });
      
      // For archive files or secure files, skip file-content endpoint and go directly to Docker preview endpoint
      if (isArchiveFile || isDockersecureFile) {
        console.log('🐳 Using Docker-based secure preview for:', filename);
        // Skip file-content endpoint for files that need Docker isolation
        // Go directly to preview endpoint
        try {
          // Add cache-busting parameter to ensure fresh data
          const response = await axios.get(`${API_URL}/preview/${id}?t=${Date.now()}`);
          console.log('🔍 Docker preview response:', response.data);
          if (response.data && (response.data.success || response.data.preview_type)) {
            console.log('✅ Setting preview data:', response.data.preview_type);
            setPreviewData(response.data);
            setPreviewLoading(false);
            return;
          } else {
            console.log('❌ Not setting preview data:', response.data);
          }
        } catch (error) {
console.error('Error loading Docker preview:', error);
        }
      } else {
        try {
          // First try to get file content directly for non-archive files
          const contentResponse = await axios.get(`${API_URL}/api/file-content/${id}`);
          
          if (contentResponse.data.success) {
            const contentData = contentResponse.data;
            const previewData = {
              preview_available: true,
              preview_type: contentData.content_type,
              content: contentData.content,
              filename: contentData.filename,
              file_size: contentData.file_size,
              base64_preview: contentData.content_type === 'image' ? contentData.content : null,
              text_content: contentData.content_type === 'text' ? contentData.content : null,
              mime_type: contentData.mime_type,
              // Add video-specific metadata
              metadata: contentData.content_type === 'video' ? {
                duration: 0,
                dimensions: 'Unknown',
                fps: 0,
                codec: 'Unknown'
              } : null
            };
            
            console.log('🖼️ Setting preview data from direct API:', {
              preview_type: previewData.preview_type,
              has_base64_preview: !!previewData.base64_preview,
              filename: previewData.filename,
              mime_type: previewData.mime_type,
              content_length: contentData.content ? contentData.content.length : 0
            });
            
            setPreviewData(previewData);
            setPreviewLoading(false);
            return;
          }
        } catch (contentError) {
          console.log('File content endpoint failed, trying Docker preview endpoint:', contentError.message);
        }
      }
      
      // Fallback to original preview endpoint
      try {
        // Add cache-busting parameter to ensure fresh data
        const response = await axios.get(`${API_URL}/preview/${id}?t=${Date.now()}`);
        if (response.data.success) {
          setPreviewData(response.data);
        }
      } catch (error) {
        console.error('Error loading preview:', error);
      }
    } catch (error) {
      console.error('Error loading preview data:', error);
    } finally {
      setPreviewLoading(false);
    }
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

  const fetchArchiveFileContent = async (filePath, file) => {
    try {
      const response = await axios.post(`${API_URL}/api/archive-file-content`, {
        analysis_id: id,
        file_path: filePath
      });
      
      if (response.data.success) {
        setArchiveFileContent({
          ...response.data,
          file_name: file.name,
          file_type: file.type
        });
      }
    } catch (error) {
      console.error('Error fetching archive file content:', error);
    }
  };

  const getFileIcon = (type, extension) => {
    const ext = extension?.toLowerCase() || '';
    
    if (type === 'image' || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(ext)) {
      return <FaFileImage className="file-icon image" />;
    } else if (type === 'video' || /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(ext)) {
      return <FaFileVideo className="file-icon video" />;
    } else if (type === 'audio' || /\.(mp3|wav|flac|aac|ogg|wma)$/i.test(ext)) {
      return <FaFileAudio className="file-icon audio" />;
    } else if (type === 'pdf' || /\.pdf$/i.test(ext)) {
      return <FaFilePdf className="file-icon pdf" />;
    } else if (type === 'archive' || /\.(zip|rar|7z|tar|gz|bz2)$/i.test(ext)) {
      return <FaFileArchive className="file-icon archive" />;
    } else if (type === 'document' || /\.(doc|docx|txt|rtf)$/i.test(ext)) {
      return <FaFileWord className="file-icon document" />;
    } else if (type === 'spreadsheet' || /\.(xls|xlsx|csv)$/i.test(ext)) {
      return <FaFileExcel className="file-icon spreadsheet" />;
    } else if (type === 'presentation' || /\.(ppt|pptx)$/i.test(ext)) {
      return <FaFilePowerpoint className="file-icon presentation" />;
    } else if (type === 'code' || /\.(js|jsx|ts|tsx|py|java|cpp|c|h|css|html|xml|json)$/i.test(ext)) {
      return <FaFileCode className="file-icon code" />;
    } else {
      return <FaFile className="file-icon generic" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const getFileType = () => {
    const filename = results?.file_info?.filename || results?.filename;
    const storedType = results?.file_info?.type || results?.file_type;
    
    // If we have a stored type and it's not 'Unknown', use it
    if (storedType && storedType !== 'Unknown') {
      return storedType;
    }
    
    // Otherwise, determine from filename extension
    return getFileTypeFromExtension(filename);
  };


  if (loading) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <h2>Loading Analysis Results...</h2>
            <p>Please wait while we process your file</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Analysis Not Found</h2>
            <p>The requested analysis could not be found.</p>
            <button onClick={() => navigate('/')} className="back-btn">
              <FaArrowLeft />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging for image preview
  console.log('🖼️ Image preview check:', {
    preview_type: previewData?.preview_type,
    has_base64_preview: !!previewData?.base64_preview,
    base64_preview_length: previewData?.base64_preview?.length || 0,
    shouldShowImage: previewData?.preview_type === 'image' && (previewData?.image_base64 || previewData?.base64_preview),
    shouldShowVideo: previewData?.preview_type === 'video' && (previewData?.video_base64 || previewData?.base64_preview),
    previewData_keys: Object.keys(previewData || {}),
    full_previewData: previewData
  });

  return (
    <div className="results-page">
      <div className="results-container">
        {/* Navigation Header */}
        <div className="nav-header">
          <div className="header-nav">
            <button onClick={() => navigate('/')} className="back-button">
              <FaArrowLeft />
            </button>
            <div className="breadcrumb">
              <span>Home</span>
              <span className="separator">/</span>
              <span className="current">Analysis Results</span>
            </div>
          </div>
        </div>

        {/* Premium File Information Hero Section */}
        <div className="file-hero-section">
          <div className="file-hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          <div className="file-hero-content">
            <div className="file-hero-header">
              <h1 className="file-hero-title">
                <span className="file-title-part-1">File Analysis</span>
                <span className="file-title-part-2">& Security Report</span>
              </h1>
              <p className="file-hero-subtitle">
                Comprehensive threat assessment and detailed security analysis
              </p>
            </div>
            
            <div className="file-info-box">
              <div className="file-text-container">
                <div className="file-label-text">Analyzed File</div>
                <div className="file-name">{results?.file_info?.filename || results?.filename || 'Unknown File'}</div>
              </div>
              <div className="analysis-badge">
                <div className="analysis-id-text">Analysis ID</div>
                <div className="analysis-id-value">{id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* File Stats Bar */}
        <div className="file-stats-bar">
          <div className="file-stats-grid">
            <div className="file-stat-item">
              <div className="file-stat-icon">
                <FaFile />
              </div>
              <div className="file-stat-content">
                <div className="file-stat-value">{formatFileSize(results?.file_info?.size || results?.file_size || 0)}</div>
                <div className="file-stat-label">File Size</div>
              </div>
            </div>
            <div className="file-stat-item">
              <div className="file-stat-icon">
                <FaFile />
              </div>
              <div className="file-stat-content">
                <div className="file-stat-value">{getFileType()}</div>
                <div className="file-stat-label">File Type</div>
              </div>
            </div>
            <div className="file-stat-item">
              <div className="file-stat-icon">
                <FaCogs />
              </div>
              <div className="file-stat-content">
                <div className="file-stat-value">{results?.results?.summary?.engines_used || 0}</div>
                <div className="file-stat-label">Engines Used</div>
              </div>
            </div>
            <div className="file-stat-item">
              <div className="file-stat-icon">
                <FaExclamationTriangle />
              </div>
              <div className="file-stat-content">
                <div className="file-stat-value">{results?.results?.summary?.threat_detected ? 'Threat' : 'Safe'}</div>
                <div className="file-stat-label">Status</div>
              </div>
            </div>
          </div>
        </div>


        {/* File Preview Section - Simple container in the middle */}
        <div className="file-preview-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#ffffff', fontSize: '1.25rem', fontWeight: '600' }}>File Preview</h3>
          
          {previewLoading ? (
            <div className="preview-loading" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <FaSpinner className="spinning" />
              <h4>Loading Preview...</h4>
              <p>Generating secure file preview in isolated container</p>
            </div>
              ) : !previewData || (!previewData.preview_available && !previewData.content && !previewData.text_content && !previewData.base64_preview && !previewData.pptx_html && !previewData.docx_html && !previewData.xlsx_html && !(previewData.preview_content && previewData.preview_type === 'document') && !(previewData.preview_type === 'pdf' && (previewData.pdf_base64 || previewData.base64_preview)) && !(previewData.preview_type === 'image' && (previewData.image_base64 || previewData.base64_preview)) && !(previewData.preview_type === 'video' && (previewData.video_base64 || previewData.base64_preview))) ? (
            <div className="preview-error" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem',
              background: 'rgba(255, 71, 87, 0.1)',
              border: '1px solid rgba(255, 71, 87, 0.3)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <FaExclamationTriangle style={{ fontSize: '2rem', color: '#ff4757', marginBottom: '1rem' }} />
              <h4>Preview Not Available</h4>
              <p>Unable to load file preview. Please try again.</p>
            </div>
          ) : (
            <div className="preview-container" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%'
            }}>
              {/* Image Preview */}
              {previewData?.preview_type === 'image' && (previewData?.image_base64 || previewData?.base64_preview) && (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                      🖼️ Image Document • {previewData.filename} • {formatFileSize(previewData.file_size)}
                    </div>
                    <button
                      onClick={() => setIsImageFullscreen(true)}
                      style={{
                        background: 'linear-gradient(135deg, #3b43fe 0%, #0074ff 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(59, 67, 254, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #2d35e8 0%, #0056b3 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(59, 67, 254, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #3b43fe 0%, #0074ff 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(59, 67, 254, 0.3)';
                      }}
                    >
                      <FaExpand />
                      Fullscreen
                    </button>
                  </div>
                  <div style={{ 
                    background: '#ffffff', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <img 
                      src={`data:${previewData.mime_type || 'image/jpeg'};base64,${previewData.image_base64 || previewData.base64_preview}`}
                      alt={previewData.filename || 'Preview'}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '500px',
                        height: 'auto', 
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {previewData?.preview_type === 'video' && (previewData?.video_base64 || previewData?.base64_preview) && (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                      🎥 Video Document • {previewData.filename} • {formatFileSize(previewData.file_size)}
                    </div>
                    <button
                      onClick={() => setIsVideoFullscreen(true)}
                      style={{
                        background: 'linear-gradient(135deg, #3b43fe 0%, #0074ff 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(59, 67, 254, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #2d35e8 0%, #0056b3 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(59, 67, 254, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #3b43fe 0%, #0074ff 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(59, 67, 254, 0.3)';
                      }}
                    >
                      <FaExpand />
                      Fullscreen
                    </button>
                  </div>
                  <div style={{ 
                    background: '#ffffff', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <video 
                      src={`data:${previewData.mime_type || 'video/mp4'};base64,${previewData.video_base64 || previewData.base64_preview}`}
                      controls
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '500px',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    >
                      Your browser doesn't support video playback.
                    </video>
                  </div>
                </div>
              )}

              {/* PDF Preview */}
              {previewData?.preview_type === 'pdf' && (previewData?.pdf_base64 || previewData?.base64_preview) && (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                      📄 PDF Document • {previewData.filename} • {formatFileSize(previewData.file_size)}
                    </div>
                    <button
                      onClick={() => setIsPdfFullscreen(true)}
                      style={{
                        background: 'linear-gradient(135deg, #3b43fe 0%, #0074ff 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(59, 67, 254, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #2d35e8 0%, #0056b3 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(59, 67, 254, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #3b43fe 0%, #0074ff 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(59, 67, 254, 0.3)';
                      }}
                    >
                      <FaExpand />
                      Fullscreen
                    </button>
                  </div>
                  <div style={{ 
                    background: '#ffffff', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    height: '500px'
                  }}>
                    <object
                      data={`data:application/pdf;base64,${previewData.pdf_base64 || previewData.base64_preview}`}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    >
                      <iframe
                        src={`data:application/pdf;base64,${previewData.pdf_base64 || previewData.base64_preview}`}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                        title="PDF Viewer"
                      >
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                          <p>Your browser doesn't support PDF viewing.</p>
                          <p>Please download the file to view it.</p>
                        </div>
                      </iframe>
                    </object>
                  </div>
                </div>
              )}


              {/* DOCX Preview using SmartPreviewSwitcher */}
              {previewData?.preview_type === 'docx' && (
                <div style={{ width: '100%', height: '600px' }}>
                  <SmartPreviewSwitcher
                    fileContent={null}
                    previewData={previewData}
                    analysisId={id}
                    onClose={() => {}}
                    imageZoom={1}
                    setImageZoom={() => {}}
                    imagePosition={{ x: 0, y: 0 }}
                    setImagePosition={() => {}}
                    isDragging={false}
                    setIsDragging={() => {}}
                    dragStart={{ x: 0, y: 0 }}
                    setDragStart={() => {}}
                    resetImageZoom={() => {}}
                    handleImageWheel={() => {}}
                    handleImageMouseDown={() => {}}
                    handleImageMouseMove={() => {}}
                    handleImageMouseUp={() => {}}
                  />
                </div>
              )}

              {/* XLSX Preview using SmartPreviewSwitcher */}
              {previewData?.preview_type === 'xlsx' && (
                <div style={{ width: '100%', height: '600px' }}>
                  <SmartPreviewSwitcher
                    fileContent={null}
                    previewData={previewData}
                    analysisId={id}
                    onClose={() => {}}
                    imageZoom={1}
                    setImageZoom={() => {}}
                    imagePosition={{ x: 0, y: 0 }}
                    setImagePosition={() => {}}
                    isDragging={false}
                    setIsDragging={() => {}}
                    dragStart={{ x: 0, y: 0 }}
                    setDragStart={() => {}}
                    resetImageZoom={() => {}}
                    handleImageWheel={() => {}}
                    handleImageMouseDown={() => {}}
                    handleImageMouseMove={() => {}}
                    handleImageMouseUp={() => {}}
                  />
                </div>
              )}


              {/* Audio Preview using SmartPreviewSwitcher */}
              {previewData?.preview_type === 'audio' && (
                <div style={{ width: '100%', height: '400px' }}>
                  <SmartPreviewSwitcher
                    fileContent={null}
                    previewData={previewData}
                    analysisId={id}
                    onClose={() => {}}
                    imageZoom={1}
                    setImageZoom={() => {}}
                    imagePosition={{ x: 0, y: 0 }}
                    setImagePosition={() => {}}
                    isDragging={false}
                    setIsDragging={() => {}}
                    dragStart={{ x: 0, y: 0 }}
                    setDragStart={() => {}}
                    resetImageZoom={() => {}}
                    handleImageWheel={() => {}}
                    handleImageMouseDown={() => {}}
                    handleImageMouseMove={() => {}}
                    handleImageMouseUp={() => {}}
                  />
                </div>
              )}

              {/* PPTX Preview using SmartPreviewSwitcher */}
              {previewData?.preview_type === 'pptx' && (
                <div style={{ width: '100%', height: '100%', flex: 1 }}>
                  <SmartPreviewSwitcher
                    fileContent={null}
                    previewData={previewData}
                    analysisId={id}
                    onClose={() => {}}
                    imageZoom={1}
                    setImageZoom={() => {}}
                    imagePosition={{ x: 0, y: 0 }}
                    setImagePosition={() => {}}
                    isDragging={false}
                    setIsDragging={() => {}}
                    dragStart={{ x: 0, y: 0 }}
                    setDragStart={() => {}}
                    resetImageZoom={() => {}}
                    handleImageWheel={() => {}}
                    handleImageMouseDown={() => {}}
                    handleImageMouseMove={() => {}}
                    handleImageMouseUp={() => {}}
                  />
                </div>
              )}

              {/* Text Preview using SmartPreviewSwitcher */}
              {previewData?.preview_type === 'text' && (
                <div style={{ width: '100%', height: '600px' }}>
                  <SmartPreviewSwitcher
                    fileContent={null}
                    previewData={previewData}
                    analysisId={id}
                    onClose={() => {}}
                    imageZoom={1}
                    setImageZoom={() => {}}
                    imagePosition={{ x: 0, y: 0 }}
                    setImagePosition={() => {}}
                    isDragging={false}
                    setIsDragging={() => {}}
                    dragStart={{ x: 0, y: 0 }}
                    setDragStart={() => {}}
                    resetImageZoom={() => {}}
                    handleImageWheel={() => {}}
                    handleImageMouseDown={() => {}}
                    handleImageMouseMove={() => {}}
                    handleImageMouseUp={() => {}}
                  />
                </div>
              )}

              {/* Archive Preview using ArchiveViewer */}
              {previewData?.preview_type === 'archive' && previewData?.archive_contents && (
                <div style={{ width: '100%', height: '600px' }}>
                  <ArchiveViewer
                    fileContent={null}
                    previewData={previewData}
                    analysisId={id}
                    onClose={() => {}}
                    detectedType="archive"
                  />
                </div>
              )}

              {/* Document Preview (Docker processed files) */}
              {previewData?.preview_type === 'document' && previewData?.preview_content && (
                <div className="document-preview">
                  <div className="document-header">
                    <h3>📄 Document Preview</h3>
                  </div>
                  <div className="content-text">
                    {previewData.preview_content}
                  </div>
                </div>
              )}

              {/* Generic Content Preview */}
              {previewData?.preview_content && !previewData?.base64_preview && !previewData?.text_content && previewData?.preview_type !== 'archive' && previewData?.preview_type !== 'document' && (
                <div style={{ width: '100%' }}>
                  <pre style={{ 
                    background: 'rgba(0, 0, 0, 0.3)', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    overflow: 'auto',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}>
                    {previewData.preview_content}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Archive Browser Section */}
        {results?.archive_files && results.archive_files.length > 0 && (
          <div className="archive-browser-section">
            <div className="archive-header">
              <h3>Archive Contents</h3>
              <div className="archive-stats">
                <span>{results.archive_files.length} files</span>
              </div>
            </div>
            
            <div className="file-list">
              <div className="file-list-header">
                <div>Name</div>
                <div>Size</div>
                <div>Actions</div>
              </div>
              
              {results.archive_files.map((file, index) => (
                <div key={index} className="file-item" onClick={() => fetchArchiveFileContent(file.path, file)}>
                  <div className="file-item-content">
                    <div className="file-icon-container">
                      {getFileIcon(file.type, file.extension)}
                    </div>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        <span>{file.type}</span>
                        {file.compressed_size && (
                          <span className="file-compressed">
                            Compressed: {formatFileSize(file.compressed_size)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchArchiveFileContent(file.path, file);
                      }}
                    >
                      <FaEye />
                    </button>
                  </div>
                  <div>{formatFileSize(file.size)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archive File Content Viewer */}
        {archiveFileContent && (
          <div className="archive-file-viewer">
            <div className="archive-file-header">
              <div className="archive-file-info">
                <div className="archive-file-icon">
                  {getFileIcon(archiveFileContent.file_type, archiveFileContent.file_name)}
                </div>
                <div className="archive-file-details">
                  <h4>{archiveFileContent.file_name}</h4>
                  <div className="archive-file-meta">
                    <span>Type: {archiveFileContent?.content_type || 'Unknown'}</span>
                    <span>Size: {formatFileSize(archiveFileContent?.file_size || 0)}</span>
                  </div>
                </div>
              </div>
              <button 
                className="close-btn"
                onClick={() => setArchiveFileContent(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="archive-file-content">
              <pre className="generic-content">{archiveFileContent?.content || 'No content available'}</pre>
            </div>
          </div>
        )}

        {/* NoVNC Viewer */}
        {showNoVNC && (
          <div className="novnc-container">
            <div className="novnc-header">
              <h3>Secure Browser Preview</h3>
              <button onClick={() => setShowNoVNC(false)} className="close-btn">
                <FaTimes />
              </button>
            </div>
            <NoVNCViewer url={results.url} />
          </div>
        )}

        {/* Modern Action Bar */}
        <div className="action-bar">
          {!results.is_url && (
            <button 
              onClick={() => navigate(`/preview/${id}`)} 
              className="action-btn tertiary"
            >
              <FaEye />
              <span>Full Preview</span>
            </button>
          )}
        </div>
      </div>

      {/* PDF Fullscreen Modal - Outside main container */}
      {isPdfFullscreen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px'
        }}>
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>
              📄 {previewData?.filename} • {formatFileSize(previewData?.file_size)}
            </div>
            <button
              onClick={() => setIsPdfFullscreen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaTimes />
              Close
            </button>
          </div>
          
          {/* Modal Content */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ flex: 1, minHeight: 0 }}>
              <object
                data={`data:application/pdf;base64,${previewData?.pdf_base64 || previewData?.base64_preview}`}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              >
                <iframe
                  src={`data:application/pdf;base64,${previewData?.pdf_base64 || previewData?.base64_preview}`}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="PDF Viewer"
                >
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    <p>Your browser doesn't support PDF viewing.</p>
                    <p>Please download the file to view it.</p>
                  </div>
                </iframe>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Image Fullscreen Modal - Outside main container */}
      {isImageFullscreen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px'
        }}>
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>
              🖼️ {previewData?.filename} • {formatFileSize(previewData?.file_size)}
            </div>
            <button
              onClick={() => setIsImageFullscreen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaTimes />
              Close
            </button>
          </div>
          
          {/* Modal Content */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}>
            <img 
              src={`data:${previewData?.mime_type || 'image/jpeg'};base64,${previewData?.image_base64 || previewData?.base64_preview}`}
              alt={previewData?.filename || 'Preview'}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
        </div>
      )}

      {/* Video Fullscreen Modal - Outside main container */}
      {isVideoFullscreen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px'
        }}>
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>
              🎥 {previewData?.filename} • {formatFileSize(previewData?.file_size)}
            </div>
            <button
              onClick={() => setIsVideoFullscreen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaTimes />
              Close
            </button>
          </div>
          
          {/* Modal Content */}
          <div style={{
            flex: 1,
            background: '#000000',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}>
            <video 
              src={`data:${previewData?.mime_type || 'video/mp4'};base64,${previewData?.video_base64 || previewData?.base64_preview}`}
              controls
              autoPlay
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                height: 'auto',
                borderRadius: '8px'
              }}
            >
              Your browser doesn't support video playback.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;