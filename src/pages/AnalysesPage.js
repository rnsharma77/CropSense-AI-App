import React, { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import { Loader, Trash2, X, AlertCircle } from 'lucide-react';
import './AnalysesPage.css';

export default function AnalysesPage() {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const apiServer = process.env.REACT_APP_API_SERVER || 'http://localhost:5050';
      const url = `${apiServer}/api/analyses?limit=50`;
      console.log('Fetching from:', url);
      
      const res = await fetch(url);
      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Fetched data:', data);
      
      if (data.ok && data.items) {
        setItems(data.items);
        console.log('Loaded', data.items.length, 'analyses');
      } else {
        throw new Error(data.error || 'Failed to fetch analyses');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      const apiServer = process.env.REACT_APP_API_SERVER || 'http://localhost:5050';
      const res = await fetch(`${apiServer}/api/analysis/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (data.ok) {
        setItems(items.filter(item => item._id !== id));
        console.log('Analysis deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(t('error_deleting_analysis'));
    }
  };

  return (
    <div className="analyses">
      <div className="wrap">
        <h2 className="page-title">{t('analyses_title') || 'My Analyses'}</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-1)' }}>
            <Loader size={32} style={{ margin: '0 auto 16px', animation: 'spin 2s linear infinite' }} />
            <p>{t('loading_analyses') || 'Loading analyses...'}</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff5757' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 16px' }} />
            <p>{t('error_loading') || 'Error'}: {error}</p>
          </div>
        ) : (
          <div className="analyses-list">
            {items.length === 0 ? (
              <p>{t('no_analyses') || 'No analyses yet'}</p>
            ) : (
              items.map(it => (
                <div 
                  className="analysis-card" 
                  key={it._id}
                  onClick={() => setSelectedAnalysis(it)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="analysis-card__header">
                    <div className="analysis-meta">{new Date(it.timestamp).toLocaleString()}</div>
                    <button 
                      className="analysis-card__delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(it._id);
                      }}
                      title={t('delete_this_analysis') || 'Delete'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="analysis-summary">{it.summary || (it.disease ? `${it.disease} analysis` : 'Analysis')}</h3>
                  <div className="analysis-details">
                    <div>
                      <span>{t('label_disease') || 'Disease'}</span>
                      <strong>{it.disease || t('healthy') || 'Healthy'}</strong>
                    </div>
                    <div>
                      <span>{t('label_confidence') || 'Confidence'}</span>
                      <strong>{Math.round((it.confidence || 0) * 100)}%</strong>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-2)' }}>
                    {t('click_view_details') || 'Click to view details'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedAnalysis && (
        <div className="modal-overlay" onClick={() => setSelectedAnalysis(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedAnalysis(null)}
            >
              <X size={24} />
            </button>

            <div className="disease-details-modal">
              <div className="disease-header">
                <h2>{selectedAnalysis.disease || 'Unknown'}</h2>
                <div className={`severity-badge ${
                  selectedAnalysis.confidence > 0.7 ? 'high' : 
                  selectedAnalysis.confidence > 0.4 ? 'medium' : 'low'
                }`}>
                  {Math.round(selectedAnalysis.confidence * 100)}% Confidence
                </div>
              </div>

              <div className="disease-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => setActiveTab('about')}
                >
                  {t('about') || 'About'}
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'treatment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('treatment')}
                >
                  {t('treatment') || 'Treatment'}
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'dealers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dealers')}
                >
                  {t('dealers') || 'Dealers'}
                </button>
              </div>

              {activeTab === 'about' && (
                <div className="tab-content">
                  <div className="disease-info">
                    <div className="info-block">
                      <label>{t('label_severity') || 'SEVERITY'}</label>
                      <p className={`severity-text ${
                        selectedAnalysis.confidence > 0.7 ? 'high' : 
                        selectedAnalysis.confidence > 0.4 ? 'medium' : 'low'
                      }`}>
                        {selectedAnalysis.confidence > 0.7 ? t('high_risk') || 'High Risk' : 
                         selectedAnalysis.confidence > 0.4 ? t('medium_risk') || 'Medium Risk' : 
                         t('low_risk') || 'Low Risk'}
                      </p>
                    </div>

                    <div className="info-block">
                      <label>{t('label_confidence') || 'CONFIDENCE'}</label>
                      <p>{Math.round(selectedAnalysis.confidence * 100)}%</p>
                    </div>

                    <div className="info-block">
                      <label>{t('label_detected') || 'DETECTED'}</label>
                      <p>{new Date(selectedAnalysis.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="disease-description">
                    <h3>{t('disease_overview') || 'Disease Overview'}</h3>
                    <p>
                      {selectedAnalysis.disease ? 
                        `${selectedAnalysis.disease} is a common crop disease that affects yield and quality.` :
                        'This crop appears to be healthy based on the analysis.'}
                    </p>
                    <p>
                      Detected on {new Date(selectedAnalysis.timestamp).toLocaleString()}. 
                      Please take immediate action to prevent spread to other areas.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'treatment' && (
                <div className="tab-content">
                  <div className="treatment-sections">
                    <div className="treatment-method">
                      <h3>{t('chemical_treatment') || 'Chemical Treatment'}</h3>
                      <ul>
                        <li>Consult your local agronomist for the best fungicide recommendations</li>
                        <li>Apply chemical treatments in early morning or late evening</li>
                        <li>Follow label instructions carefully for dosage and safety</li>
                        <li>Repeat applications every 7-10 days as recommended</li>
                        <li>Wear protective equipment during application</li>
                      </ul>
                    </div>

                    <div className="treatment-method">
                      <h3>{t('organic_treatment') || 'Organic Treatment'}</h3>
                      <ul>
                        <li>Spray neem oil solution (5ml per litre) every 5-7 days</li>
                        <li>Use sulfur dust or powder for preventive care</li>
                        <li>Apply baking soda solution (1 tsp per litre water)</li>
                        <li>Improve air circulation by pruning affected areas</li>
                        <li>Remove and destroy infected plant parts immediately</li>
                      </ul>
                    </div>
                  </div>

                  <div className="general-tips">
                    <h3>{t('general_management') || 'General Management Tips'}</h3>
                    <ul>
                      <li>Remove heavily infected leaves and dispose properly</li>
                      <li>Avoid overhead irrigation; water at the base only</li>
                      <li>Ensure proper plant spacing for air circulation</li>
                      <li>Monitor the crop regularly for disease spread</li>
                      <li>Maintain crop hygiene by removing fallen leaves</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'dealers' && (
                <div className="tab-content">
                  <p style={{ textAlign: 'center', color: 'var(--text-2)' }}>
                    {t('no_dealers_info') || 'Dealer information coming soon'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
