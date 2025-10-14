import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaRobot, 
  FaCogs, 
  FaChartLine,
  FaLock,
  FaRocket,
  FaGlobe,
  FaClock,
  FaUsers,
  FaAward,
  FaHeart
} from 'react-icons/fa';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "70+ Antivirus Engines",
      description: "Comprehensive malware detection using industry-leading engines"
    },
    {
      icon: <FaRobot />,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms for zero-day threat detection"
    },
    {
      icon: <FaCogs />,
      title: "Dynamic Sandbox",
      description: "Isolated environment testing for behavioral analysis"
    },
    {
      icon: <FaChartLine />,
      title: "Real-time Results",
      description: "Instant analysis with detailed security reports"
    }
  ];

  const stats = [
    { number: "1M+", label: "Files Analyzed" },
    { number: "99.9%", label: "Uptime" },
    { number: "70+", label: "Security Engines" },
    { number: "24/7", label: "Monitoring" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About Aejis</h1>
            <p>
              We're on a mission to provide the most comprehensive and accessible 
              file security analysis platform in the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <motion.div
            className="mission-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                In today's digital world, file security is more important than ever. 
                Cyber threats are constantly evolving, and traditional security measures 
                alone are no longer sufficient. That's why we created Aejis.
              </p>
              <p>
                Our platform combines the power of 70+ antivirus engines with cutting-edge 
                AI technology to provide comprehensive file analysis that's both thorough 
                and accessible to everyone.
              </p>
            </div>
            <div className="mission-visual">
              <div className="security-shield">
                <FaShieldAlt />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <h2>What Makes Us Different</h2>
              <p>Advanced technology meets user-friendly design</p>
            </div>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <h2>Trusted by Users Worldwide</h2>
              <p>Our numbers speak for themselves</p>
            </div>
            
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <motion.div
            className="tech-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="tech-text">
              <h2>Advanced Technology Stack</h2>
              <p>
                Our platform is built on cutting-edge technology to ensure the most 
                accurate and comprehensive file analysis possible.
              </p>
              <div className="tech-features">
                <div className="tech-feature">
                  <FaRobot className="tech-icon" />
                  <div>
                    <h4>AI & Machine Learning</h4>
                    <p>Advanced algorithms for threat detection</p>
                  </div>
                </div>
                <div className="tech-feature">
                  <FaCogs className="tech-icon" />
                  <div>
                    <h4>Multi-Engine Analysis</h4>
                    <p>70+ antivirus engines for comprehensive scanning</p>
                  </div>
                </div>
                <div className="tech-feature">
                  <FaLock className="tech-icon" />
                  <div>
                    <h4>Secure Infrastructure</h4>
                    <p>Enterprise-grade security and privacy protection</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="tech-visual">
              <div className="tech-diagram">
                <div className="tech-node">
                  <FaShieldAlt />
                  <span>File Upload</span>
                </div>
                <div className="tech-arrow">→</div>
                <div className="tech-node">
                  <FaCogs />
                  <span>Multi-Engine Scan</span>
                </div>
                <div className="tech-arrow">→</div>
                <div className="tech-node">
                  <FaRobot />
                  <span>AI Analysis</span>
                </div>
                <div className="tech-arrow">→</div>
                <div className="tech-node">
                  <FaChartLine />
                  <span>Results</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="section-header">
              <h2>Our Values</h2>
              <p>The principles that guide everything we do</p>
            </div>
            
            <div className="values-grid">
              <motion.div
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <FaShieldAlt className="value-icon" />
                <h3>Security First</h3>
                <p>We prioritize the security and privacy of our users above all else.</p>
              </motion.div>
              
              <motion.div
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <FaUsers className="value-icon" />
                <h3>Accessibility</h3>
                <p>Advanced security should be accessible to everyone, not just enterprises.</p>
              </motion.div>
              
              <motion.div
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <FaAward className="value-icon" />
                <h3>Excellence</h3>
                <p>We strive for the highest standards in everything we build and deliver.</p>
              </motion.div>
              
              <motion.div
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <FaHeart className="value-icon" />
                <h3>Innovation</h3>
                <p>We continuously innovate to stay ahead of evolving cyber threats.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Secure Your Files?</h2>
            <p>Join thousands of users who trust Aejis for their file analysis needs</p>
            <div className="cta-buttons">
              <a href="/" className="btn btn-primary btn-lg">
                <FaShieldAlt />
                Start Free Analysis
              </a>
              <a 
                href="https://t.me/Aejis_Bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <FaRocket />
                Try Telegram Bot
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
