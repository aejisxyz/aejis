import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import FileAnalysis from './pages/FileAnalysis.jsx';
import URLAnalysis from './pages/URLAnalysis.jsx';
import Analysis from './pages/Analysis.jsx';
import Results from './pages/Results.jsx';
import URLResults from './pages/URLResults.jsx';
import Preview from './pages/Preview.jsx';
import About from './pages/About.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#000000',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/file-analysis" element={<FileAnalysis />} />
            <Route path="/url-analysis" element={<URLAnalysis />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/url-results/:id" element={<URLResults />} />
            <Route path="/preview/:id" element={<Preview />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </motion.main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
