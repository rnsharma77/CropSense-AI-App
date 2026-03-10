import React, { useState, useCallback } from 'react';
import { useLang } from '../context/LangContext';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, Camera, Leaf, CheckCircle, X, Zap, Cpu } from 'lucide-react';
import { analyzeDisease, imageToBase64 } from '../services/plantApi';
import './DetectorPage.css';

export default function DetectorPage() {
  const { t } = useLang();
  const [img, setImg]         = useState(null);
  const [file, setFile]       = useState(null);
  const [running, setRunning] = useState(false);
  const [step, setStep]       = useState(0);
  const nav = useNavigate();

  const STEPS = [
    t('step_photo_title') || t('det_choose_photo'),
    t('step_ai_title') || t('det_model_status'),
    t('step_results_title') || t('res_complete'),
    t('step_action_title') || t('cta_explore_advisory'),
  ];

  const TIPS = [
    t('det_tip_focus'),
    t('det_tip_natural_light'),
    t('det_tip_show_area'),
    t('det_tip_no_shadows'),
  ];

  const onDrop = useCallback((files) => {
    const f = files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error(t('det_error_image_too_large')); return; }
    setFile(f);
    setImg(URL.createObjectURL(f));
    toast.success(t('det_toast_image_loaded'));
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept:{'image/*':['.jpg','.jpeg','.png','.webp']}, maxFiles:1,
  });

  const analyze = async () => {
    if (!file) { toast.error(t('det_error_please_upload')); return; }
    setRunning(true);
    try {
      setStep(0);
      await new Promise(r => setTimeout(r, 300));

      setStep(1);
      const b64 = await imageToBase64(file);

      setStep(2);
      const res = await analyzeDisease(b64);

      setStep(3);
      await new Promise(r => setTimeout(r, 300));

      // Save result and navigate
      sessionStorage.setItem('cropResult', JSON.stringify(res));
      nav('/result');
    } catch (e) {
      toast.error(e.message || t('det_toast_analysis_failed'));
    } finally {
      setRunning(false);
      setStep(0);
    }
  };

  return (
    <div className="detector">
      <div className="detector__wrap">
        <div className="det-header">
          <div>
            <div className="eyebrow">{t('det_eyebrow')}</div>
            <h1 className="det-title">{t('det_title1')}<br/>{t('det_title2')}</h1>
            <p className="det-sub">{t('det_sub')}</p>
          </div>
          <div className="det-status">
            <span className="live-dot"/> {t('det_model_status')}
          </div>
        </div>

        <div className="det-grid">
          <div className="det-left">
            <div {...getRootProps()} className={`upload-zone ${isDragActive?'upload-zone--drag':''}`}>
              <input {...getInputProps()} />
              <div className="upload-icon"><Upload size={30}/></div>
              <h3 className="upload-title">{isDragActive ? t('drop_it_here') : t('det_upload_title')}</h3>
              <p className="upload-body">{t('det_upload_hint')}</p>
              <div className="upload-formats">{['JPG','PNG','WEBP','Max 10MB'].map(f=><span key={f} className="upload-format">{f}</span>)}</div>
              <button className="upload-btn" type="button"><Camera size={15}/> {t('det_choose_photo')}</button>
            </div>

            {img && (
              <div className="img-stage">
                <img src={img} alt={t('det_choose_photo')} className="img-stage__img"/>
                <button className="img-stage__del" onClick={()=>{setImg(null);setFile(null);}}><X size={16}/></button>
              </div>
            )}

            <div className="prog-panel">
              {STEPS.map((s,i)=>(
                <div key={i} className={`prog-row ${i<step?'prog-row--done':i===step?'prog-row--active':''}`}>
                  <div className="prog-icon">{i<step ? <CheckCircle size={14} color="var(--plasma)"/> : <div className="prog-circle"/>}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div style={{marginTop:12}}>
              <button className="analyze-btn" onClick={analyze} disabled={!img||running}>
                {running ? <><div className="spin-btn"/> {t('analyzing')}</> : <><Zap size={18}/> {t('det_analyze')}</>}
              </button>
            </div>
          </div>

          <div className="det-panel">
            <div className="info-card">
              <div className="info-card__title"><Leaf size={17} color="var(--plasma)"/> {t('det_photo_tips')}</div>
              <ul className="tips-list">
                {TIPS.map((tip,i)=>(<li key={i} className="tips-item">{tip}</li>))}
              </ul>
            </div>

            <div className="info-card">
              <div className="info-card__title"><Cpu size={16} color="var(--plasma)"/> {t('det_detectable_title')}</div>
              <div className="disease-tags">
                {/* Show a few disease names as tags */}
                {['disease_late_blight','disease_leaf_rust','disease_powdery_mildew','disease_bacterial_wilt'].map(k=> <span key={k} className="tag">{t(k)}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
