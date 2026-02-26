import React, { useEffect, useState } from 'react';
import { Loader, Trash2, X, AlertCircle } from 'lucide-react';
import './AnalysesPage.css';

export default function AnalysesPage() {
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
        alert('Failed to delete: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting analysis: ' + err.message);
    }
  };

  return (
    <div className="analyses page">
      <div className="wrap">
        <h2 className="page-title">🔍 Analysis History</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-1)' }}>
            <Loader size={32} style={{ margin: '0 auto 16px', animation: 'spin 2s linear infinite' }} />
            <p>Loading analyses...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff5757' }}>
            ⚠️ Error: {error}
          </div>
        ) : (
          <div className="analyses-list">
            {items.length === 0 ? (
              <p>📭 No analyses saved yet. Upload a crop image to get started!</p>
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
                      title="Delete this analysis"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="analysis-summary">📋 {it.summary || (it.disease || 'Unknown Analysis')}</h3>
                  <div className="analysis-details">
                    <div>
                      <span>🦠 Disease</span>
                      <strong>{it.disease || '✓ Healthy'}</strong>
                    </div>
                    <div>
                      <span>📊 Confidence</span>
                      <strong>{Math.round((it.confidence || 0) * 100)}%</strong>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-2)' }}>
                    Click to view details →
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAnalysis && (
        <div className="modal-overlay" onClick={() => setSelectedAnalysis(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedAnalysis(null)}
            >
              <X size={24} />
            </button>

            {selectedAnalysis.disease ? (
              // Disease Details
              <div className="disease-details-modal">
                <div className="disease-header">
                  <h2>{selectedAnalysis.disease}</h2>
                  <div className={`severity-badge ${
                    selectedAnalysis.confidence > 0.7 ? 'high' : 
                    selectedAnalysis.confidence > 0.4 ? 'medium' : 'low'
                  }`}>
                    {Math.round(selectedAnalysis.confidence * 100)}%
                  </div>
                </div>

                {/* Tabs */}
                <div className="disease-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                  >
                    ℹ️ About
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'treatment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('treatment')}
                  >
                    💊 Treatment
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'dealers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dealers')}
                  >
                    🏪 Dealers
                  </button>
                </div>

                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="tab-content">
                    <div className="disease-info">
                      <div className="info-block">
                        <label>SEVERITY</label>
                        <p className={`severity-text ${
                          selectedAnalysis.confidence > 0.7 ? 'high' : 
                          selectedAnalysis.confidence > 0.4 ? 'medium' : 'low'
                        }`}>
                          {selectedAnalysis.confidence > 0.7 ? 'High Risk' : 
                           selectedAnalysis.confidence > 0.4 ? 'Medium Risk' : 'Low Risk'}
                        </p>
                      </div>

                      <div className="info-block">
                        <label>CONFIDENCE</label>
                        <p>{Math.round(selectedAnalysis.confidence * 100)}%</p>
                      </div>

                      <div className="info-block">
                        <label>DETECTED</label>
                        <p>{new Date(selectedAnalysis.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="disease-description">
                      <h3>Disease Overview</h3>
                      <p>{selectedAnalysis.disease} is a plant disease that affects crop health and productivity. Prompt identification and management are crucial to prevent crop losses.</p>
                      <p>This disease was detected in your crop on {new Date(selectedAnalysis.timestamp).toLocaleString()}. Immediate action is recommended to prevent spread.</p>
                    </div>
                  </div>
                )}

                {/* Treatment Tab */}
                {activeTab === 'treatment' && (
                  <div className="tab-content">
                    <div className="treatment-sections">
                      <div className="treatment-method">
                        <h3>💉 Chemical Treatment</h3>
                        <ul>
                          <li>Consult local agronomist for best fungicide recommendations</li>
                          <li>Apply chemical treatments in early morning or late evening</li>
                          <li>Follow label instructions carefully for dosage and safety</li>
                          <li>Repeat applications every 7-10 days as recommended</li>
                          <li>Wear protective equipment during application</li>
                        </ul>
                      </div>

                      <div className="treatment-method">
                        <h3>🌿 Organic Treatment</h3>
                        <ul>
                          <li>Spray neem oil solution (5ml/litre) every 5-7 days</li>
                          <li>Use sulfur dust or powder for preventive care</li>
                          <li>Apply baking soda solution (1 tsp per litre water)</li>
                          <li>Improve air circulation by pruning affected areas</li>
                          <li>Remove and destroy infected plant parts</li>
                        </ul>
                      </div>
                    </div>

                    <div className="general-tips">
                      <h3>General Management Tips</h3>
                      <ul>
                        <li>Remove heavily infected leaves and dispose properly</li>
                        <li>Avoid overhead irrigation - water at the base only</li>
                        <li>Ensure proper plant spacing for air circulation</li>
                        <li>Monitor crops regularly for early detection</li>
                        <li>Practice crop rotation to reduce disease pressure</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Dealers Tab */}
                {activeTab === 'dealers' && (
                  <div className="tab-content">
                    <div className="dealers-list">
                      <div className="dealer-card">
                        <div className="dealer-header">
                          <h4>Agro Care Store</h4>
                          <span className="distance">1.2 km</span>
                        </div>
                        <p className="dealer-desc">Fungicides, Seeds, Fertilizers</p>
                      </div>

                      <div className="dealer-card">
                        <div className="dealer-header">
                          <h4>Kisan's Corner</h4>
                          <span className="distance">2.8 km</span>
                        </div>
                        <p className="dealer-desc">Organic & Natural Remedies</p>
                      </div>

                      <div className="dealer-card">
                        <div className="dealer-header">
                          <h4>FarmMart India</h4>
                          <span className="distance">4.1 km</span>
                        </div>
                        <p className="dealer-desc">All Agrochemicals</p>
                      </div>

                      <div className="dealer-card">
                        <div className="dealer-header">
                          <h4>Green Valley Seeds</h4>
                          <span className="distance">5.3 km</span>
                        </div>
                        <p className="dealer-desc">Certified Seeds & Pesticides</p>
                      </div>
                    </div>

                    <div className="dealer-note">
                      <p>📍 Dealers shown are based on your location. For specific recommendations about treatments and products for <strong>{selectedAnalysis.disease}</strong>, consult with store staff.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Healthy Plant Details
              <div className="healthy-details-modal">
                <div className="healthy-header">
                  <h2>✓ Plant is Healthy</h2>
                </div>
                <div className="healthy-message">
                  <AlertCircle size={48} color="#3dffa0" />
                  <p>Your plant appears to be in good health! Continue monitoring and maintain proper care routines.</p>
                </div>
                <div className="healthy-timestamp">
                  <label>ANALYZED</label>
                  <p>{new Date(selectedAnalysis.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: var(--bg-2);
          border: 1px solid rgba(0, 255, 135, 0.2);
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-1);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: var(--plasma);
        }

        .disease-details-modal h2 {
          font-size: 32px;
          margin: 0 32px 0 0;
          color: var(--text-1);
        }

        .disease-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .disease-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(0, 255, 135, 0.2);
        }

        .tab-btn {
          flex: 1;
          padding: 12px 16px;
          background: none;
          border: none;
          color: var(--text-2);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          text-transform: capitalize;
        }

        .tab-btn:hover {
          color: var(--text-1);
        }

        .tab-btn.active {
          color: var(--plasma);
          border-bottom-color: var(--plasma);
        }

        .tab-content {
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .treatment-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .treatment-method {
          padding: 16px;
          background: rgba(0, 255, 135, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(0, 255, 135, 0.1);
        }

        .treatment-method h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: var(--plasma);
          font-weight: 600;
        }

        .treatment-method ul,
        .general-tips ul {
          margin: 0;
          padding-left: 20px;
          list-style: none;
        }

        .treatment-method li,
        .general-tips li {
          margin-bottom: 8px;
          color: var(--text-1);
          font-size: 14px;
          line-height: 1.5;
          position: relative;
          padding-left: 16px;
        }

        .treatment-method li:before,
        .general-tips li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--plasma);
          font-weight: bold;
        }

        .general-tips {
          padding: 16px;
          background: rgba(0, 255, 135, 0.05);
          border-radius: 8px;
        }

        .general-tips h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: var(--plasma);
          font-weight: 600;
        }

        .dealers-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .dealer-card {
          padding: 16px;
          background: rgba(0, 255, 135, 0.05);
          border: 1px solid rgba(0, 255, 135, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dealer-card:hover {
          background: rgba(0, 255, 135, 0.1);
          border-color: rgba(0, 255, 135, 0.3);
        }

        .dealer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .dealer-header h4 {
          margin: 0;
          font-size: 14px;
          color: var(--text-1);
          font-weight: 600;
        }

        .dealer-header .distance {
          color: var(--plasma);
          font-weight: 600;
          font-size: 13px;
        }

        .dealer-desc {
          margin: 0;
          font-size: 13px;
          color: var(--text-2);
        }

        .dealer-note {
          padding: 12px;
          background: rgba(0, 255, 135, 0.05);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-2);
          line-height: 1.5;
        }

        .dealer-note p {
          margin: 0;
        }

        .dealer-note strong {
          color: var(--text-1);
        }

        .severity-badge {
          min-width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          border: 2px solid;
          flex-shrink: 0;
        }

        .severity-badge.high {
          border-color: #ff5757;
          color: #ff5757;
        }

        .severity-badge.medium {
          border-color: #f5e642;
          color: #f5e642;
        }

        .severity-badge.low {
          border-color: #3dffa0;
          color: #3dffa0;
        }

        .disease-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: rgba(0, 255, 135, 0.05);
          border-radius: 12px;
        }

        .info-block label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-2);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-block p {
          margin: 0;
          font-size: 16px;
          color: var(--text-1);
        }

        .severity-text {
          font-weight: 600;
        }

        .severity-text.high {
          color: #ff5757;
        }

        .severity-text.medium {
          color: #f5e642;
        }

        .severity-text.low {
          color: #3dffa0;
        }

        .disease-description,
        .disease-treatment {
          margin-bottom: 24px;
        }

        .disease-description h3,
        .disease-treatment h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
          border-bottom: 1px solid rgba(0, 255, 135, 0.2);
          padding-bottom: 8px;
        }

        .disease-description p,
        .disease-treatment p {
          margin: 0 0 12px 0;
          color: var(--text-1);
          line-height: 1.6;
        }

        .disease-treatment ul {
          margin: 12px 0 0 0;
          padding-left: 20px;
          color: var(--text-1);
        }

        .disease-treatment li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .btn-advisory {
          width: 100%;
          padding: 12px 16px;
          background: var(--plasma);
          color: var(--bg-1);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          margin-top: 16px;
          transition: all 0.2s ease;
        }

        .btn-advisory:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .healthy-details-modal {
          text-align: center;
        }

        .healthy-header h2 {
          font-size: 28px;
          color: #3dffa0;
          margin: 0 0 24px 0;
        }

        .healthy-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px;
          background: rgba(61, 255, 160, 0.1);
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .healthy-message p {
          margin: 0;
          font-size: 16px;
          color: var(--text-1);
          line-height: 1.6;
        }

        .healthy-timestamp {
          text-align: left;
          padding: 16px;
          background: rgba(0, 255, 135, 0.05);
          border-radius: 8px;
        }

        .healthy-timestamp label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-2);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .healthy-timestamp p {
          margin: 0;
          color: var(--text-1);
        }
      `}</style>
    </div>
  );
}
