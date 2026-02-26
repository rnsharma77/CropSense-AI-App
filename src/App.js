import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage  from './pages/LandingPage';
import DetectorPage from './pages/DetectorPage';
import ResultPage   from './pages/ResultPage';
import AdvisoryPage from './pages/AdvisoryPage';
import AnalysesPage from './pages/AnalysesPage';

function App() {
  return (
    <Router>
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
          success: { iconTheme: { primary: '#00ff87', secondary: '#0a1810' } },
          error:   { iconTheme: { primary: '#ff3d3d', secondary: '#0a1810' } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/"        element={<LandingPage />}  />
        <Route path="/detect"  element={<DetectorPage />} />
        <Route path="/result"  element={<ResultPage />}   />
        <Route path="/advisory"element={<AdvisoryPage />} />
        <Route path="/analyses" element={<AnalysesPage />} />
      </Routes>
    </Router>
  );
}

export default App;