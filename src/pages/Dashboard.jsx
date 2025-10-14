import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTelegramPlane, FaDesktop, FaCheckCircle, FaCircle, FaLink, FaUnlink, FaCopy, FaExternalLinkAlt, FaFileAlt, FaGlobe, FaEye, FaShieldAlt, FaRobot, FaBolt, FaDownload, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkToken, setLinkToken] = useState('');
  const [checklist, setChecklist] = useState({
    telegram: false,
    desktop: false
  });

  const handleChecklistToggle = (item) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
    
    if (!checklist[item]) {
      toast.success(`${item === 'telegram' ? 'Telegram' : 'Desktop'} marked as complete!`);
    }
  };

  // API URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Handle Telegram linking
  const handleLinkTelegram = async () => {
    try {
      // Call backend API to generate token
      const response = await fetch(`${API_URL}/api/generate-link-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.uid }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLinkToken(data.token);
        setShowLinkModal(true);
        toast.success('Link token generated! Click the button to open Telegram.');
      } else {
        toast.error('Failed to generate link token');
      }
    } catch (error) {
      console.error('Error generating link token:', error);
      toast.error('Backend server not running. Please start it first.');
    }
  };

  // Handle copy token
  const handleCopyToken = () => {
    navigator.clipboard.writeText(linkToken);
    toast.success('Token copied to clipboard!');
  };

  // Handle unlink Telegram
  const handleUnlinkTelegram = async () => {
    try {
      const response = await fetch(`${API_URL}/api/unlink-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.uid }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTelegramLinked(false);
        setTelegramUsername('');
        toast.success('Telegram account unlinked successfully!');
      } else {
        toast.error('Failed to unlink Telegram account');
      }
    } catch (error) {
      console.error('Error unlinking Telegram:', error);
      toast.error('Failed to unlink. Make sure backend is running.');
    }
  };

  // Check if Telegram is already linked (on component mount)
  useEffect(() => {
    const checkTelegramLink = async () => {
      try {
        const response = await fetch(`${API_URL}/api/check-telegram-link/${currentUser.uid}`);
        const data = await response.json();
        
        if (data.success && data.linked) {
          setTelegramLinked(true);
          setTelegramUsername(data.telegram.username || 'User');
        }
      } catch (error) {
        console.error('Error checking Telegram link:', error);
      }
    };
    
    checkTelegramLink();
  }, [currentUser]);

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft />
          Back to Home
        </button>
        <motion.div
          className="dashboard-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* User Info Section */}
          <div className="user-info-card">
            <div className="user-avatar">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <h2>{currentUser.displayName || 'User'}</h2>
              <p>{currentUser.email}</p>
            </div>
          </div>

          {/* Account Linking Section */}
          <div className="linking-section">
            <h3 className="section-title-white">Connected Accounts</h3>
            <p className="section-subtitle">Link your Telegram and Desktop accounts to use Aejis</p>
            
            <div className="account-cards">
              {/* Telegram Account Card */}
              <motion.div 
                className={`account-card ${telegramLinked ? 'linked' : ''}`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="account-icon telegram-icon">
                  <FaTelegramPlane />
                </div>
                <div className="account-info">
                  <h4>Telegram Bot</h4>
                  {telegramLinked ? (
                    <>
                      <p className="linked-status">
                        <FaCheckCircle className="status-icon" />
                        Linked as @{telegramUsername}
                      </p>
                      <button 
                        className="unlink-btn"
                        onClick={handleUnlinkTelegram}
                      >
                        <FaUnlink /> Unlink Account
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="unlinked-status">Not linked</p>
                      <button 
                        className="link-btn"
                        onClick={handleLinkTelegram}
                      >
                        <FaLink /> Link Telegram Account
                      </button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Desktop Application Card */}
              <motion.div 
                className="account-card"
                whileHover={{ scale: 1.01 }}
              >
                <div className="account-icon desktop-icon">
                  <FaDesktop />
                </div>
                <div className="account-info">
                  <h4>Desktop Application</h4>
                  <p className="unlinked-status">Coming Soon</p>
                  <button className="link-btn disabled" disabled>
                    <FaDesktop /> Download Desktop App
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features Showcase - Only show if Telegram is linked */}
          {telegramLinked && (
            <motion.div 
              className="features-showcase telegram-features-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="features-header features-header-left">
                <h3 className="section-title-white">Available Features</h3>
                <p className="section-subtitle">What you can do with @Aejis_Bot</p>
              </div>
              
              <div className="features-list telegram-features-list">
                <div className="feature-item feature-file">
                  <FaCheckCircle className="feature-bullet" />
                  <div className="feature-content-wrapper">
                    <h4 className="feature-title">File Analysis</h4>
                    <p className="feature-description">Scan any file type with 70+ antivirus engines</p>
                  </div>
                </div>

                <div className="feature-item feature-website">
                  <FaCheckCircle className="feature-bullet" />
                  <div className="feature-content-wrapper">
                    <h4 className="feature-title">Website Analysis</h4>
                    <p className="feature-description">Check URLs for phishing and security threats</p>
                  </div>
                </div>

                <div className="feature-item feature-preview">
                  <FaCheckCircle className="feature-bullet" />
                  <div className="feature-content-wrapper">
                    <h4 className="feature-title">File Preview</h4>
                    <p className="feature-description">View files safely in isolated environment</p>
                  </div>
                </div>

                <div className="feature-item feature-ai">
                  <FaCheckCircle className="feature-bullet" />
                  <div className="feature-content-wrapper">
                    <h4 className="feature-title">AI-Powered Analysis</h4>
                    <p className="feature-description">Advanced threat intelligence and behavioral analysis</p>
                  </div>
                </div>

                <div className="feature-item feature-realtime">
                  <FaCheckCircle className="feature-bullet" />
                  <div className="feature-content-wrapper">
                    <h4 className="feature-title">Real-Time Results</h4>
                    <p className="feature-description">Instant security analysis with detailed reports</p>
                  </div>
                </div>

                <div className="feature-item feature-sandbox">
                  <FaCheckCircle className="feature-bullet" />
                  <div className="feature-content-wrapper">
                    <h4 className="feature-title">Sandbox Testing</h4>
                    <p className="feature-description">Secure behavioral analysis in sandbox environment</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Desktop App Features Showcase */}
          <motion.div 
            className="features-showcase desktop-features desktop-features-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="features-header features-header-left">
              <h3 className="section-title-white">What you can do with Desktop App</h3>
              <p className="section-subtitle">Advanced features coming soon to desktop</p>
            </div>
            
            <div className="features-list desktop-features-list">
              <div className="feature-item feature-live-preview">
                <FaCheckCircle className="feature-bullet" />
                <div className="feature-content-wrapper">
                  <h4 className="feature-title">Live Preview Any Website</h4>
                  <p className="feature-description">Preview websites in real-time within a secure isolated environment</p>
                </div>
              </div>

              <div className="feature-item feature-quick-access">
                <FaCheckCircle className="feature-bullet" />
                <div className="feature-content-wrapper">
                  <h4 className="feature-title">Quick Access Shortcut</h4>
                  <p className="feature-description">Press Alt + A to open any site link directly in isolated environment within 2 seconds</p>
                </div>
              </div>

              <div className="feature-item feature-download-scan">
                <FaCheckCircle className="feature-bullet" />
                <div className="feature-content-wrapper">
                  <h4 className="feature-title">Advanced File Analysis</h4>
                  <p className="feature-description">Check files before downloading to your PC or device with real-time threat detection</p>
                </div>
              </div>

              <div className="feature-item feature-mail-analysis">
                <FaCheckCircle className="feature-bullet" />
                <div className="feature-content-wrapper">
                  <h4 className="feature-title">Mail Analysis</h4>
                  <p className="feature-description">Advanced mail component breakdown and analysis - stay safe from phishing and malicious attachments</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <a 
                href="https://t.me/Aejis_Bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="action-btn telegram-btn"
              >
                <FaTelegramPlane />
                Open Telegram Bot
              </a>
              <button 
                className="action-btn desktop-btn"
                onClick={() => toast.info('Desktop app coming soon!')}
              >
                <FaDesktop />
                Download Desktop App
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Telegram Linking Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLinkModal(false)}
          >
            <motion.div 
              className="link-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Link Your Telegram Account</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowLinkModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Click the button below to open Telegram</h4>
                    <p>You'll be redirected to our bot with your unique link token</p>
                  </div>
                </div>

                <a
                  href={`https://t.me/Aejis_Bot?start=link_${linkToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="telegram-link-btn"
                >
                  <FaTelegramPlane />
                  Open in Telegram
                  <FaExternalLinkAlt className="external-icon" />
                </a>

                <div className="modal-divider">
                  <span>OR</span>
                </div>

                <div className="modal-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Manually send the token to our bot</h4>
                    <p>Copy the token below and send it to @Aejis_Bot</p>
                  </div>
                </div>

                <div className="token-display">
                  <code>/start link_{linkToken}</code>
                  <button 
                    className="copy-token-btn"
                    onClick={handleCopyToken}
                  >
                    <FaCopy />
                  </button>
                </div>

                <div className="modal-footer">
                  <p className="help-text">
                    After clicking the link or sending the token, your Telegram account will be automatically linked to your Aejis account.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

