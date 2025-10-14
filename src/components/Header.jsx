import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaUserCircle, FaChevronDown, FaTelegramPlane, FaDesktop } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import toast from 'react-hot-toast';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);
  const featuresDropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setShowProfileDropdown(false);
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target)) {
        setShowFeaturesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <motion.header 
        className="header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <img src="/logo.png" alt="Aejis Logo" className="logo-icon" />
            </Link>

            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="features-dropdown-wrapper" ref={featuresDropdownRef}>
                <button 
                  className={`nav-link features-link ${showFeaturesDropdown ? 'active' : ''}`}
                  onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                >
                  <span>Scan</span>
                  <FaChevronDown className={`chevron-icon ${showFeaturesDropdown ? 'rotated' : ''}`} />
                </button>
                <AnimatePresence>
                  {showFeaturesDropdown && (
                    <motion.div 
                      className="features-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a 
                        href="https://t.me/Aejis_Bot" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="dropdown-link"
                      >
                        <FaTelegramPlane />
                        <span>For Telegram</span>
                      </a>
                      <a 
                        href="#desktop" 
                        className="dropdown-link"
                        onClick={() => setShowFeaturesDropdown(false)}
                      >
                        <FaDesktop />
                        <span>For Desktop</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="header-actions">
              {currentUser ? (
                <div className="profile-section" ref={dropdownRef}>
                  <button 
                    className="profile-btn"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="profile-avatar" />
                    ) : (
                      <FaUserCircle className="profile-icon" />
                    )}
                    <span className="profile-name">{currentUser.displayName || currentUser.email}</span>
                  </button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div 
                        className="profile-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="dropdown-header">
                          <p className="dropdown-name">{currentUser.displayName || 'User'}</p>
                          <p className="dropdown-email">{currentUser.email}</p>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item" 
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/dashboard');
                          }}
                        >
                          <FaUser /> Dashboard
                        </button>
                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                          <FaSignOutAlt /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button className="auth-btn login-btn" onClick={() => setShowLogin(true)}>
                    Login
                  </button>
                  <button className="auth-btn register-btn" onClick={() => setShowRegister(true)}>
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <button 
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onSwitchToRegister={switchToRegister}
          />
        )}
        {showRegister && (
          <Register 
            onClose={() => setShowRegister(false)} 
            onSwitchToLogin={switchToLogin}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
