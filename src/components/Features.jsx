import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiShieldCheck,
  HiCpuChip,
  HiCog6Tooth,
  HiChartBar,
  HiLockClosed,
  HiRocketLaunch,
  HiGlobeAlt,
  HiClock
} from 'react-icons/hi2';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <HiShieldCheck />,
      title: "70+ Antivirus Engines",
      description: "Comprehensive malware detection using industry-leading antivirus engines including Kaspersky, Norton, McAfee, and more.",
      color: "#667eea"
    },
    {
      icon: <HiCpuChip />,
      title: "AI-Powered Analysis",
      description: "Advanced artificial intelligence algorithms detect zero-day threats and sophisticated malware that traditional engines might miss.",
      color: "#764ba2"
    },
    {
      icon: <HiCog6Tooth />,
      title: "Dynamic Sandbox",
      description: "Isolated environment testing to analyze file behavior and detect malicious activities in real-time.",
      color: "#4caf50"
    },
    {
      icon: <HiChartBar />,
      title: "Real-time Results",
      description: "Get instant analysis results with detailed threat reports and security recommendations.",
      color: "#ff9800"
    },
    {
      icon: <HiLockClosed />,
      title: "Secure & Private",
      description: "Enterprise-grade security with complete privacy protection. Files are automatically deleted after analysis.",
      color: "#f44336"
    },
    {
      icon: <HiRocketLaunch />,
      title: "Lightning Fast",
      description: "Optimized analysis pipeline delivers results in seconds, not minutes. Perfect for high-volume scanning.",
      color: "#9c27b0"
    },
    {
      icon: <HiGlobeAlt />,
      title: "Global Coverage",
      description: "Worldwide threat intelligence network ensures you're protected against the latest global threats.",
      color: "#2196f3"
    },
    {
      icon: <HiClock />,
      title: "24/7 Monitoring",
      description: "Continuous threat monitoring and real-time updates to keep your files secure around the clock.",
      color: "#00bcd4"
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="section-header why-choose-aejis-header">
            <h2 className="features-title">Why Choose Aejis?</h2>
            <p className="features-subtitle">Advanced security features designed to protect your files from the latest threats</p>
          </div>
          
          <div className="features-grid compact-feature-cards">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card premium-card compact-feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div 
                  className="feature-icon premium-icon"
                  style={{ '--feature-color': feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="premium-title feature-card-heading">{feature.title}</h3>
                <p className="premium-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
