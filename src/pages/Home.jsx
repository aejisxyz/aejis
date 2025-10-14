import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUpload, 
  FaRobot, 
  FaCogs, 
  FaChartLine,
  FaLock,
  FaCheckCircle,
  FaArrowRight,
  FaDesktop,
  FaEye,
  FaCog,
  FaGlobe,
  FaFileAlt,
  FaDownload,
  FaPlay,
  FaStar,
  FaUsers,
  FaClock,
  FaShieldVirus,
  FaNetworkWired,
  FaDatabase,
  FaKey,
  FaSearch,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaBolt,
  FaFire,
  FaHeart,
  FaThumbsUp,
  FaAward,
  FaTrophy,
  FaMedal,
  FaCertificate,
  FaRibbon,
  FaFlag,
  FaBullseye,
  FaTarget,
  FaCrosshairs,
  FaRadar,
  FaSatellite
} from 'react-icons/fa';
import { 
  HiShieldCheck,
  HiRocketLaunch,
  HiCpuChip,
  HiLockClosed,
  HiComputerDesktop
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import Features from '../components/Features.jsx';
import Stats from '../components/Stats.jsx';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-text">
              <motion.div
                className="hero-badge enterprise-security-badge"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <span className="badge-text">ENTERPRISE SECURITY</span>
              </motion.div>
              
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Advanced Threat Protection
                <span className="title-accent">Platform</span>
              </motion.h1>
              
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Enterprise-grade security analysis with 70+ antivirus engines, 
                AI-powered threat intelligence, and real-time behavioral analysis 
                to protect your organization from advanced persistent threats.
              </motion.p>
              
              
              <motion.div 
                className="hero-buttons hero-buttons-side"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => document.getElementById('analysis').scrollIntoView({ behavior: 'smooth' })}
                >
                  <HiShieldCheck />
                  Start Scan
                </button>
                <a 
                  href="https://t.me/Aejis_Bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-lg"
                >
                  <HiRocketLaunch />
                  Pricing
                </a>
              </motion.div>
            </div>
            
            <motion.div 
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="security-dashboard status-metrics-box">
                <div className="dashboard-header">
                  <div className="status-indicator active"></div>
                  <span>Server Status: Online</span>
                </div>
                <div className="threat-monitor">
                  <div className="monitor-grid">
                    <div className="grid-item">
                      <HiShieldCheck className="grid-icon" />
                      <span>Threats Blocked</span>
                      <span className="grid-number">42,659</span>
                    </div>
                    <div className="grid-item">
                      <HiCpuChip className="grid-icon" />
                      <span>AI Analysis</span>
                      <span className="grid-number">Active</span>
                    </div>
                    <div className="grid-item">
                      <HiLockClosed className="grid-icon" />
                      <span>Encryption</span>
                      <span className="grid-number">AES-256</span>
                    </div>
                    <div className="grid-item">
                      <HiComputerDesktop className="grid-icon" />
                      <span>Real-time</span>
                      <span className="grid-number">Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Analysis Section */}
      <section id="analysis" className="analysis-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="section-header security-analysis-header">
              <h2>Choose Your Security Analysis</h2>
              <p>Professional security analysis with dedicated interfaces for files and websites</p>
            </div>
            
            <div className="analysis-options">
              <motion.div
                className="analysis-option"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <a href="#" className="option-card file-option">
                  <div className="option-icon file-analysis-icon">
                    <FaUpload />
                  </div>
                  <div className="option-content">
                    <h3>File Analysis</h3>
                    <p>Upload files for comprehensive malware scanning with 70+ antivirus engines</p>
                    <div className="option-features">
                      <span><FaFileAlt /> All File Types</span>
                      <span><HiShieldCheck /> 70+ Engines</span>
                      <span><FaRobot /> AI Analysis</span>
                      <span><FaCogs /> Sandbox Testing</span>
                    </div>
                  </div>
                </a>
              </motion.div>

              <motion.div
                className="analysis-option"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <a href="#" className="option-card url-option">
                  <div className="option-icon website-analysis-icon">
                    <FaLock />
                  </div>
                  <div className="option-content">
                    <h3>Website Analysis</h3>
                    <p>Analyze websites for phishing, malware, scams, and security vulnerabilities</p>
                    <div className="option-features">
                      <span><FaGlobe /> URL Scanning</span>
                      <span><FaLock /> Safe Preview</span>
                      <span><FaExclamationTriangle /> Phishing Detection</span>
                      <span><FaChartLine /> Domain Intelligence</span>
                    </div>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Stats Section */}
      <Stats />


    </div>
  );
};

export default Home;
