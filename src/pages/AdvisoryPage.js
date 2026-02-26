/* in the advisory page their are the languages so like that add in the 
home page left from the button scancrop and also do the setup of google 
translate when change the language according to that all page language will be changed */


import React, { useState } from 'react';
import { Droplets, Calendar, Leaf, AlertCircle, Thermometer, Wind, Sun, TrendingUp } from 'lucide-react';
import './AdvisoryPage.css';

const CAL = {
  January:   { kharif:'Harvest sugarcane, late paddy', rabi:'Care for wheat, mustard & gram', action:'Apply fertilizer to rabi crops; monitor for frost damage' },
  February:  { kharif:'Harvest rabi oilseeds', rabi:'Wheat heading stage — irrigation critical', action:'Monitor aphids on wheat; apply pesticide if needed' },
  March:     { kharif:'Land prep for upcoming season', rabi:'Wheat & mustard harvest begins', action:'Thresh and store rabi crops carefully in dry storage' },
  April:     { kharif:'Sow summer vegetables', rabi:'Complete rabi harvesting now', action:'Land preparation for kharif season begins immediately' },
  May:       { kharif:'Summer plowing, add compost', rabi:'Storage and marketing of produce', action:'Order seeds and fertilizers for the kharif season' },
  June:      { kharif:'Paddy nursery; soybean sowing', rabi:'—', action:'Start irrigation channels; prepare fields before monsoon' },
  July:      { kharif:'Transplant paddy; sow maize, cotton', rabi:'—', action:'Weed management is critical this month for kharif crops' },
  August:    { kharif:'Top-dress N fertilizer in paddy', rabi:'—', action:'Monitor kharif crops closely for fungal diseases' },
  September: { kharif:'Paddy flowering; soybean pod fill', rabi:'Prepare land for rabi sowing', action:'Harvest early kharif crops like soybean and maize' },
  October:   { kharif:'Harvest paddy, maize, soybean', rabi:'Sow wheat, mustard, chickpea', action:'Apply DAP and MOP as basal dose for rabi crops' },
  November:  { kharif:'Complete kharif harvest', rabi:'Rabi seedlings emerge — irrigate weekly', action:'First irrigation to rabi crops 3 weeks after sowing' },
  December:  { kharif:'—', rabi:'Wheat, mustard active growth stage', action:'Monitor for frost damage; apply potash to build resilience' },
};
const MONTHS = Object.keys(CAL);

const LANGS = ['English','Hindi','Tamil','Telugu','Marathi','Kannada','Bengali','Gujarati'];

const TIPS = [
  { icon:<Droplets size={20}/>, title:'Smart Irrigation', color:'#00ff87', tips:['Water early morning (5–8 AM) to cut evaporation','Use drip irrigation to save 40–60% water','Check soil moisture before each irrigation cycle','Avoid waterlogging — it causes severe root disease'] },
  { icon:<Leaf size={20}/>, title:'Soil Health', color:'#b8ff3c', tips:['Test soil pH every 2 years (ideal: 6.0–7.0)','Add farmyard manure (FYM) before every planting','Practice crop rotation to break disease cycles','Use green manure crops like dhaincha in summer'] },
  { icon:<AlertCircle size={20}/>, title:'Pest Management', color:'#ffe03a', tips:['Monitor crops twice a week during critical growth','Use pheromone traps for early pest detection','Follow IPM — biological control comes first','Spray pesticides at dawn or dusk only'] },
  { icon:<TrendingUp size={20}/>, title:'Yield Boosters', color:'#ffb23f', tips:['Apply Zinc and Boron micronutrients for higher yield','Use bio-fertilizers like Rhizobium for legumes','Intercropping improves land use efficiency','Mulching conserves soil moisture and suppresses weeds'] },
];

const SCHEMES = [
  { name:'PM-KISAN', desc:'₹6,000/year income support directly to farmer bank accounts', badge:'badge-green', bl:'Active' },
  { name:'PMFBY Insurance', desc:'Low-premium crop insurance against all natural disasters', badge:'badge-acid', bl:'Active' },
  { name:'Soil Health Card', desc:'Free soil testing and personalized fertilizer advisory', badge:'badge-green', bl:'Free' },
  { name:'eNAM Portal', desc:'Sell your produce online at the best market price nationwide', badge:'badge-amber', bl:'Digital' },
  { name:'Kisan Credit Card', desc:'Low-interest credit for all farming expenses at any time', badge:'badge-amber', bl:'Finance' },
  { name:'MIDH Scheme', desc:'Government subsidies for horticulture and orchard development', badge:'badge-acid', bl:'Subsidy' },
];

export default function AdvisoryPage() {
  const cur = MONTHS[new Date().getMonth()];
  const [month, setMonth] = useState(cur);
  const [lang, setLang]   = useState('English');
  const cal = CAL[month];

  return (
    <div className="adv-pg">
      <div className="adv-wrap">

        {/* Header */}
        <div className="adv-header au-fadeUp">
          <div className="eyebrow" style={{justifyContent:'center'}}>Farm Advisory</div>
          <h1 className="adv-title">
            Smart <span className="stroke">Farming</span><br/>Guide
          </h1>
          <p className="adv-sub">
            Seasonal insights, expert tips, and a live crop calendar —
            everything you need for a great harvest.
          </p>
        </div>

        {/* Language rail */}
        <div className="lang-rail au-fadeUp" style={{animationDelay:'0.08s'}}>
          <span className="lang-rail__lbl">Language</span>
          <div className="lang-pills">
            {LANGS.map(l => (
              <button key={l} className={`lang-pill ${lang===l?'lang-pill--on':''}`} onClick={()=>setLang(l)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="weather-card au-fadeUp" style={{animationDelay:'0.14s'}}>
          <div className="wx-main">
            <div className="wx-icon">⛅</div>
            <div>
              <div className="wx-cond">Partly Cloudy</div>
              <div className="wx-temp">28<sup>°C</sup></div>
            </div>
          </div>

          <div className="wx-stats">
            {[
              {icon:<Droplets size={18} color="#00ff87"/>, val:'72%', lbl:'Humidity'},
              {icon:<Wind      size={18} color="#b8ff3c"/>, val:'14 km/h', lbl:'Wind'},
              {icon:<Sun       size={18} color="#ffe03a"/>, val:'UV 6', lbl:'UV Index'},
              {icon:<Thermometer size={18} color="#ffb23f"/>, val:'34°', lbl:'Feels Like'},
            ].map((s,i) => (
              <div key={i} className="wx-stat">
                <div className="wx-stat__icon">{s.icon}</div>
                <div className="wx-stat__val">{s.val}</div>
                <div className="wx-stat__name">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="wx-adv">
            <div className="wx-adv__eyebrow"><span className="live-dot"/>Today's Advisory</div>
            <p className="wx-adv__text">
              Good conditions for spraying. Low wind speed ensures minimal drift.
              Carry out pending foliar applications today.
            </p>
            <div className="wx-adv__alert">🌧️ Light rain expected in 3 days</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="cal-card au-fadeUp" style={{animationDelay:'0.18s'}}>
          <div className="cal-card__top">
            <div className="cal-card__title">
              <Calendar size={20} color="#00ff87"/> Crop Calendar
            </div>
            <span className="cal-card__yr">2024 · India</span>
          </div>

          <div className="month-scroller">
            {MONTHS.map(m => (
              <button
                key={m}
                className={`month-chip ${month===m?'month-chip--on':''} ${m===cur?'month-chip--now':''}`}
                onClick={()=>setMonth(m)}
              >
                {m.slice(0,3)}
              </button>
            ))}
          </div>

          <div className="cal-body">
            <div className={`cal-col ${cal.kharif==='—'?'':''}` }>
              <div className="cal-eyebrow">🌾 Kharif Season</div>
              <p className={`cal-text ${cal.kharif==='—'?'cal-empty':''}`}>
                {cal.kharif==='—' ? 'No active kharif activities this month' : cal.kharif}
              </p>
            </div>
            <div className="cal-col">
              <div className="cal-eyebrow">🌿 Rabi Season</div>
              <p className={`cal-text ${cal.rabi==='—'?'cal-empty':''}`}>
                {cal.rabi==='—' ? 'No active rabi activities this month' : cal.rabi}
              </p>
            </div>
            <div className="cal-col cal-col--hi">
              <div className="cal-eyebrow">⚡ Action Required</div>
              <p className="cal-text">{cal.action}</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="tips-section au-fadeUp" style={{animationDelay:'0.22s'}}>
          <div className="tips-section__top">
            <span className="tips-section__title">
              <Thermometer size={20} color="#00ff87"/> Expert Farming Tips
            </span>
          </div>
          <div className="tips-2x2">
            {TIPS.map((b,i) => (
              <div key={i} className="tip-blk" style={{'--tc':b.color}}>
                <div className="tip-blk__head">
                  <div className="tip-blk__icon" style={{color:b.color, background:`${b.color}14`}}>
                    {b.icon}
                  </div>
                  <span className="tip-blk__title">{b.title}</span>
                </div>
                <ul className="tip-items">
                  {b.tips.map((t,j) => (
                    <li key={j} className="tip-item">
                      <span className="tip-bullet">→</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Schemes */}
        <div className="schemes-section au-fadeUp" style={{animationDelay:'0.26s'}}>
          <h3 className="schemes-title">🏛️ Government Schemes for Farmers</h3>
          <div className="schemes-3">
            {SCHEMES.map((s,i) => (
              <div key={i} className="scheme-tile">
                <span className={`badge ${s.badge}`}>{s.bl}</span>
                <div className="scheme-name">{s.name}</div>
                <p className="scheme-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Helpline */}
        <div className="helpline au-fadeUp" style={{animationDelay:'0.3s'}}>
          <div>
            <div className="helpline__emoji">🌾</div>
            <div className="helpline__title">Kisan Call Center</div>
            <p className="helpline__desc">Free 24/7 agricultural helpline for all farmers across India</p>
          </div>
          <div className="helpline__right">
            <div className="helpline__num">1800-180-1551</div>
            <div className="helpline__tag">Toll Free · 24 / 7</div>
          </div>
        </div>

      </div>
    </div>
  );
}