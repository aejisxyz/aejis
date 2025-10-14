import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaFile, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, isUploading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.log', '.json', '.xml', '.csv'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z'],
      'application/x-tar': ['.tar'],
      'application/gzip': ['.gz'],
      'text/javascript': ['.js'],
      'text/html': ['.html'],
      'text/css': ['.css'],
      'application/x-php': ['.php'],
      'text/x-python': ['.py'],
      'text/x-java': ['.java'],
      'text/x-c': ['.c', '.cpp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('powerpoint')) return '📈';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    if (fileType.includes('text')) return '📄';
    if (fileType.includes('javascript')) return '⚡';
    if (fileType.includes('python')) return '🐍';
    return '📁';
  };

  return (
    <div className="file-upload-container">
      <motion.div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? 'drag-active' : ''} ${isDragReject ? 'drag-reject' : ''} ${isUploading ? 'uploading' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <input {...getInputProps()} />
        
        <div className="upload-content">
          {isUploading ? (
            <motion.div
              className="uploading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FaSpinner className="spinner" />
              <h3>Uploading File...</h3>
              <p>Please wait while we process your file</p>
            </motion.div>
          ) : (
            <>
              <div className="upload-icon">
                <FaUpload />
              </div>
              
              <div className="upload-text">
                {isDragActive ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3>Drop your file here</h3>
                    <p>Release to upload</p>
                  </motion.div>
                ) : (
                  <>
                    <h3>Drag & drop your file here</h3>
                    <p>or click to browse</p>
                  </>
                )}
              </div>
              
              <div className="upload-info">
                <div className="supported-formats">
                  <h4>Supported Formats:</h4>
                  <div className="format-tags">
                    <span>Documents</span>
                    <span>Images</span>
                    <span>Archives</span>
                    <span>Code</span>
                    <span>Media</span>
                  </div>
                </div>
                
                <div className="file-limits">
                  <p>Maximum file size: <strong>50MB</strong></p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {fileRejections.length > 0 && (
        <motion.div
          className="upload-errors"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="error-header">
            <FaExclamationTriangle />
            <h4>Upload Errors</h4>
          </div>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="error-item">
              <div className="error-file">
                <span className="file-icon">{getFileIcon(file.type)}</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({formatFileSize(file.size)})</span>
              </div>
              <div className="error-messages">
                {errors.map((error, index) => (
                  <p key={index} className="error-message">
                    {error.code === 'file-too-large' 
                      ? 'File is too large (max 50MB)'
                      : error.code === 'file-invalid-type'
                      ? 'File type not supported'
                      : error.message
                    }
                  </p>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <div className="upload-features">
        <motion.div
          className="feature"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FaCheckCircle />
          <span>Secure Upload</span>
        </motion.div>
        
        <motion.div
          className="feature"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FaCheckCircle />
          <span>70+ Engines</span>
        </motion.div>
        
        <motion.div
          className="feature"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FaCheckCircle />
          <span>AI Analysis</span>
        </motion.div>
        
        <motion.div
          className="feature"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FaCheckCircle />
          <span>Real-time Results</span>
        </motion.div>
      </div>
    </div>
  );
};

export default FileUpload;
