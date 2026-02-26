import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, RefreshCw, Leaf, Sprout, Info, ShoppingBag } from 'lucide-react';
import './ResultPage.css';

const DEALERS = [
  { name:'Agro Care Store', dist:'1.2 km', items:'Fungicides, Seeds, Fertilizers' },
  { name:"Kisan's Corner",  dist:'2.8 km', items:'Organic & Natural Remedies' },
  { name:'FarmMart India',  dist:'4.1 km', items:'All Agrochemicals' },
];

export default function ResultPage() {
  const [res, setRes] = useState(null);
  const [tab, setTab] = useState('about');
  const [treat, setTreat] = useState('chemical');
  const nav = useNavigate();

  useEffect(() => {
    const s = sessionStorage.getItem('cropResult');
    if (!s) { nav('/detect'); return; }
    setRes(JSON.parse(s));
  }, [nav]);

  if (!res) return null;
  const { disease, imageUrl, isHealthy, isDemo, allDetected } = res;

  if (isHealthy) return (
    <div className="result-pg">
      <div className="result-pg__wrap">
        <button className="res-back" onClick={()=>nav('/detect')}><ArrowLeft size={14}/> Back</button>
        <div className="healthy-wrap au-fadeUp">
          <div className="healthy-card">
            <div className="healthy-icon"><CheckCircle size={40} color="var(--plasma)"/></div>
            <h1 className="healthy-title">Your Crop is Healthy! 🎉</h1>
            <p className="healthy-body">No diseases detected. Your plant appears to be in excellent condition.</p>
            <div className="healthy-tips">
              <div className="healthy-tips__head">Maintenance Tips</div>
              <ul className="healthy-tips__list">
                {['Water at base only, early morning preferred','Monitor weekly for early signs of pests','Maintain proper spacing for airflow','Apply micronutrients for continued health'].map((t,i)=>(
                  <li key={i} className="healthy-tip">{t}</li>
                ))}
              </ul>
            </div>
            <div className="res-actions" style={{justifyContent:'center'}}>
              <Link to="/detect" className="btn-primary"><RefreshCw size={15}/> Scan Another</Link>
              <Link to="/advisory" className="btn-ghost"><Leaf size={15}/> Advisory</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const score = disease.severityScore;
  const lvl   = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
  const lvlLbl= score > 70 ? 'High Risk' : score > 40 ? 'Medium Risk' : 'Low Risk';
  const lvlC  = score > 70 ? 'var(--danger)' : score > 40 ? 'var(--caution)' : 'var(--plasma)';

  const segs = Array.from({length:10},(_,i) => i < Math.round(score/10));
  const segColor = (i) => i<3?'var(--plasma)':i<6?'var(--caution)':'var(--danger)';

  return (
    <div className="result-pg">
      <div className="result-pg__wrap">
        <button className="res-back au-fadeUp" onClick={()=>nav('/detect')}>
          <ArrowLeft size={14}/> Back to Scanner
        </button>

        {isDemo && (
          <div className="res-demo-bar au-fadeUp">
            🔬 <strong>Demo Mode</strong> — Showing sample results. Add Plant.id API key for real detection.
          </div>
        )}

        {/* Header */}
        <div className="res-header au-fadeUp">
          <div>
            <div className="eyebrow">Analysis Complete</div>
            <h1 className="res-header__title">{disease.name}</h1>
            <p className="res-header__meta">
              Detected with <strong style={{color:lvlC}}>{Math.round(disease.probability*100)}% confidence</strong>
              {disease.affectedCrops && ` · Affects: ${disease.affectedCrops.join(', ')}`}
            </p>
          </div>
          <div className={`sev-ring sev-ring--${lvl}`}>
            <div className="sev-ring__val">{score}</div>
            <div className="sev-ring__lbl" style={{color:lvlC}}>{lvlLbl}</div>
          </div>
        </div>

        {/* Grid */}
        <div className="res-grid">

          {/* Left */}
          <div className="res-left au-fadeUp" style={{animationDelay:'0.1s'}}>
            <div className="res-img-card">
              <img src={imageUrl} alt="crop" className="res-img"/>
              <div className="res-img-footer">
                <div>
                  <div className="res-img-name">{disease.name}</div>
                  <div className="res-img-conf">Confidence: {Math.round(disease.probability*100)}%</div>
                </div>
                <span className={`badge badge-${lvl==='high'?'red':lvl==='medium'?'yellow':'green'}`}>{lvlLbl}</span>
              </div>
            </div>

            <div className="sev-card">
              <div className="sev-card__top">
                <span className="sev-card__label">Severity Score</span>
                <span className="badge" style={{background:`color-mix(in srgb, ${lvlC} 15%, transparent)`,color:lvlC,borderColor:`color-mix(in srgb, ${lvlC} 35%, transparent)`}}>{score}/100</span>
              </div>
              <div className="sev-segs">
                {segs.map((lit,i)=>(
                  <div key={i} className="sev-seg" style={lit ? {background:segColor(i),boxShadow:`0 0 6px ${segColor(i)}60`} : {}}/>
                ))}
              </div>
              <div className="sev-nums"><span>Low</span><span>Medium</span><span>High</span></div>
            </div>

            {disease.affectedCrops && (
              <div className="meta-row">
                {disease.affectedCrops.map(c=><span key={c} className="tag">{c}</span>)}
              </div>
            )}

            {allDetected && allDetected.length > 1 && (
              <div className="alt-card">
                <div className="alt-card__label">Other Possibilities</div>
                {allDetected.slice(1).map((d,i)=>{
                  const c = d.severityScore>70?'var(--danger)':d.severityScore>40?'var(--caution)':'var(--plasma)';
                  return (
                    <div key={i} className="alt-row">
                      <span className="alt-name">{d.name}</span>
                      <div className="prog-track"><div className="prog-fill" style={{width:`${d.severityScore}%`,background:c}}/></div>
                      <span className="alt-pct" style={{color:c}}>{d.severityScore}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="res-right au-fadeUp" style={{animationDelay:'0.2s'}}>
            <div className="tab-panel">
              <div className="tab-bar">
                {[{k:'about',l:'About',i:<Info size={14}/>},{k:'treat',l:'Treatment',i:<Sprout size={14}/>},{k:'dealers',l:'Dealers',i:<ShoppingBag size={14}/>}].map(t=>(
                  <button key={t.k} className={`tab-btn ${tab===t.k?'tab-btn--on':''}`} onClick={()=>setTab(t.k)}>
                    {t.i} {t.l}
                  </button>
                ))}
              </div>

              <div className="tab-body">
                {tab==='about' && (
                  <>
                    <p className="desc-para">{disease.description}</p>
                    <div className="fact-grid">
                      {disease.affectedCrops && <div className="fact-cell"><div className="fact-cell__lbl">Affects</div><div className="fact-cell__val">{disease.affectedCrops.join(', ')}</div></div>}
                      {disease.seasonalRisk   && <div className="fact-cell"><div className="fact-cell__lbl">Seasonal Risk</div><div className="fact-cell__val">{disease.seasonalRisk}</div></div>}
                      <div className="fact-cell"><div className="fact-cell__lbl">Severity</div><div className="fact-cell__val" style={{color:lvlC}}>{lvlLbl}</div></div>
                      <div className="fact-cell"><div className="fact-cell__lbl">Confidence</div><div className="fact-cell__val">{Math.round(disease.probability*100)}%</div></div>
                    </div>
                  </>
                )}
                {tab==='treat' && (
                  <>
                    <div className="treat-toggle">
                      <button className={`treat-toggle-btn ${treat==='chemical'?'treat-toggle-btn--on':''}`} onClick={()=>setTreat('chemical')}>⚗️ Chemical</button>
                      <button className={`treat-toggle-btn ${treat==='organic'?'treat-toggle-btn--on':''}`}  onClick={()=>setTreat('organic')}>🌿 Organic</button>
                    </div>
                    <ol className="treat-list">
                      {(treat==='chemical'?disease.treatment:disease.organic||[]).map((s,i)=>(
                        <li key={i} className="treat-item">
                          <span className="treat-num">{i+1}</span>
                          <span className="treat-text">{s}</span>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
                {tab==='dealers' && (
                  <div className="dealer-list">
                    {DEALERS.map((d,i)=>(
                      <div key={i} className="dealer-row">
                        <div><div className="dealer-name">{d.name}</div><div className="dealer-items">{d.items}</div></div>
                        <div className="dealer-right">
                          <span className="dealer-dist">{d.dist}</span>
                          <span className="dealer-arr">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="res-actions">
              <Link to="/detect" className="btn-primary"><RefreshCw size={15}/> Scan New Crop</Link>
              <Link to="/advisory" className="btn-ghost"><Leaf size={15}/> Farm Advisory</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}