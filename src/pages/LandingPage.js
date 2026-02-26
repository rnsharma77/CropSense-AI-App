import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Microscope, Sprout, BookOpen, Globe, Leaf, Clock, TrendingUp, ChevronRight, Shield } from 'lucide-react';
import './LandingPage.css';

const TICKER = ['Late Blight 🍅','Powdery Mildew 🌾','Leaf Rust 🌽','Root Rot 🥔','Bacterial Wilt 🫑','Mosaic Virus 🥒','Anthracnose 🍃','Fusarium Wilt 🌱','Downy Mildew 🫛','Grey Mold 🍇'];

const STATS = [
  { val:'40%', lbl:'Crop loss prevented' },
  { val:'2.8s', lbl:'Average scan time' },
  { val:'50+', lbl:'Diseases detected' },
  { val:'12', lbl:'Languages supported' },
];

const FEATS = [
  { icon:<Sprout size={22}/>, title:'Smart Treatment', body:'Chemical & organic remedy plans tailored to your crop and disease severity.', c:'#b8ff3c' },
  { icon:<BookOpen size={22}/>, title:'Crop Calendar', body:'Month-by-month farming guide with weather insights and planting tips.', c:'#ffb23f' },
  { icon:<Globe size={22}/>, title:'Multi-Language', body:'Hindi, English, Tamil, Telugu, Marathi and 7 more regional languages.', c:'#a78bfa' },
  { icon:<Shield size={22}/>, title:'Govt Schemes', body:'PM-KISAN, PMFBY, Soil Health Cards — all key subsidies in one place.', c:'#ff3d3d' },
];

const STEPS = [
  { emoji:'📸', title:'Take a Photo', body:'Snap the affected leaf clearly in natural daylight.', n:'01' },
  { emoji:'🤖', title:'AI Analyzes', body:'Our model scans 50+ diseases in under 3 seconds.', n:'02' },
  { emoji:'📋', title:'Get Results', body:'Disease name, severity score, and full treatment.', n:'03' },
  { emoji:'✅', title:'Take Action', body:'Find nearby dealers and apply the remedy today.', n:'04' },
];

const CROPS = [
  {l:'Wheat',c:'#f5e642'},{l:'Rice Paddy',c:'#00ff87'},{l:'Sugarcane',c:'#ffb23f'},
  {l:'Tomato',c:'#ff5757'},{l:'Cotton',c:'#ffffff'},{l:'Soybean',c:'#b8ff3c'},
  {l:'Maize',c:'#f5e642'},{l:'Potato',c:'#ffb23f'},{l:'Chili',c:'#ff5757'},
  {l:'Onion',c:'#c084fc'},{l:'Mango',c:'#ffb23f'},{l:'Banana',c:'#f5e642'},
];

export default function LandingPage() {
  const dbl = [...TICKER,...TICKER];
  const dblC1 = [...CROPS,...CROPS];
  const dblC2 = [...CROPS.slice(6),...CROPS.slice(0,6),...CROPS.slice(6),...CROPS.slice(0,6)];

  return (
    <div className="land">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-ring hero-ring-1" />
        <div className="hero-ring hero-ring-2" />
        <div className="hero-ring hero-ring-3" />

        <div className="hero-pill au-fadeUp d0">
          <span className="live-dot" />
          AI Model Online · <b>Free to Use</b>
        </div>

        <h1 className="hero-h1 au-fadeUp d1">
          <span className="line-1">Detect Crop</span>
          <span className="line-2">Diseases</span>
          <span className="line-3">Instantly</span>
        </h1>

        <p className="hero-sub au-fadeUp d2">
          Point your camera at any affected leaf. Get instant AI diagnosis,
          treatment plans, and nearby dealer locations in under 3 seconds.
        </p>

        <div className="hero-btns au-fadeUp d3">
          <Link to="/detect" className="btn-primary">
            <Zap size={18}/> Start Free Scan
          </Link>
          <Link to="/advisory" className="btn-ghost">
            <Leaf size={16}/> Farm Advisory
          </Link>
        </div>

        {/* Mockup */}
        <div className="hero-mockup au-fadeUp d4">
          <div className="hero-datacards">
            <div className="hero-datacard au-float" style={{animationDelay:'0.2s'}}>
              <div className="hero-datacard__eyebrow"><TrendingUp size={11} style={{display:'inline'}}/> Accuracy</div>
              <div className="hero-datacard__val">94%</div>
              <div className="hero-datacard__sub">Detection rate</div>
            </div>
            <div className="hero-datacard au-float" style={{animationDelay:'1.1s'}}>
              <div className="hero-datacard__eyebrow"><Clock size={11} style={{display:'inline'}}/> Speed</div>
              <div className="hero-datacard__val">2.8s</div>
              <div className="hero-datacard__sub">Per diagnosis</div>
            </div>
          </div>

          {/* Phone */}
          <div className="hero-phone">
            <div className="hero-phone__bar">
              <div className="hero-phone__dot" style={{background:'#ff5757'}}/>
              <div className="hero-phone__dot" style={{background:'#ffe03a'}}/>
              <div className="hero-phone__dot" style={{background:'#00ff87'}}/>
            </div>
            <div className="hero-scan">
              <div className="hero-scan__br-tl"/>
              <div className="hero-scan__br-br"/>
              <div className="hero-scan__beam"/>
              <div className="hero-scan__emoji">🍃</div>
            </div>
            <div className="hero-result">
              <div className="hero-result__label">⚠ Disease Detected</div>
              <div className="hero-result__name">Late Blight</div>
              <div className="hero-result__bar">
                <span>Severity</span>
                <div className="hero-result__track"><div className="hero-result__fill"/></div>
                <span style={{color:'#ffb23f',fontWeight:700}}>67%</span>
              </div>
            </div>
          </div>

          <div className="hero-datacards">
            <div className="hero-datacard au-float" style={{animationDelay:'0.7s'}}>
              <div className="hero-datacard__eyebrow"><Microscope size={11} style={{display:'inline'}}/> Database</div>
              <div className="hero-datacard__val">50+</div>
              <div className="hero-datacard__sub">Diseases listed</div>
            </div>
            <div className="hero-datacard au-float" style={{animationDelay:'1.5s'}}>
              <div className="hero-datacard__eyebrow"><Globe size={11} style={{display:'inline'}}/> Languages</div>
              <div className="hero-datacard__val">12</div>
              <div className="hero-datacard__sub">Regional langs</div>
            </div>
          </div>
        </div>

        <div className="hero-bubble hero-bubble-a au-fadeUp d5">✓ Treatment Ready</div>
        <div className="hero-bubble hero-bubble-b au-fadeUp d5">🌿 50+ Diseases</div>
        <div className="hero-bubble hero-bubble-c au-fadeUp d5">★ Free Forever</div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker__belt">
          {dbl.map((d,i) => (
            <div key={i} className="ticker__item">
              <em>●</em> {d}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="wrap">
          <div className="stats__grid">
            {STATS.map((s,i) => (
              <div key={i} className="stats__cell">
                <span className="stats__val">{s.val}</span>
                <span className="stats__label">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="feats">
        <div className="wrap">
          <div className="feats__head">
            <div>
              <div className="eyebrow">Platform</div>
              <h2 className="feats__title">
                A Complete <span className="fill">AgriTech</span><br/>
                <span className="stroke">Platform</span>
              </h2>
            </div>
            <p className="feats__body">
              Built from the ground up for Indian farmers. No expertise needed —
              just point, shoot, and get answers in your language.
            </p>
          </div>

          {/* Large hero card */}
          <div className="feat-hero">
            <div className="feat-hero__content">
              <div className="feat-hero__icon"><Microscope size={24}/></div>
              <h3 className="feat-hero__title">Instant AI Disease Detection</h3>
              <p className="feat-hero__body">
                Trained on 100,000+ crop images. Detects 50+ diseases with 94% accuracy.
                Chemical & organic treatment plans included for every diagnosis.
              </p>
              <Link to="/detect" className="btn-primary" style={{fontSize:14,padding:'11px 22px'}}>
                Try it now <ChevronRight size={16}/>
              </Link>
            </div>
            <div className="feat-hero__visual">
              <div className="feat-hero__visual-emoji">🌿</div>
            </div>
          </div>

          {/* 4 small feature cards */}
          <div className="feat-grid">
            {FEATS.map((f,i) => (
              <div key={i} className="feat-card" style={{'--fc':f.c}}>
                <div className="feat-card__icon" style={{color:f.c,background:`${f.c}16`}}>{f.icon}</div>
                <h3 className="feat-card__title">{f.title}</h3>
                <p className="feat-card__body">{f.body}</p>
                <div className="feat-card__arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="hiw">
        <div className="wrap">
          <div className="hiw__header">
            <div className="eyebrow" style={{justifyContent:'center'}}>Process</div>
            <h2 className="hiw__title">4 Steps to <span className="fill">Save</span> Your Crop</h2>
          </div>
          <div className="hiw__grid">
            {STEPS.map((s,i) => (
              <div key={i} className="hiw-step">
                <div className="hiw-step__node" data-num={s.n}>{s.emoji}</div>
                <h3 className="hiw-step__title">{s.title}</h3>
                <p className="hiw-step__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CROP MARQUEE ── */}
      <div className="crop-roll">
        <div className="crop-row">
          {dblC1.map((c,i) => (
            <div key={i} className="crop-pill">
              <span className="crop-pill__dot" style={{background:c.c,boxShadow:`0 0 6px ${c.c}`}}/>
              {c.l}
            </div>
          ))}
        </div>
        <div className="crop-row crop-row--rev">
          {dblC2.map((c,i) => (
            <div key={i} className="crop-pill">
              <span className="crop-pill__dot" style={{background:c.c,boxShadow:`0 0 6px ${c.c}`}}/>
              {c.l}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-s">
        <div className="wrap">
          <div className="cta-box">
            <div className="cta-box__orb"/>
            <div className="eyebrow" style={{justifyContent:'center'}}>Get Started</div>
            <h2 className="cta-box__title">Protect Your Harvest.<br/>Start For Free Today.</h2>
            <p className="cta-box__body">
              Join farmers across India using AI to detect diseases early and save their crops.
            </p>
            <div className="cta-box__btns">
              <Link to="/detect" className="btn-primary"><Zap size={18}/> Start Crop Scan — Free</Link>
              <Link to="/advisory" className="btn-ghost"><BookOpen size={16}/> Explore Advisory</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer__inner">
            <Link to="/" className="nav__logo" style={{textDecoration:'none'}}>
              <div className="nav__logo-icon" style={{width:30,height:30,fontSize:15}}>🌿</div>
              <span className="nav__logo-text" style={{fontSize:16}}>CropSense<em>AI</em></span>
            </Link>
            <p className="footer__copy">© 2024 CropSense AI · Built for farmers, by innovators.</p>
            <div className="footer__links">
              <Link to="/privacy" className="footer__link">Privacy</Link>
              <Link to="/api" className="footer__link">API</Link>
              <Link to="/contact" className="footer__link">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}