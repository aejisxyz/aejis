import React, { useState, useEffect } from 'react';
import { FaFilePowerpoint, FaExpand, FaCompress, FaFileAlt } from 'react-icons/fa';
import './ViewerStyles.css';

const PPTXViewer = ({ previewData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  console.log('📊 PPTXViewer rendered with previewData:', previewData);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!previewData) {
    return (
      <div className="pptx-viewer">
        <div className="viewer-error">
          <div className="error-icon">📊</div>
          <h3>No PPTX data available</h3>
          <p>Unable to load PowerPoint presentation data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pptx-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      {previewData.content && (
        <pre className="pptx-text">{previewData.content}</pre>
      )}
    </div>
  );
};

export default PPTXViewer;