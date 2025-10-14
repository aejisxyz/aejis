import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaShieldAlt,
  FaRobot,
  FaCogs,
  FaChartLine,
  FaTimes
} from 'react-icons/fa';
import './Analysis.css';

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      checkAnalysisStatus();
      const interval = setInterval(checkAnalysisStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const checkAnalysisStatus = async () => {
    try {
      const response = await axios.get(`/status/${id}`);
      const data = response.data;
      
      setAnalysisData(data);
      
      if (data.status === 'completed') {
        toast.success('Analysis completed successfully!');
        setTimeout(() => {
          // Let the backend handle the redirect based on analysis type
          window.location.href = `/results/${id}`;
        }, 2000);
      } else if (data.status === 'error') {
        setError(data.error || 'Analysis failed');
        toast.error('Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error('Status check error:', err);
      setError('Failed to check analysis status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step, index) => {
    if (step.status === 'completed') {
      return <FaCheckCircle className="step-icon completed" />;
    } else if (step.status === 'processing') {
      return <FaSpinner className="step-icon processing" />;
    } else {
      return <div className="step-icon pending">{index + 1}</div>;
    }
  };

  const getStepIconComponent = (stepName) => {
    switch (stepName) {
      case 'Upload':
        return <FaShieldAlt />;
      case 'VirusTotal Scan':
        return <FaCogs />;
      case 'AI Analysis':
        return <FaRobot />;
      case 'Sandbox Analysis':
        return <FaShieldAlt />;
      case 'Report Generation':
        return <FaChartLine />;
      default:
        return <FaCogs />;
    }
  };

  if (isLoading && !analysisData) {
    return (
      <div className="analysis-page">
        <div className="container">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <h2>Starting Analysis...</h2>
            <p>Please wait while we initialize your file analysis</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-page">
        <div className="container">
          <div className="error-state">
            <FaExclamationTriangle className="error-icon" />
            <h2>Analysis Failed</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="analysis-header">
            {analysisData?.is_url ? (
              <>
                <h1>🔍 Analyzing Website</h1>
                <p>Please wait while we scan the website for security threats and malware...</p>
              </>
            ) : (
              <>
                <h1>🔍 Analyzing Your File</h1>
                <p>Please wait while we scan your file with 70+ security engines...</p>
              </>
            )}
          </div>

          {analysisData && (
            <>
              <div className="file-info">
                <div className="file-details">
                  {analysisData.is_url ? (
                    <>
                      <h3>🌐 {analysisData.url}</h3>
                      <p>Analysis Type: Website Security Scan</p>
                      <p>Started: {new Date(analysisData.created_at).toLocaleTimeString()}</p>
                    </>
                  ) : (
                    <>
                      <h3>📁 {analysisData.filename}</h3>
                      <p>Size: {(analysisData.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                      <p>Started: {new Date(analysisData.start_time).toLocaleTimeString()}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <h3>Analysis Progress</h3>
                  <span className="progress-percentage">{analysisData.progress}%</span>
                </div>
                
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisData.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="analysis-steps">
                {analysisData.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`step ${step.status}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="step-content">
                      <div className="step-icon-container">
                        {getStepIcon(step, index)}
                      </div>
                      <div className="step-info">
                        <h4>{step.name}</h4>
                        <p>
                          {step.status === 'completed' && 'Completed successfully'}
                          {step.status === 'processing' && 'In progress...'}
                          {step.status === 'pending' && 'Waiting...'}
                        </p>
                      </div>
                      <div className="step-visual">
                        {getStepIconComponent(step.name)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="analysis-info">
                {analysisData.is_url ? (
                  <>
                    <div className="info-card">
                      <h4>🌐 Website Reputation</h4>
                      <p>Checking domain reputation and blacklists</p>
                    </div>
                    <div className="info-card">
                      <h4>🤖 AI Web Analysis</h4>
                      <p>Advanced AI analyzing website content and structure</p>
                    </div>
                    <div className="info-card">
                      <h4>🔒 Safe Preview</h4>
                      <p>Generating isolated browser preview</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-card">
                      <h4>🛡️ Security Engines</h4>
                      <p>70+ antivirus engines scanning your file</p>
                    </div>
                    <div className="info-card">
                      <h4>🤖 AI Analysis</h4>
                      <p>Advanced AI detecting sophisticated threats</p>
                    </div>
                    <div className="info-card">
                      <h4>🐳 Sandbox Testing</h4>
                      <p>Isolated environment behavioral analysis</p>
                    </div>
                  </>
                )}
              </div>

              <div className="analysis-footer">
                <p>This analysis typically takes 30-60 seconds. Please keep this page open.</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/')}
                >
                  <FaTimes />
                  Cancel Analysis
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analysis;
