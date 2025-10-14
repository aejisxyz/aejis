import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft
} from 'react-icons/fa';
import AdvancedFileAnalyzer from '../components/AdvancedFileAnalyzer.jsx';
import './FileAnalysis.css';

const FileAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="file-analysis-page">
      <div className="page-header">
        <button 
          className="back-btn back-button"
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
        {/* Advanced File Analyzer */}
        <AdvancedFileAnalyzer />
      </motion.div>
    </div>
  );
};

export default FileAnalysis;
