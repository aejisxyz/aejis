import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  HiShieldCheck,
  HiDocumentText,
  HiClock,
  HiGlobeAlt
} from 'react-icons/hi2';
import './Stats.css';

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    {
      icon: <HiShieldCheck />,
      number: "70+",
      label: "Antivirus Engines",
      description: "Industry-leading detection"
    },
    {
      icon: <HiDocumentText />,
      number: "1M+",
      label: "Files Analyzed",
      description: "Trusted by users worldwide"
    },
    {
      icon: <HiClock />,
      number: "45s",
      label: "Average Analysis Time",
      description: "Lightning-fast results"
    },
    {
      icon: <HiGlobeAlt />,
      number: "99.9%",
      label: "Uptime Guarantee",
      description: "Reliable service"
    }
  ];

  return (
    <section className="stats-section premium-stats" ref={ref}>
      <div className="container">
        <motion.div
          className="premium-stats-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="premium-stats-left">
            <div className="section-header premium-stats-header">
              <h2 className="premium-stats-title stats-heading stats-heading-left">Trusted by Users Worldwide</h2>
              <p className="premium-stats-subtitle stats-subheading stats-subheading-left">Our platform delivers exceptional security analysis results</p>
            </div>
          </div>
          
          <div className="premium-stats-right">
            <div className="stats-compact premium-stats-compact">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-compact premium-stat-compact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="stat-compact-icon">
                  {stat.icon}
                </div>
                <div className="stat-compact-content">
                  <motion.div 
                    className="stat-compact-number"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="stat-compact-label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
