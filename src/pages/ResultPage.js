import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, RefreshCw, Leaf, Sprout, Info, ShoppingBag } from 'lucide-react';
import './ResultPage.css';
import { useLang } from '../context/LangContext';

const DEALERS = [
  { name:'Agro Care Store', dist:'1.2 km', items:'Fungicides, Seeds, Fertilizers' },
  { name:"Kisan's Corner",  dist:'2.8 km', items:'Organic & Natural Remedies' },
  { name:'FarmMart India',  dist:'4.1 km', items:'All Agrochemicals' },
];

export default function ResultPage() {
  const [res, setRes]     = useState(null);
  const [tab, setTab]     = useState('about');
  const [treat, setTreat] = useState('chemical');
  const nav = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    const s = sessionStorage.getItem('cropResult');
    if (!s) { nav('/detect'); return; }
    try { setRes(JSON.parse(s)); } catch (e) { nav('/detect'); }
  }, [nav]);

  if (!res) return null;

  const isHealthy = res.isHealthy ?? res.plantInfo?.isHealthy ?? false;
  if (isHealthy) {
    return (
      <div className="result-pg">
        <div className="result-pg__wrap">
          <button className="res-back" onClick={() => nav('/detect')}><ArrowLeft size={14}/> {t('res_back')}</button>

          <div className="healthy-wrap">
            <div className="healthy-card">
              <div className="healthy-icon"><CheckCircle size={40} color="var(--plasma)"/></div>
              <h1 className="healthy-title">{t('healthy')}</h1>
              <p className="healthy-body">{t('res_healthy_body') || t('res_healthy_msg') || ''}</p>

              <div className="healthy-tips">
                <div className="healthy-tips__head">{t('res_maintenance_tips')}</div>
                <ul className="healthy-tips__list">
                  {[t('res_tip_water'), t('res_tip_monitor'), t('res_tip_spacing'), t('res_tip_micronutrients')].map((e,i)=> e && <li key={i} className="healthy-tip">{e}</li>)}
                </ul>
              </div>

              <div className="res-actions" style={{justifyContent:'center'}}>
                <Link to="/detect" className="btn-primary"><RefreshCw size={15}/> {t('res_scan_new')}</Link>
                <Link to="/advisory" className="btn-ghost"><Leaf size={15}/> {t('hero_btn2')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { disease, imageUrl, allDetected } = res;
  const score  = disease?.severityScore ?? 0;
  const lvl    = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
  const lvlLbl = score > 70 ? t('high_risk') : score > 40 ? t('medium_risk') : t('low_risk');
  const lvlC   = score > 70 ? 'var(--danger)' : score > 40 ? 'var(--caution)' : 'var(--plasma)';

  return (
    <div className="result-pg">
      <div className="result-pg__wrap">
        <button className="res-back" onClick={() => nav('/detect')}><ArrowLeft size={14}/> {t('res_back')}</button>

        <div className="res-header">
          <div>
            <div className="eyebrow">{t('res_complete')}</div>
            <h1 className="res-header__title">{disease?.name}</h1>
            <p className="res-header__meta">{t('det_model_status')} <strong style={{color:lvlC}}>{Math.round((disease?.probability||0)*100)}% {t('label_confidence')}</strong></p>
          </div>
          <div className={`sev-ring sev-ring--${lvl}`}>
            <div className="sev-ring__val">{Math.round(disease?.severityScore||0)}</div>
            <div className="sev-ring__lbl" style={{color:lvlC}}>{lvlLbl}</div>
          </div>
        </div>

        <div className="res-grid">
          <div className="res-left">
            <div className="res-img-card">
              <img src={imageUrl} alt={disease?.name} className="res-img"/>
              <div className="res-img-footer">
                <div>
                  <div className="res-img-name">{disease?.name}</div>
                  <div className="res-img-conf">{Math.round((disease?.probability||0)*100)}% {t('label_confidence')}</div>
                </div>
                <span className={`badge badge-${lvl==='high'?'red':lvl==='medium'?'yellow':'green'}`}>{lvlLbl}</span>
              </div>
            </div>

            <div className="sev-card">
              <div className="sev-card__top">
                <span className="sev-card__label">{t('label_severity')}</span>
                <span className="badge" style={{background:`color-mix(in srgb, ${lvlC} 15%, transparent)`,color:lvlC,borderColor:`color-mix(in srgb, ${lvlC} 35%, transparent)`}}>{Math.round(disease?.severityScore||0)}/100</span>
              </div>
            </div>

            {disease?.affectedCrops?.length > 0 && (
              <div className="meta-row">
                {disease.affectedCrops.map(c=><span key={c} className="tag">{c}</span>)}
              </div>
            )}

            {allDetected && allDetected.length > 1 && (
              <div className="alt-card">
                <div className="alt-card__label">{t('res_other_possibilities')}</div>
                {allDetected.slice(1).map((d,i)=>{
                  const c = d.severityScore>70 ? 'var(--danger)' : d.severityScore>40 ? 'var(--caution)' : 'var(--plasma)';
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

          <div className="res-right">
            <div className="tab-panel">
              <div className="tab-bar">
                {[{k:'about',l:t('tab_about'), i:<Info size={14}/>},{k:'treat',l:t('tab_treatment'), i:<Sprout size={14}/>},{k:'dealers',l:t('tab_dealers'), i:<ShoppingBag size={14}/> }].map(td=> (
                  <button key={td.k} className={`tab-btn ${tab===td.k?'tab-btn--on':''}`} onClick={()=>setTab(td.k)}>{td.i} {td.l}</button>
                ))}
              </div>

              <div className="tab-body">
                {tab==='about' && (
                  <>
                    <p className="desc-para">{disease?.description || t('disease_description')}</p>
                    <div className="fact-grid">
                      {disease?.affectedCrops?.length > 0 && <div className="fact-cell"><div className="fact-cell__lbl">{t('label_detected')}</div><div className="fact-cell__val">{disease.affectedCrops.join(', ')}</div></div>}
                      {disease?.seasonalRisk && <div className="fact-cell"><div className="fact-cell__lbl">{t('seasonal_risk')}</div><div className="fact-cell__val">{disease.seasonalRisk}</div></div>}
                      <div className="fact-cell"><div className="fact-cell__lbl">{t('label_severity')}</div><div className="fact-cell__val" style={{color:lvlC}}>{lvlLbl}</div></div>
                      <div className="fact-cell"><div className="fact-cell__lbl">{t('label_confidence')}</div><div className="fact-cell__val">{Math.round((disease?.probability||0)*100)}%</div></div>
                    </div>
                  </>
                )}

                {tab==='treat' && (
                  <>
                    <div className="treat-toggle">
                      <button className={`treat-toggle-btn ${treat==='chemical'?'treat-toggle-btn--on':''}`} onClick={()=>setTreat('chemical')}>⚗️ {t('tab_treatment')}</button>
                      <button className={`treat-toggle-btn ${treat==='organic'?'treat-toggle-btn--on':''}`} onClick={()=>setTreat('organic')}>🌿 {t('tab_dealers')}</button>
                    </div>
                    <ol className="treat-list">
                      {(treat==='chemical' ? disease.treatment : disease.organic || []).map((s,i)=>(
                        <li key={i} className="treat-item"><span className="treat-num">{i+1}</span><span className="treat-text">{s}</span></li>
                      ))}
                    </ol>
                  </>
                )}

                {tab==='dealers' && (
                  <div className="dealer-list">
                    {DEALERS.map((d,i)=>(
                      <div key={i} className="dealer-row">
                        <div><div className="dealer-name">{d.name}</div><div className="dealer-items">{d.items}</div></div>
                        <div className="dealer-right"><span className="dealer-dist">{d.dist}</span><span className="dealer-arr">→</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="res-actions">
              <Link to="/detect" className="btn-primary"><RefreshCw size={15}/> {t('res_scan_new')}</Link>
              <Link to="/advisory" className="btn-ghost"><Leaf size={15}/> {t('adv_title2')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
