import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaTelegram, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="Aejis Logo" className="logo-icon" />
            </div>
            <p className="footer-description">
              Advanced file analysis platform with 70+ antivirus engines, 
              AI-powered threat detection, and real-time security insights.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://t.me/Aejis_Bot" className="social-link" aria-label="Telegram">
                <FaTelegram />
              </a>
              <a href="mailto:support@aejis.com" className="social-link" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Security</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#compliance">Compliance</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#status">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Aejis. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
