import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LangProvider } from './context/LangContext';

// Components & Pages
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DetectorPage from './pages/DetectorPage';
import ResultPage from './pages/ResultPage';
import AdvisoryPage from './pages/AdvisoryPage';
import ChatPage from './pages/ChatPage';
import AnalysesPage from './pages/AnalysesPage';

/**
 * Helper to ensure page scrolls to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * Main App Component
 */
function App() {
  return (
    <LangProvider>
      <Router>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a1810',
              color: '#edf9f2',
              border: '1px solid rgba(0,255,135,0.2)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: { 
              iconTheme: { primary: '#00ff87', secondary: '#0a1810' } 
            },
            error: { 
              iconTheme: { primary: '#ff3d3d', secondary: '#0a1810' } 
            },
          }}
        />
        
        <Navbar />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/detect" element={<DetectorPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/analyses" element={<AnalysesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/privacy" element={<div className="p-20">Privacy Policy Coming Soon</div>} />
          <Route path="/api" element={<div className="p-20">API Documentation Coming Soon</div>} />
          <Route path="/contact" element={<div className="p-20">Contact Support Coming Soon</div>} />
          {/* 404 Catch-all */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </LangProvider>
  );
}

export default App;