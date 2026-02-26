import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, Camera, Leaf, CheckCircle, X, Zap, Cpu } from 'lucide-react';
import { analyzeDisease, imageToBase64 } from '../services/plantApi';
import './DetectorPage.css';

const STEPS = ['Uploading image...','Detecting plant species...','Scanning for pathogens...','Generating treatment plan...','Analysis complete!'];
const TIPS  = ['Ensure the leaf is in sharp focus with no blur','Photograph in natural daylight for best accuracy','Show the entire affected area of the leaf','Avoid shadows or glare covering the disease spots'];
const DISEASES = ['Late Blight','Leaf Rust','Powdery Mildew','Bacterial Wilt','Leaf Spot','Mosaic Virus','Root Rot','Downy Mildew','Anthracnose','Fusarium Wilt','Grey Mold','Scab','Alternaria','Smut'];

export default function DetectorPage() {
  const [img, setImg]     = useState(null);
  const [file, setFile]   = useState(null);
  const [running, setRunning] = useState(false);
  const [step, setStep]   = useState(0);
  const nav = useNavigate();

  const onDrop = useCallback((files) => {
    const f = files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error('Image too large. Max 10MB.'); return; }
    setFile(f);
    setImg(URL.createObjectURL(f));
    toast.success('Image loaded!');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept:{'image/*':['.jpg','.jpeg','.png','.webp']}, maxFiles:1,
  });

  const analyze = async () => {
    if (!file) { toast.error('Please upload a crop image first!'); return; }
    setRunning(true); setStep(0);
    try {
      for (let i = 0; i < STEPS.length - 1; i++) { setStep(i); await new Promise(r=>setTimeout(r,650)); }
      const b64 = await imageToBase64(file);
      const res = await analyzeDisease(b64);
      setStep(STEPS.length - 1);
      await new Promise(r=>setTimeout(r,400));
      sessionStorage.setItem('cropResult', JSON.stringify({...res, imageUrl:img}));
      nav('/result');
    } catch(e) {
      toast.error(e.message || 'Analysis failed.');
      setRunning(false); setStep(0);
    }
  };

  return (
    <div className="detector">
      <div className="detector__wrap">

        {/* Header */}
        <div className="det-header au-fadeUp">
          <div>
            <div className="eyebrow">Disease Scanner</div>
            <h1 className="det-title">Crop Disease<br/>Detector</h1>
            <p className="det-sub">Upload a clear photo of your affected crop leaf for instant AI diagnosis</p>
          </div>
          <div className="det-status">
            <span className="live-dot"/>
            AI Model: <b>Online · 94% Accuracy</b>
          </div>
        </div>

        {/* Grid */}
        <div className="det-grid">

          {/* Left */}
          <div className="au-fadeUp" style={{animationDelay:'0.1s'}}>
            {!img ? (
              <div {...getRootProps()} className={`upload-zone ${isDragActive?'upload-zone--drag':''}`}>
                <input {...getInputProps()}/>
                <div className="uz-corner uz-tl"/><div className="uz-corner uz-tr"/>
                <div className="uz-corner uz-bl"/><div className="uz-corner uz-br"/>
                <div className="upload-icon"><Upload size={30}/></div>
                <h3 className="upload-title">{isDragActive ? 'Drop it here!' : 'Upload Leaf Photo'}</h3>
                <p className="upload-body">Drag & drop your crop image here, or click to browse your device gallery</p>
                <div className="upload-formats">
                  {['JPG','PNG','WEBP','Max 10MB'].map(f=><span key={f} className="upload-format">{f}</span>)}
                </div>
                <button className="upload-btn"><Camera size={15}/> Choose Photo</button>
              </div>
            ) : (
              <div className="img-stage">
                {!running && (
                  <button className="img-stage__del" onClick={()=>{setImg(null);setFile(null);}}>
                    <X size={16}/>
                  </button>
                )}
                <img src={img} alt="Crop" className="img-stage__img"/>
                {running && (
                  <div className="scan-ov">
                    <div className="scan-ov__beam"/>
                    <div className="scan-ov__label">{STEPS[step]}</div>
                    <div className="scan-ov__dots">
                      {[0,1,2].map(i=><div key={i} className="scan-ov__dot" style={{animationDelay:`${i*0.2}s`}}/>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button className="analyze-btn" onClick={analyze} disabled={!img||running}>
              {running ? <><div className="spin-btn"/> Analyzing…</> : <><Zap size={18}/> Detect Disease Now</>}
            </button>

            {running && (
              <div className="prog-panel">
                {STEPS.map((s,i)=>(
                  <div key={i} className={`prog-row ${i<step?'prog-row--done':i===step?'prog-row--active':''}`}>
                    <div className="prog-icon">
                      {i<step ? <CheckCircle size={14} color="var(--plasma)"/> :
                       i===step ? <div className="prog-spin"/> :
                       <div className="prog-circle"/>}
                    </div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="det-panel au-fadeUp" style={{animationDelay:'0.2s'}}>

            <div className="info-card">
              <div className="info-card__title"><Leaf size={17} color="var(--plasma)"/> Photo Tips</div>
              <ul className="tips-list">
                {TIPS.map((t,i)=>(
                  <li key={i} className="tips-item">
                    <CheckCircle size={14} color="var(--plasma)" style={{flexShrink:0,marginTop:1}}/>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="info-card">
              <div className="info-card__title">
                <Cpu size={16} color="var(--plasma)"/> Detectable Diseases
              </div>
              <div className="disease-tags">
                {DISEASES.map(d=><span key={d} className="tag">{d}</span>)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}