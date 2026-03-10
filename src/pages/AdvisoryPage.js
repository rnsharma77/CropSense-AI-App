import React, { useState, useEffect } from 'react';
import { Droplets, Calendar, Leaf, AlertCircle, Thermometer, Wind, Sun, TrendingUp, MapPin, RefreshCw, Zap, Shield } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { fetchWeather, INDIAN_CITIES } from '../services/weatherApi';
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

const TIPS = [
  { icon:<Droplets size={20}/>, title:'Smart Irrigation', color:'#00ff87', tips:['Water early morning or late evening to reduce evaporation','Water at soil level, not on leaves, to prevent fungal diseases','Use drip irrigation to save up to 60% water and nutrients'] },
  { icon:<Leaf size={20}/>, title:'Soil Health', color:'#b8ff3c', tips:['Test soil pH every 2 years for optimal nutrient uptake','Rotate crops annually to naturally replenish soil nitrogen','Add compost or farmyard manure at the start of each season'] },
  { icon:<AlertCircle size={20}/>, title:'Pest Management', color:'#ffe03a', tips:['Monitor crops twice weekly for early pest detection','Use neem oil spray for organic pest control without chemicals','Introduce beneficial insects like ladybugs to control aphids naturally'] },
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
  const [month, setMonth]     = useState(cur);
  const [city, setCity]       = useState('Delhi,IN');
  const [weather, setWeather] = useState(null);
  const [wxLoading, setWxLoading] = useState(false);
  const { t } = useLang();
  const cal = CAL[month];

  const loadWeather = async (c) => {
    setWxLoading(true);
    try {
      const data = await fetchWeather(c);
      setWeather(data);
    } catch (e) { console.error(e); }
    finally { setWxLoading(false); }
  };

  useEffect(() => {
    loadWeather(city);
  }, [city]);

  return (
    <div className="adv-pg">
      <div className="adv-wrap">
        {/* Header Section */}
        <div className="adv-header au-fadeUp">
          <div className="eyebrow" style={{justifyContent:'center'}}>{t('farm_advisory') || 'FARM ADVISORY'}</div>
          <h1 className="adv-title">
            {t('adv_title1') || 'Smart'}<span className="stroke">{t('adv_title2') || 'Agricultural'}</span><br/>
            {t('adv_title3') || 'Guidance'}
          </h1>
          <p className="adv-sub">{t('adv_sub') || 'Get real-time weather, seasonal calendar, and expert tips for your region'}</p>
        </div>

        {/* Weather Card */}
        <div className="weather-card au-fadeUp" style={{animationDelay:'0.1s'}}>
          <div className="wx-top-bar">
            <div className="wx-city-row">
              <MapPin size={14} color="var(--plasma)"/>
              <select className="wx-city-select" value={city} onChange={e => setCity(e.target.value)}>
                {INDIAN_CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <button className="wx-refresh" onClick={()=>loadWeather(city)} disabled={wxLoading}>
                <RefreshCw size={13} className={wxLoading?'spin-icon':''}/>
              </button>
              <span className="wx-live-tag"><span className="live-dot" style={{width:6,height:6}}/>{t('live') || 'Live'}</span>
            </div>
          </div>

          {wxLoading ? (
            <div className="wx-loading">
              <div className="wx-spin"/>
              <span>{t('fetching_weather') || 'Fetching weather...'}</span>
            </div>
          ) : weather ? (
            <div className="wx-body">
              <div className="wx-main-row">
                <div className="wx-main">
                  <div className="wx-icon">{weather.icon}</div>
                  <div>
                    <div className="wx-cond">{weather.condition}</div>
                    <div className="wx-temp">{weather.temp}<sup>°C</sup></div>
                    <div className="wx-city-name">{weather.city}, {weather.country}</div>
                  </div>
                </div>
                <div className="wx-stats">
                  {[
                    { icon:<Droplets size={18} color="#00ff87"/>, val:`${weather.humidity}%`, lbl:t('wx_humidity') || 'Humidity' },
                    { icon:<Wind size={18} color="#b8ff3c"/>, val:`${weather.windSpeed} km/h`, lbl:t('wx_wind') || 'Wind' },
                    { icon:<Sun size={18} color="#ffe03a"/>, val:weather.uvIndex, lbl:t('wx_uv') || 'UV Index' },
                    { icon:<Thermometer size={18} color="#ffb23f"/>, val:`${weather.feelsLike}°`, lbl:t('wx_feels') || 'Feels Like' },
                  ].map((s,i)=>(
                    <div key={i} className="wx-stat">
                      <div className="wx-stat__icon">{s.icon}</div>
                      <div className="wx-stat__val">{s.val}</div>
                      <div className="wx-stat__name">{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              {weather.forecast?.length > 0 && (
                <div className="wx-forecast">
                  {weather.forecast.map((f,i)=>(
                    <div key={i} className="wx-fc-slot">
                      <div className="wx-fc-time">{f.time}</div>
                      <div className="wx-fc-icon">{f.icon}</div>
                      <div className="wx-fc-temp">{f.temp}°</div>
                      {f.rain > 0.1 && <div className="wx-fc-rain">🌧 {f.rain}mm</div>}
                    </div>
                  ))}
                </div>
              )}

              <div className="wx-adv">
                <div className="wx-adv__eyebrow"><span className="live-dot"/>{t('advisory_today') || 'Today'}</div>
                <p className="wx-adv__text">{weather.advisory?.text || 'Weather advisory coming soon'}</p>
                {weather.advisory?.alert && <div className="wx-adv__alert">{weather.advisory.alert}</div>}
              </div>
            </div>
          ) : null}
        </div>

        {/* Crop Calendar */}
        <div className="cal-card au-fadeUp" style={{animationDelay:'0.18s'}}>
          <div className="cal-card__top">
            <div className="cal-card__title"><Calendar size={20} color="#00ff87"/>{t('crop_calendar') || 'Crop Calendar'}</div>
            <span className="cal-card__yr">2024 India</span>
          </div>
          <div className="month-scroller">
            {MONTHS.map(m=>(
              <button key={m}
                className={`month-chip ${month===m?'month-chip--on':''} ${m===cur?'month-chip--now':''}`}
                onClick={()=>setMonth(m)}>{m.slice(0,3)}</button>
            ))}
          </div>
          <div className="cal-body">
            <div className="cal-col">
              <div className="cal-eyebrow">{t('kharif_season') || 'Kharif Season'}</div>
              <p className={`cal-text ${cal.kharif==='—'?'cal-empty':''}`}>{cal.kharif==='—'?'No active activities this month':cal.kharif}</p>
            </div>
            <div className="cal-col">
              <div className="cal-eyebrow">{t('rabi_season') || 'Rabi Season'}</div>
              <p className={`cal-text ${cal.rabi==='—'?'cal-empty':''}`}>{cal.rabi==='—'?'No active activities this month':cal.rabi}</p>
            </div>
            <div className="cal-col cal-col--hi">
              <div className="cal-eyebrow">{t('action_required') || 'Action Required'}</div>
              <p className="cal-text">{cal.action}</p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section au-fadeUp" style={{animationDelay:'0.22s'}}>
          <div className="tips-section__top">
            <span className="tips-section__title"><Zap size={20} color="#00ff87"/>{t('expert_tips') || 'Expert Farming Tips'}</span>
          </div>
          <div className="tips-2x2">
            {TIPS.map((tip, i) => (
              <div key={i} className="tip-card" style={{'--tip-color': tip.color}}>
                <div className="tip-card__icon" style={{background: `${tip.color}16`, color: tip.color}}>{tip.icon}</div>
                <h3 className="tip-card__title">{tip.title}</h3>
                <ul className="tip-card__list">
                  {tip.tips.map((t, j) => <li key={j}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Schemes Section */}
        <div className="schemes-section au-fadeUp" style={{animationDelay:'0.26s'}}>
          <div className="schemes-header">
            <span className="schemes-title"><Shield size={20} color="#00ff87"/>{t('govt_schemes') || 'Government Schemes'}</span>
            <p className="schemes-sub">{t('schemes_sub') || 'Direct benefits for farmers'}</p>
          </div>
          <div className="schemes-grid">
            {SCHEMES.map((scheme, i) => (
              <div key={i} className="scheme-card">
                <div className="scheme-top">
                  <h4>{scheme.name}</h4>
                  <span className={`scheme-badge ${scheme.badge}`}>{scheme.bl}</span>
                </div>
                <p className="scheme-desc">{scheme.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}