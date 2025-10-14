import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  FaGlobe, 
  FaRocket, 
  FaSpinner, 
  FaCheckCircle, 
  FaShieldAlt,
  FaRobot,
  FaLock,
  FaDesktop,
  FaSearch
} from 'react-icons/fa';
import './URLAnalyzer.css';

const URLAnalyzer = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // URL validation function
  const isValidUrl = (str) => {
    try {
      const urlObj = new URL(str);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Handle URL analysis
  const handleAnalysis = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL to analyze');
      return;
    }

    if (!isValidUrl(url.trim())) {
      toast.error('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await axios.post('/analyze-url', {
        url: url.trim()
      });
      
      const { analysis_id } = response.data;
      toast.success('🌐 Website analysis started! Analyzing website security...');
      navigate(`/analysis/${analysis_id}`);
    } catch (error) {
      console.error('URL analysis error:', error);
      toast.error('Failed to analyze URL. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="url-analyzer-container">
      <motion.div
        className="url-analyzer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="analyzer-header">
          <div className="header-icon">
            <FaGlobe />
          </div>
          <h2>Website Security Analysis</h2>
          <p>Analyze websites for phishing, malware, scams, and security vulnerabilities</p>
        </div>

        <form onSubmit={handleAnalysis} className="url-form">
          <div className="url-input-container">
            <div className="input-wrapper">
              <FaSearch className="input-icon" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="url-input"
                disabled={isAnalyzing}
              />
            </div>
            
            <button
              type="submit"
              className="analyze-button"
              disabled={isAnalyzing || !url.trim()}
            >
              {isAnalyzing ? (
                <>
                  <FaSpinner className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FaRocket className="button-icon" />
                  Analyze Website
                </>
              )}
            </button>
          </div>
        </form>

        <div className="url-features">
          <div className="feature-grid">
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FaShieldAlt className="feature-icon" />
              <h4>Malware Detection</h4>
              <p>Advanced scanning for malicious websites and downloads</p>
            </motion.div>
            
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FaRobot className="feature-icon" />
              <h4>AI Threat Analysis</h4>
              <p>Machine learning algorithms detect sophisticated scams</p>
            </motion.div>
            
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FaLock className="feature-icon" />
              <h4>Safe Preview</h4>
              <p>Interact with websites safely in isolated environment</p>
            </motion.div>
            
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FaDesktop className="feature-icon" />
              <h4>Domain Intelligence</h4>
              <p>Comprehensive domain reputation and trust analysis</p>
            </motion.div>
          </div>
        </div>

        <div className="analysis-info">
          <div className="info-section">
            <h3>🔍 What We Analyze</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-bullet">•</span>
                <span>Phishing and social engineering attempts</span>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <span>Malware distribution and drive-by downloads</span>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <span>Cryptocurrency scams and fake exchanges</span>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <span>SSL/TLS security and certificate validation</span>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <span>Domain reputation and trust indicators</span>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <span>Content analysis and suspicious patterns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="security-badges">
          <motion.div
            className="badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FaCheckCircle />
            <span>Real-time Analysis</span>
          </motion.div>
          
          <motion.div
            className="badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaCheckCircle />
            <span>Safe Preview</span>
          </motion.div>
          
          <motion.div
            className="badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FaCheckCircle />
            <span>AI-Powered</span>
          </motion.div>
          
          <motion.div
            className="badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FaCheckCircle />
            <span>Threat Intelligence</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default URLAnalyzer;

