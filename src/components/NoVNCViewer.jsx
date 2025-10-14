import React, { useState, useEffect, useRef } from 'react';
import './NoVNCViewer.css';

const NoVNCViewer = ({ analysisId, targetUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    startBrowserSession();
    return () => {
      // Cleanup on unmount
      if (sessionData) {
        stopBrowserSession();
      }
    };
  }, [analysisId]);

  const startBrowserSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/browser/${analysisId}`);
      const data = await response.json();

      if (data.success) {
        setSessionData(data);
        setIsConnected(true);
      } else {
        setError(data.error || 'Failed to start browser session');
      }
    } catch (err) {
      setError('Failed to connect to browser service');
      console.error('Browser session error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopBrowserSession = async () => {
    try {
      await fetch(`http://localhost:5000/browser/${analysisId}/stop`, {
        method: 'POST'
      });
      setIsConnected(false);
    } catch (err) {
      console.error('Failed to stop browser session:', err);
    }
  };

  const handleClose = () => {
    stopBrowserSession();
    onClose();
  };

  const openInNewTab = () => {
    if (sessionData?.vnc_url) {
      window.open(sessionData.vnc_url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="novnc-container">
        <div className="novnc-loading">
          <div className="loading-spinner"></div>
          <p>Starting secure browser session...</p>
          <p className="loading-details">Initializing noVNC container</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="novnc-container">
        <div className="novnc-error">
          <h3>❌ Browser Session Error</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={startBrowserSession} className="retry-btn">
              🔄 Retry
            </button>
            <button onClick={handleClose} className="close-btn">
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="novnc-container">
      <div className="novnc-header">
        <div className="novnc-info">
          <h3>🛡️ Secure Browser Preview</h3>
          <p className="target-url">{targetUrl}</p>
          <div className="status-indicator">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="novnc-controls">
          <button onClick={openInNewTab} className="new-tab-btn" title="Open in new tab">
            🔗 New Tab
          </button>
          <button onClick={handleClose} className="close-btn" title="Close session">
            ✕ Close
          </button>
        </div>
      </div>

      <div className="novnc-viewer">
        {sessionData?.vnc_url ? (
          <iframe
            ref={iframeRef}
            src={sessionData.vnc_url}
            title="Secure Browser Preview"
            className="novnc-iframe"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        ) : (
          <div className="novnc-placeholder">
            <p>No VNC URL available</p>
          </div>
        )}
      </div>

      <div className="novnc-footer">
        <div className="novnc-instructions">
          <h4>🔍 How to use:</h4>
          <ul>
            <li>Navigate to the target URL in the browser window above</li>
            <li>Interact with the website safely in this isolated environment</li>
            <li>All browsing is contained within the secure container</li>
            <li>Click "New Tab" to open in a separate window</li>
          </ul>
        </div>
        <div className="novnc-features">
          <h4>🛡️ Security Features:</h4>
          <ul>
            <li>✅ Complete isolation from your system</li>
            <li>✅ No data persistence</li>
            <li>✅ Extension-free environment</li>
            <li>✅ Real-time threat protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoVNCViewer;

