import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import {
  Globe,
  Target,
  Search,
  Shield,
  Lock,
  CheckCircle,
  LockIcon,
  Globe2,
  FileText,
  BarChart3,
  Brain,
  Activity,
  Zap,
  Eye,
  Database,
  Cpu,
  Network,
  TrendingUp
} from 'lucide-react';
import API_URL from '../config/api';
import './URLResults.css';

const URLResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [browserStatus, setBrowserStatus] = useState('');
  const [browserPreview, setBrowserPreview] = useState('');

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      // Use the dedicated URL results data endpoint
      const response = await axios.get(`${API_URL}/url-results-data/${id}`);
      console.log('URL Results Data:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching URL results:', error);
      // Fallback to the general API endpoint
      try {
        const response = await axios.get(`${API_URL}/api/results/${id}`);
        console.log('Fallback API Data:', response.data);
        setResults(response.data);
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const startBrowserIsolation = async (analysisId) => {
    const statusDiv = document.getElementById(`browser-status-${analysisId}`);
    const previewDiv = document.getElementById(`browser-preview-${analysisId}`);
    
    setBrowserStatus('🚀 Starting Aejis Browser Isolation...');
    setBrowserPreview('');
    
    try {
      const response = await fetch(`/browser/${analysisId}`);
      const data = await response.json();
      
      if (data.success) {
        setBrowserStatus(`
          ✅ Browser isolation session started successfully!
          Session ID: ${data.session_id}
          Target URL: ${data.target_url}
          Isolation Level: ${data.isolation_level}
          Location Spoofing: ${data.location_spoofing ? 'Enabled' : 'Disabled'}
          Commercial Friendly: ${data.commercial_friendly ? 'Yes' : 'No'}
        `);
        
        // Create iframe for browser preview - use auto-connect for seamless experience
        const pureUrl = '${API_URL}/vnc-auto-connect.html?url=' + encodeURIComponent(data.target_url);
        setBrowserPreview(`
          <div class="browser-loading">🌐 Loading isolated browser...</div>
          <iframe src="${pureUrl}" 
                  style="width: 100%; height: 600px; border: none; background: #fff;"
                  onload="this.style.display='block'; this.previousElementSibling.style.display='none';">
          </iframe>
          <div style="margin-top: 10px; text-align: center;">
            <a href="${pureUrl}" target="_blank" style="color: #3498db; text-decoration: none;">
              🔗 Open in New Tab
            </a>
          </div>
        `);
      } else {
        setBrowserStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setBrowserStatus(`❌ Error: ${error.message}`);
    }
  };

  const checkBrowserStatus = async (analysisId) => {
    try {
      const response = await fetch(`/browser/${analysisId}/status`);
      const data = await response.json();
      
      if (data.success) {
        setBrowserStatus(`
          📊 Browser Status: ${data.status}
          Session ID: ${data.session_id}
          Target URL: ${data.target_url}
          Start Time: ${new Date(data.start_time * 1000).toLocaleString()}
          Isolation Level: ${data.isolation_level}
          Location Spoofing: ${data.location_spoofing ? 'Enabled' : 'Disabled'}
          Commercial Friendly: ${data.commercial_friendly ? 'Yes' : 'No'}
        `);
      } else {
        setBrowserStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setBrowserStatus(`❌ Error: ${error.message}`);
    }
  };

  const stopBrowserSession = async (analysisId) => {
    try {
      const response = await fetch(`/browser/${analysisId}/stop`, { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setBrowserStatus('🛑 Browser session stopped successfully');
        setBrowserPreview('');
      } else {
        setBrowserStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setBrowserStatus(`❌ Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="url-results-page">
        <div className="container">
          <div className="header">
            <h1>🛡️ Aejis Analysis Results</h1>
            <p>Loading comprehensive security analysis report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="url-results-page">
        <div className="container">
          <div className="header">
            <h1>🛡️ Aejis Analysis Results</h1>
            <p>Analysis not found</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from results - handle both direct results and nested structure
  const resultsData = results?.results || results;
  const url = resultsData?.url_info?.url || results?.url || 'Unknown URL';
  const domain = resultsData?.url_info?.domain || 'Unknown Domain';
  const trust_score = resultsData?.ai_analysis?.trust_score || 0;
  const threat_level = resultsData?.summary?.threat_level || 'UNKNOWN';
  
  const ai_analysis = resultsData?.ai_analysis || {};
  const virustotal = resultsData?.virustotal || {};
  const security_analysis = ai_analysis?.security_analysis || {};
  const domain_intelligence = ai_analysis?.domain_intelligence || {};
  const content_analysis = ai_analysis?.content_analysis || {};
  const advanced_metrics = ai_analysis?.advanced_metrics || {};

  return (
    <div className="url-results-page">
      <Header />
      
      {/* Premium Analysis Hero Section */}
      <div className="analysis-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="centered-content">
              <div className="hero-title-section">
                <h1 className="hero-main-title">
                  <span className="hero-title-part-1">URL Analysis</span>
                  <span className="hero-title-part-2">& Safe Preview</span>
                </h1>
                <p className="hero-main-subtitle">
                  Comprehensive threat assessment and secure browsing environment
                </p>
              </div>
              
              <div className="url-section">
                <div className="url-box">
                  <div className="url-icon-container">
                    <Globe className="url-icon" size={24} />
                  </div>
                  <div className="url-text-container">
                    <div className="url-label-text">Analyzed URL</div>
                    <div className="url-address">{url}</div>
                  </div>
                  <div className="verification-badge">
                    <CheckCircle className="verification-icon" size={16} />
                    <span className="verification-text">Analyzed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <Target className="stat-icon trust-icon" size={16} />
              <div className="stat-content">
                <div className="stat-value trust-score">{trust_score}</div>
                <div className="stat-label">Trust Score</div>
              </div>
            </div>
            <div className="stat-item">
              <Search className="stat-icon engines-icon" size={16} />
              <div className="stat-content">
                <div className="stat-value engines-used">{virustotal?.engines_used || 0}</div>
                <div className="stat-label">Engines Used</div>
              </div>
            </div>
            <div className="stat-item">
              <Shield className="stat-icon threat-icon" size={16} />
              <div className="stat-content">
                <div className="stat-value threat-level">{threat_level || 'UNKNOWN'}</div>
                <div className="stat-label">Threat Level</div>
              </div>
            </div>
            <div className="stat-item">
              <Lock className="stat-icon ssl-icon" size={16} />
              <div className="stat-content">
                <div className="stat-value ssl-grade">{security_analysis?.ssl_grade || 'A+'}</div>
                <div className="stat-label">SSL Grade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {/* Main Analysis Content */}
      <div className="main-content">
        <div className="full-width-analysis">
        </div>
      </div>

      {/* Premium Detailed Analysis Section */}
      <div className="premium-analysis-section">
        <div className="analysis-container">
          <div className="analysis-section-header">
            <h2 className="analysis-main-title">
              <span className="analysis-title-part-1">URL Analysis</span>
              <span className="analysis-title-part-2">Results</span>
            </h2>
            <p className="analysis-main-subtitle">Detailed security assessment and domain intelligence for the analyzed URL</p>
          </div>

          <div className="analysis-dashboard">
            {/* Security Analysis Card */}
            <div className="premium-card security-card">
              <div className="card-glow"></div>
              <div className="card-header">
                <div className="icon-container icon-security">
                  <div className="icon-bg"></div>
                  <LockIcon className="card-icon" size={28} />
                </div>
                <div className="card-title-section">
                  <h3>Security Analysis</h3>
                  <span className="card-subtitle">SSL & Security Headers</span>
                </div>
                <div className="status-indicator active"></div>
              </div>
              <div className="card-metrics">
                <div className="metric-item security-score-item">
                  <div className="metric-label">Security Score</div>
                  <div className="metric-value">{security_analysis?.security_score || 0}</div>
                </div>
                <div className="metric-item ssl-grade-item">
                  <div className="metric-label">SSL Grade</div>
                  <div className="metric-value ssl-grade">{security_analysis?.ssl_grade || 'Unknown'}</div>
                </div>
                <div className="metric-item headers-score-item">
                  <div className="metric-label">Headers Score</div>
                  <div className="metric-value">{security_analysis?.headers_score || 0}</div>
                </div>
                <div className="metric-item threats-found-item">
                  <div className="metric-label">Threats Found</div>
                  <div className="metric-value">{security_analysis?.threats?.length || 0}</div>
                </div>
              </div>
            </div>

            {/* Domain Intelligence Card */}
            <div className="premium-card domain-card">
              <div className="card-glow"></div>
              <div className="card-header">
                <div className="icon-container icon-domain">
                  <div className="icon-bg"></div>
                  <Globe2 className="card-icon" size={28} />
                </div>
                <div className="card-title-section">
                  <h3>Domain Intelligence</h3>
                  <span className="card-subtitle">Network & Infrastructure</span>
                </div>
                <div className="status-indicator active"></div>
              </div>
              <div className="card-metrics">
                <div className="metric-item domain-age-item">
                  <div className="metric-label">Domain Age</div>
                  <div className="metric-value">{domain_intelligence?.age_years || 0} years</div>
                </div>
                <div className="metric-item country-item">
                  <div className="metric-label">Country</div>
                  <div className="metric-value">{domain_intelligence?.country || 'Unknown'}</div>
                </div>
                <div className="metric-item registrar-item">
                  <div className="metric-label">Registrar</div>
                  <div className="metric-value">{domain_intelligence?.registrar || 'Unknown'}</div>
                </div>
                <div className="metric-item global-rank-item">
                  <div className="metric-label">Global Rank</div>
                  <div className="metric-value">{domain_intelligence?.global_rank || 'Unknown'}</div>
                </div>
              </div>
            </div>

            {/* Content Analysis Card */}
            <div className="premium-card content-card">
              <div className="card-glow"></div>
              <div className="card-header">
                <div className="icon-container icon-content">
                  <div className="icon-bg"></div>
                  <FileText className="card-icon" size={28} />
                </div>
                <div className="card-title-section">
                  <h3>Content Analysis</h3>
                  <span className="card-subtitle">Content & Language Detection</span>
                </div>
                <div className="status-indicator active"></div>
              </div>
              <div className="card-metrics">
                <div className="metric-item content-quality-item">
                  <div className="metric-label">Content Quality</div>
                  <div className="metric-value">{content_analysis?.content_quality || 'Unknown'}</div>
                </div>
                <div className="metric-item language-item">
                  <div className="metric-label">Language</div>
                  <div className="metric-value">{content_analysis?.language || 'Unknown'}</div>
                </div>
                <div className="metric-item legitimacy-score-item">
                  <div className="metric-label">Legitimacy Score</div>
                  <div className="metric-value">{content_analysis?.legitimacy_score || 0}/100</div>
                </div>
                <div className="metric-item title-length-item">
                  <div className="metric-label">Title Length</div>
                  <div className="metric-value">{content_analysis?.title?.length || 0} chars</div>
                </div>
              </div>
            </div>

            {/* Advanced Metrics Card */}
            <div className="premium-card metrics-card">
              <div className="card-glow"></div>
              <div className="card-header">
                <div className="icon-container icon-metrics">
                  <div className="icon-bg"></div>
                  <BarChart3 className="card-icon" size={28} />
                </div>
                <div className="card-title-section">
                  <h3>Advanced Metrics</h3>
                  <span className="card-subtitle">Performance & Analytics</span>
                </div>
                <div className="status-indicator active"></div>
              </div>
              <div className="card-metrics">
                <div className="metric-item content-legitimacy-item">
                  <div className="metric-label">Content Legitimacy</div>
                  <div className="metric-value">{advanced_metrics?.content_legitimacy_score || 0}</div>
                </div>
                <div className="metric-item domain-age-days-item">
                  <div className="metric-label">Domain Age (Days)</div>
                  <div className="metric-value">{advanced_metrics?.domain_age_days || 0}</div>
                </div>
                <div className="metric-item traffic-rank-item">
                  <div className="metric-label">Traffic Rank</div>
                  <div className="metric-value">{advanced_metrics?.traffic_rank || 'N/A'}</div>
                </div>
                <div className="metric-item response-time-item">
                  <div className="metric-label">Response Time</div>
                  <div className="metric-value">{advanced_metrics?.response_time || 'Unknown'}ms</div>
                </div>
              </div>
            </div>
          </div>

            {/* AI Analysis Report */}
            <div className="ai-analysis-section">
              <div className="ai-card">
                <div className="ai-header">
                  <div className="ai-icon-container">
                    <div className="ai-icon-bg"></div>
                    <Brain className="ai-icon" size={28} />
                  </div>
                  <div className="ai-title-section">
                    <h3>AI Analysis Report</h3>
                    <span className="ai-subtitle">Machine Learning Insights</span>
                  </div>
                  <div className="ai-confidence">
                    <span className="confidence-label">Confidence</span>
                    <span className="confidence-value">{ai_analysis?.ai_confidence_score || 0}%</span>
                  </div>
                </div>
              <div className="ai-content">
                <div className="ai-text">
                  {ai_analysis?.ai_analysis || 'No AI analysis available.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {/* Safe Browser Preview Section */}
      <section className="browser-preview-section">
        <div className="browser-container">
          <div className="browser-hero-header">
            <h2 className="browser-hero-title">
              <span className="browser-title-part-1">Safe Browser</span>
              <span className="browser-title-part-2">Preview</span>
            </h2>
            <p className="browser-hero-subtitle">Interact with the website safely in our isolated environment</p>
          </div>
          
          <div className="browser-preview-card">
            <div className="browser-card-header">
              <div className="browser-icon-container">
                <Shield className="browser-icon" size={28} />
              </div>
              <div className="browser-card-info">
                <h3 className="browser-card-title">Aejis Browser Isolation System</h3>
                <p className="browser-card-description">Browse this website safely in a completely isolated environment with random location spoofing. Any malware or threats will be contained within the isolated container.</p>
              </div>
            </div>
            
            <div className="desktop-app-message">
              <div className="desktop-app-icon">
                <Globe2 size={48} />
              </div>
              <div className="desktop-app-content">
                <h3>Live Website Preview Available on Desktop</h3>
                <p className="desktop-app-description">
                  Get real-time website preview in a secure isolated environment using Aegis for PC
                </p>
                
                <div className="desktop-app-instructions">
                  <div className="instruction-item">
                    <div className="instruction-number">1</div>
                    <div className="instruction-text">
                      <strong>Copy the website URL</strong>
                      <p>Click the button below to copy the link</p>
                    </div>
                  </div>
                  
                  <div className="instruction-item">
                    <div className="instruction-number">2</div>
                    <div className="instruction-text">
                      <strong>Open in Aegis Desktop</strong>
                      <p>Paste the link and click open, or hold <kbd>Alt + A</kbd> for 2 seconds for quick access</p>
                    </div>
                  </div>
                </div>
                
                <div className="desktop-app-actions">
                  <button 
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(results?.url || '');
                        toast.success('URL copied to clipboard!');
                      } catch (err) {
                        toast.error('Failed to copy URL');
                      }
                    }}
                    className="copy-url-btn"
                  >
                    Copy URL
                  </button>
                  <button 
                    className="download-desktop-btn"
                    onClick={() => toast.info('Desktop app coming soon!')}
                  >
                    Download Aegis for PC
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default URLResults;
