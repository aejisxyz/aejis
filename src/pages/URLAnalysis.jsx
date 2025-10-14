import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft,
  FaGlobe,
  FaShieldAlt,
  FaRobot,
  FaLock,
  FaDesktop,
  FaSearch,
  FaChartLine
} from 'react-icons/fa';
import URLAnalyzer from '../components/URLAnalyzer.jsx';
import './URLAnalysis.css';

const URLAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="url-analysis-page">
      <div className="container">
        <div className="page-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            <FaArrowLeft />
            Back to Home
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="analysis-hero">
            <div className="hero-icon">
              <FaGlobe />
            </div>
            <h1>Website Security Analysis</h1>
            <p>Comprehensive security analysis for websites, URLs, and domains with real-time threat detection, phishing protection, and safe preview capabilities</p>
          </div>

          {/* URL Analyzer */}
          <div className="analyzer-section">
            <URLAnalyzer />
          </div>

          {/* Process Steps */}
          <div className="process-steps">
            <h2>How Website Analysis Works</h2>
            <div className="steps-grid">
              <motion.div 
                className="step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="step-icon">
                  <FaSearch />
                </div>
                <h3>1. URL Reputation</h3>
                <p>Check domain reputation, blacklists, and security databases for known threats</p>
              </motion.div>
              
              <motion.div 
                className="step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="step-icon">
                  <FaRobot />
                </div>
                <h3>2. AI Analysis</h3>
                <p>Advanced AI algorithms analyze website content, structure, and behavior patterns</p>
              </motion.div>
              
              <motion.div 
                className="step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="step-icon">
                  <FaLock />
                </div>
                <h3>3. Safe Preview</h3>
                <p>Generate secure, isolated preview allowing safe interaction with suspicious sites</p>
              </motion.div>
              
              <motion.div 
                className="step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="step-icon">
                  <FaChartLine />
                </div>
                <h3>4. Intelligence Report</h3>
                <p>Detailed analysis with domain intelligence, trust scores, and security metrics</p>
              </motion.div>
            </div>
          </div>

          {/* Threat Types */}
          <div className="threat-types">
            <h2>Website Threats We Detect</h2>
            <div className="threats-grid">
              <div className="threat-category">
                <div className="threat-icon">🎣</div>
                <h3>Phishing Attacks</h3>
                <p>Fake login pages, credential harvesting sites, and social engineering attempts designed to steal personal information</p>
              </div>
              <div className="threat-category">
                <div className="threat-icon">🦠</div>
                <h3>Malware Distribution</h3>
                <p>Websites hosting malicious downloads, drive-by downloads, and exploit kits targeting browser vulnerabilities</p>
              </div>
              <div className="threat-category">
                <div className="threat-icon">💰</div>
                <h3>Cryptocurrency Scams</h3>
                <p>Fake exchanges, wallet generators, investment schemes, and crypto-related fraud websites</p>
              </div>
              <div className="threat-category">
                <div className="threat-icon">🎭</div>
                <h3>Typosquatting</h3>
                <p>Domains that mimic legitimate sites with slight spelling variations to deceive users</p>
              </div>
              <div className="threat-category">
                <div className="threat-icon">🕷️</div>
                <h3>Web Skimmers</h3>
                <p>Credit card skimming scripts and checkout page compromises targeting e-commerce sites</p>
              </div>
              <div className="threat-category">
                <div className="threat-icon">📱</div>
                <h3>Mobile Threats</h3>
                <p>Mobile-specific scams, fake app stores, and SMS phishing campaigns targeting mobile users</p>
              </div>
            </div>
          </div>

          {/* Analysis Features */}
          <div className="analysis-features">
            <h2>Advanced Analysis Capabilities</h2>
            <div className="features-grid">
              <div className="analysis-feature">
                <div className="feature-icon">🔍</div>
                <h3>Domain Intelligence</h3>
                <p>Comprehensive domain analysis including age, registrar information, hosting details, and historical data</p>
              </div>
              <div className="analysis-feature">
                <div className="feature-icon">🏆</div>
                <h3>Trust Scoring</h3>
                <p>Advanced trust algorithms evaluate domain reputation, traffic patterns, and security indicators</p>
              </div>
              <div className="analysis-feature">
                <div className="feature-icon">🔒</div>
                <h3>SSL/TLS Analysis</h3>
                <p>Certificate validation, encryption strength assessment, and security header evaluation</p>
              </div>
              <div className="analysis-feature">
                <div className="feature-icon">📊</div>
                <h3>Traffic Intelligence</h3>
                <p>Website popularity metrics, visitor statistics, and global ranking information</p>
              </div>
              <div className="analysis-feature">
                <div className="feature-icon">🛡️</div>
                <h3>Safe Preview</h3>
                <p>Interact with websites safely in isolated browser environments without exposing your device</p>
              </div>
              <div className="analysis-feature">
                <div className="feature-icon">⚡</div>
                <h3>Real-time Detection</h3>
                <p>Live threat intelligence feeds and real-time security database updates for current protection</p>
              </div>
            </div>
          </div>

          {/* Security Benefits */}
          <div className="security-benefits">
            <h2>Why Use Our Website Analysis?</h2>
            <div className="benefits-grid">
              <motion.div 
                className="benefit"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="benefit-icon">
                  <FaShieldAlt />
                </div>
                <h3>Stay Protected</h3>
                <p>Avoid malicious websites, phishing attacks, and online scams before they compromise your security</p>
              </motion.div>
              
              <motion.div 
                className="benefit"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="benefit-icon">
                  <FaDesktop />
                </div>
                <h3>Safe Browsing</h3>
                <p>Preview suspicious websites safely in isolated environments without risking your device</p>
              </motion.div>
              
              <motion.div 
                className="benefit"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="benefit-icon">
                  <FaRobot />
                </div>
                <h3>AI-Powered</h3>
                <p>Advanced machine learning algorithms detect sophisticated threats and zero-day attacks</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default URLAnalysis;

