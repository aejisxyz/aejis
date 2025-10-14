import React from 'react';
import ImageViewer from './viewers/ImageViewer';
import PDFViewer from './viewers/PDFViewer';
import DOCXViewer from './viewers/DOCXViewer';
import XLSXViewer from './viewers/XLSXViewer';
import PPTXViewer from './viewers/PPTXViewer';
import TextViewer from './viewers/TextViewer';
import CodeViewer from './viewers/CodeViewer';
import DocumentViewer from './viewers/DocumentViewer';
import ArchiveViewer from './viewers/ArchiveViewer';
import BinaryViewer from './viewers/BinaryViewer';
import VideoViewer from './viewers/VideoViewer';
import AudioViewer from './viewers/AudioViewer';
import FontViewer from './viewers/FontViewer';
import SpreadsheetViewer from './viewers/SpreadsheetViewer';
import PresentationViewer from './viewers/PresentationViewer';
import ExecutableViewer from './viewers/ExecutableViewer';
import { FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';

const SmartPreviewSwitcher = ({ 
  fileContent, 
  previewData, 
  analysisId,
  onClose,
  imageZoom,
  setImageZoom,
  imagePosition,
  setImagePosition,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  resetImageZoom,
  handleImageWheel,
  handleImageMouseDown,
  handleImageMouseMove,
  handleImageMouseUp
}) => {
  // Determine which viewer to use based on file type and content
  const getViewer = () => {
    // If no fileContent, try to use previewData
    if (!fileContent && !previewData) {
      return <NoContentViewer />;
    }

    // Use fileContent if available, otherwise fall back to previewData
    const dataSource = fileContent || previewData;
    const contentType = dataSource.content_type || dataSource.preview_type;
    const fileType = dataSource.file_type?.toLowerCase();
    const filename = dataSource.filename?.toLowerCase() || '';

    // Smart file type detection
    const detectedType = detectFileType(contentType, fileType, filename);
    console.log('🔍 SmartPreviewSwitcher detected type:', detectedType, 'for contentType:', contentType, 'fileType:', fileType, 'filename:', filename);

    const commonProps = {
      fileContent,
      previewData,
      analysisId,
      onClose,
      detectedType
    };

    const imageProps = {
      ...commonProps,
      imageZoom,
      setImageZoom,
      imagePosition,
      setImagePosition,
      isDragging,
      setIsDragging,
      dragStart,
      setDragStart,
      resetImageZoom,
      handleImageWheel,
      handleImageMouseDown,
      handleImageMouseMove,
      handleImageMouseUp
    };

    switch (detectedType) {
      case 'image':
        return <ImageViewer {...imageProps} />;
      
      case 'pdf':
        return <PDFViewer {...commonProps} />;
      
      case 'docx':
        return <DOCXViewer {...commonProps} />;
      
      case 'xlsx':
        return <XLSXViewer {...commonProps} />;
      
      case 'pptx':
        console.log('🎯 PPTX Viewer being rendered with data:', previewData);
        return <PPTXViewer {...commonProps} />;
      
      case 'text':
        return <TextViewer {...commonProps} />;
      
      case 'code':
        return <CodeViewer {...commonProps} />;
      
      case 'document':
        return <DocumentViewer {...commonProps} />;
      
      case 'archive':
        return <ArchiveViewer {...commonProps} />;
      
      case 'video':
        return <VideoViewer {...commonProps} />;
      
      case 'audio':
        return <AudioViewer {...commonProps} />;
      
      case 'font':
        return <FontViewer {...commonProps} />;
      
      case 'spreadsheet':
        return <SpreadsheetViewer {...commonProps} />;
      
      case 'presentation':
        return <PresentationViewer {...commonProps} />;
      
      case 'executable':
        return <ExecutableViewer {...commonProps} />;
      
      case 'binary':
        return <BinaryViewer {...commonProps} />;
      
      default:
        return <UnsupportedViewer contentType={contentType} fileType={fileType} filename={filename} />;
    }
  };

  return (
    <div className="smart-preview-switcher">
      {getViewer()}
    </div>
  );
};

// Smart file type detection logic
const detectFileType = (contentType, fileType, filename) => {
  // Check content type first (most reliable)
  if (contentType) {
    switch (contentType) {
      case 'image':
        return 'image';
      case 'pdf':
        return 'pdf';
      case 'docx':
        return 'docx';
      case 'xlsx':
        return 'xlsx';
      case 'pptx':
        return 'pptx';
      case 'text':
        return 'text';
      case 'document':
        return 'document';
      case 'archive':
        return 'archive';
      case 'video':
        return 'video';
      case 'audio':
        return 'audio';
      case 'font':
        return 'font';
      case 'spreadsheet':
        return 'spreadsheet';
      case 'presentation':
        return 'presentation';
      case 'executable':
        return 'executable';
      case 'binary':
        return 'binary';
    }
  }

  // Fall back to file extension detection
  const extension = filename.split('.').pop() || fileType?.replace('.', '');
  
  if (extension) {
    // Image extensions
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff', 'tif'].includes(extension)) {
      return 'image';
    }
    
    // PDF
    if (extension === 'pdf') {
      return 'pdf';
    }
    
    // DOCX files
    if (extension === 'docx') {
      return 'docx';
    }
    
    // XLSX files
    if (extension === 'xlsx') {
      return 'xlsx';
    }
    
    // PPTX files
    if (extension === 'pptx') {
      return 'pptx';
    }
    
    // Text files
    if (['txt', 'log', 'json', 'xml', 'csv', 'py', 'js', 'html', 'css', 'md', 'readme', 'tsv', 'yaml', 'yml', 'ini', 'cfg', 'conf'].includes(extension)) {
      return 'text';
    }
    
    // Code files
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'html', 'css', 'scss', 'sass', 'less', 'sql', 'sh', 'bash', 'ps1', 'bat', 'cmd'].includes(extension)) {
      return 'code';
    }
    
    // Document files (excluding docx which has its own handler)
    if (['doc', 'rtf', 'odt', 'pages'].includes(extension)) {
      return 'document';
    }
    
    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'dmg', 'iso', 'deb', 'rpm'].includes(extension)) {
      return 'archive';
    }
    
    // Video files
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'mpg', 'mpeg'].includes(extension)) {
      return 'video';
    }
    
    // Audio files
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'opus', 'aiff'].includes(extension)) {
      return 'audio';
    }
    
    // Font files
    if (['ttf', 'otf', 'woff', 'woff2', 'eot', 'fon', 'fnt'].includes(extension)) {
      return 'font';
    }
    
    // Spreadsheet files
    if (['xls', 'xlsx', 'ods', 'numbers', 'csv'].includes(extension)) {
      return 'spreadsheet';
    }
    
    // Presentation files
    if (['ppt', 'pptx', 'odp', 'key'].includes(extension)) {
      return 'presentation';
    }
    
    // Executable files
    if (['exe', 'msi', 'dmg', 'deb', 'rpm', 'app', 'apk', 'ipa'].includes(extension)) {
      return 'executable';
    }
  }
  
  // Default to binary for unknown types
  return 'binary';
};

// No content fallback component
const NoContentViewer = () => (
  <div className="no-content-viewer">
    <div className="no-content-icon">
      <FaFileAlt />
    </div>
    <h4>No Content Available</h4>
    <p>The file content could not be loaded or displayed.</p>
  </div>
);

// Unsupported file type component
const UnsupportedViewer = ({ contentType, fileType, filename }) => (
  <div className="unsupported-viewer">
    <div className="unsupported-icon">
      <FaExclamationTriangle />
    </div>
    <h4>Unsupported File Type</h4>
    <p>This file type is not yet supported for preview.</p>
    <div className="file-details">
      <div><strong>Content Type:</strong> {contentType || 'Unknown'}</div>
      <div><strong>File Type:</strong> {fileType || 'Unknown'}</div>
      <div><strong>Filename:</strong> {filename || 'Unknown'}</div>
    </div>
  </div>
);

export default SmartPreviewSwitcher;
