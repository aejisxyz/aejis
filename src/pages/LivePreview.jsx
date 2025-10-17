import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Globe, Loader, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';
import './LivePreview.css';

const LivePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');
  const [vncUrl, setVncUrl] = useState('');

  useEffect(() => {
    initializeBrowserSession();
  }, [id]);

  const initializeBrowserSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get the URL from the analysis results
      const resultsResponse = await axios.get(`${API_URL}/url-results-data/${id}`);
      const targetUrl = resultsResponse.data?.target_url || resultsResponse.data?.results?.url_info?.url || resultsResponse.data?.url;
      
      if (!targetUrl) {
        setError('Target URL not found in analysis results');
        setLoading(false);
        return;
      }

      setUrl(targetUrl);

      // Start browser isolation session
      const browserResponse = await axios.get(`${API_URL}/browser/${id}`);
      
      if (browserResponse.data.success) {
        // Use VNC with auto-connect and full screen settings
        const vncPath = `${API_URL}/vnc-auto-connect.html?url=${encodeURIComponent(targetUrl)}`;
        setVncUrl(vncPath);
        
        // Wait for VNC to initialize
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        setError(browserResponse.data.error || 'Failed to start browser isolation');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error initializing browser session:', err);
      // If browser isolation fails, try direct VNC connection
      if (url) {
        const vncPath = `${API_URL}/vnc-auto-connect.html?url=${encodeURIComponent(url)}`;
        setVncUrl(vncPath);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        setError('Failed to connect to browser isolation service. Please ensure Docker is running.');
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    // Stop browser session
    axios.post(`${API_URL}/browser/${id}/stop`)
      .then(() => navigate(-1))
      .catch(() => navigate(-1));
  };

  if (error) {
    return (
      <div className="live-preview-page">
        <div className="error-container">
          <AlertCircle size={64} className="error-icon" />
          <h2>Unable to Load Preview</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="live-preview-page">
      {/* Minimal Header Bar */}
      <div className="preview-header">
        <div className="header-left">
          <Shield className="header-icon" size={20} />
          <span className="header-text">Aejis Isolated Browser</span>
          <div className="separator">|</div>
          <Globe className="url-icon" size={18} />
          <span className="preview-url">{url || 'Loading...'}</span>
        </div>
        <button onClick={handleClose} className="close-button" title="Close Preview">
          <X size={20} />
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <Loader className="loading-spinner" size={48} />
            <h3>Initializing Isolated Browser</h3>
            <p>Setting up secure environment with Chromium in kiosk mode...</p>
            <div className="loading-steps">
              <div className="loading-step">✓ Container isolated</div>
              <div className="loading-step">✓ VNC server ready</div>
              <div className="loading-step">✓ Chromium launching...</div>
              <div className="loading-step active">→ Loading website...</div>
            </div>
          </div>
        </div>
      )}

      {/* VNC Iframe - Full Screen */}
      {vncUrl && (
        <iframe
          src={vncUrl}
          className="vnc-iframe"
          title="Isolated Browser Preview"
          allow="fullscreen"
          onLoad={() => {
            // Hide VNC toolbar after load
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }}
        />
      )}

      {/* Security Badge */}
      <div className="security-badge">
        <Shield size={14} />
        <span>Isolated & Protected</span>
      </div>
    </div>
  );
};

export default LivePreview;

