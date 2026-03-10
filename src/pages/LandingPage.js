import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Microscope,
  Sprout,
  BookOpen,
  Globe,
  Leaf,
  Clock,
  TrendingUp,
  ChevronRight,
  Shield,
  MessageSquare,
  Camera,
  Bot,
  ClipboardList,
  BadgeCheck,
} from 'lucide-react';
import { useLang } from '../context/LangContext';
import './LandingPage.css';

const TICKER = [
  'Late Blight',
  'Powdery Mildew',
  'Leaf Rust',
  'Root Rot',
  'Bacterial Wilt',
  'Mosaic Virus',
  'Anthracnose',
  'Fusarium Wilt',
  'Downy Mildew',
  'Grey Mold',
];

const STATS = [
  { val: '40%', lblKey: 'stats_crop_loss' },
  { val: '2.8s', lblKey: 'stats_avg_scan' },
  { val: '50+', lblKey: 'stats_diseases' },
  { val: '12', lblKey: 'stats_languages' },
];

const FEATS = [
  { icon: <Sprout size={22} />, titleKey: 'feat_treatment_title', bodyKey: 'feat_treatment_body', c: '#00ff87' },
  { icon: <BookOpen size={22} />, titleKey: 'feat_calendar_title', bodyKey: 'feat_calendar_body', c: '#ffb23f' },
  { icon: <MessageSquare size={22} />, titleKey: 'feat_chat_title', bodyKey: 'feat_chat_body', c: '#a78bfa' },
  { icon: <Shield size={22} />, titleKey: 'feat_schemes_title', bodyKey: 'feat_schemes_body', c: '#ff3d3d' },
];

const HIW_STEPS = [
  { num: '01', titleKey: 'step_photo_title', bodyKey: 'step_photo_body', icon: <Camera size={30} strokeWidth={2.1} /> },
  { num: '02', titleKey: 'step_ai_title', bodyKey: 'step_ai_body', icon: <Bot size={30} strokeWidth={2.1} /> },
  { num: '03', titleKey: 'step_results_title', bodyKey: 'step_results_body', icon: <ClipboardList size={30} strokeWidth={2.1} /> },
  { num: '04', titleKey: 'step_action_title', bodyKey: 'step_action_body', icon: <BadgeCheck size={30} strokeWidth={2.1} /> },
];

const CROPS = [
  { label: 'Sugarcane', color: '#ffb23f' },
  { label: 'Tomato', color: '#ff5757' },
  { label: 'Cotton', color: '#f3f4f6' },
  { label: 'Soybean', color: '#b8ff3c' },
  { label: 'Maize', color: '#ffe03a' },
  { label: 'Potato', color: '#ffb23f' },
  { label: 'Chili', color: '#ff5757' },
  { label: 'Onion', color: '#b06cff' },
  { label: 'Mango', color: '#ffc24b' },
  { label: 'Banana', color: '#f3ea4e' },
  { label: 'Wheat', color: '#f8ef61' },
  { label: 'Rice Paddy', color: '#00ff87' },
];

export default function LandingPage() {
  const { t } = useLang();
  const dbl = [...TICKER, ...TICKER];
  const cropRowA = [...CROPS, ...CROPS];
  const cropRowB = [...CROPS.slice(5), ...CROPS.slice(0, 5), ...CROPS.slice(5), ...CROPS.slice(0, 5)];

  return (
    <div className="land">
      <section className="hero">
        <div className="hero-ring hero-ring-1" />
        <div className="hero-ring hero-ring-2" />
        <div className="hero-ring hero-ring-3" />

        <div className="hero-pill au-fadeUp d0">
          <span className="live-dot" />
          {t('hero_pill') || 'Always Free • No Ads'}
        </div>

        <h1 className="hero-h1 au-fadeUp d1">
          <span className="line-1">{t('hero_line1') || 'AI-Powered'}</span>
          <span className="line-2">{t('hero_line2') || 'Crop Disease'}</span>
          <span className="line-3">{t('hero_line3') || 'Detection'}</span>
        </h1>

        <p className="hero-sub au-fadeUp d2">
          {t('hero_sub') || 'Scan crop leaves in seconds to identify diseases and get instant treatment recommendations'}
        </p>

        <div className="hero-btns au-fadeUp d3">
          <Link to="/detect" className="btn-primary">
            <Zap size={18} />
            {t('hero_btn1') || 'Start Scanning'}
          </Link>
          <Link to="/advisory" className="btn-ghost">
            <Leaf size={16} />
            {t('hero_btn2') || 'Get Advisory'}
          </Link>
        </div>

        <div className="hero-mockup au-fadeUp d4">
          <div className="hero-datacards">
            <div className="hero-datacard au-float" style={{ animationDelay: '0.2s' }}>
              <div className="hero-datacard__eyebrow">
                <TrendingUp size={11} style={{ display: 'inline' }} /> {t('label_accuracy') || 'Accuracy'}
              </div>
              <div className="hero-datacard__val">94%</div>
              <div className="hero-datacard__sub">{t('detection_rate') || 'Detection Rate'}</div>
            </div>
            <div className="hero-datacard au-float" style={{ animationDelay: '1.1s' }}>
              <div className="hero-datacard__eyebrow">
                <Clock size={11} style={{ display: 'inline' }} /> {t('label_speed') || 'Speed'}
              </div>
              <div className="hero-datacard__val">2.8s</div>
              <div className="hero-datacard__sub">{t('per_diagnosis') || 'Per Diagnosis'}</div>
            </div>
          </div>

          <div className="hero-phone">
            <div className="hero-phone__bar">
              <div className="hero-phone__dot" style={{ background: '#ff5757' }} />
              <div className="hero-phone__dot" style={{ background: '#ffe03a' }} />
              <div className="hero-phone__dot" style={{ background: '#00ff87' }} />
            </div>
            <div className="hero-scan">
              <div className="hero-scan__br-tl" />
              <div className="hero-scan__br-br" />
              <div className="hero-scan__beam" />
              <div className="hero-scan__emoji">🍃</div>
            </div>
            <div className="hero-result">
              <div className="hero-result__label">{t('hero_result_label') || 'Result'}</div>
              <div className="hero-result__name">{t('hero_result_name') || 'Late Blight'}</div>
              <div className="hero-result__bar">
                <span>{t('label_severity_short') || 'Svr'}</span>
                <div className="hero-result__track"><div className="hero-result__fill" /></div>
                <span style={{ color: '#ffb23f', fontWeight: 700 }}>67%</span>
              </div>
            </div>

            <div className="hero-datacards">
              <div className="hero-datacard au-float" style={{ animationDelay: '0.7s' }}>
                <div className="hero-datacard__eyebrow">
                  <Microscope size={11} style={{ display: 'inline' }} /> {t('label_database') || 'Database'}
                </div>
                <div className="hero-datacard__val">50+</div>
                <div className="hero-datacard__sub">{t('diseases_listed') || 'Diseases Listed'}</div>
              </div>
              <div className="hero-datacard au-float" style={{ animationDelay: '1.5s' }}>
                <div className="hero-datacard__eyebrow">
                  <Globe size={11} style={{ display: 'inline' }} /> {t('label_languages') || 'Languages'}
                </div>
                <div className="hero-datacard__val">12</div>
                <div className="hero-datacard__sub">{t('regional_langs') || 'Regional Langs'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bubble hero-bubble-a au-fadeUp d5">{t('bubble_treatment_ready') || 'Treatment Ready'}</div>
        <div className="hero-bubble hero-bubble-b au-fadeUp d5">{t('bubble_diseases') || '50+ Diseases'}</div>
        <div className="hero-bubble hero-bubble-c au-fadeUp d5">{t('bubble_free') || 'Free Forever'}</div>
      </section>

      <div className="ticker">
        <div className="ticker__belt">
          {dbl.map((d, i) => (
            <div key={i} className="ticker__item">
              <em>●</em>
              {d}
            </div>
          ))}
        </div>
      </div>

      <section className="stats">
        <div className="wrap">
          <div className="stats__grid">
            {STATS.map((s, i) => (
              <div key={i} className="stats__cell">
                <span className="stats__val">{s.val}</span>
                <span className="stats__label">{t(s.lblKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feats">
        <div className="wrap">
          <div className="feats__head">
            <div>
              <div className="eyebrow">{t('platform_eyebrow') || 'PLATFORM'}</div>
              <h2 className="feats__title">
                {t('feats_title_part1') || 'Packed with'} <span className="fill">{t('feats_title_fill') || 'Powerful Features'}</span>
                <br />
                <span className="stroke">{t('feats_title_part2') || 'for Smart Farming'}</span>
              </h2>
            </div>
            <p className="feats__body">{t('feats_body') || 'Everything you need to protect your crops and maximize yields'}</p>
          </div>

          <div className="feat-hero">
            <div className="feat-hero__content">
              <div className="feat-hero__icon"><Microscope size={24} /></div>
              <h3 className="feat-hero__title">{t('feat_hero_title') || 'AI Disease Detection'}</h3>
              <p className="feat-hero__body">{t('feat_hero_body') || 'Advanced ML models trained on thousands of crop images'}</p>
              <Link to="/detect" className="btn-primary" style={{ fontSize: 14, padding: '11px 22px' }}>
                {t('feat_hero_cta') || 'Try Scanner'} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="feat-hero__visual">
              <div className="feat-hero__visual-emoji">🌿</div>
            </div>
          </div>

          <div className="feat-grid">
            {FEATS.map((f, i) => (
              <div key={i} className="feat-card" style={{ '--fc': f.c }}>
                <div className="feat-card__icon" style={{ color: f.c, background: `${f.c}16` }}>{f.icon}</div>
                <h3 className="feat-card__title">{t(f.titleKey)}</h3>
                <p className="feat-card__body">{t(f.bodyKey)}</p>
                <div className="feat-card__arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hiw">
        <div className="hiw__gridline" />
        <div className="wrap hiw__wrap">
          <div className="hiw__header">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('process_eyebrow') || 'PROCESS'}</div>
            <h2 className="hiw__title">
              4 Steps to <span className="fill">{t('hiw_title_fill') || 'Save'}</span> Your Crop
            </h2>
          </div>

          <div className="hiw__grid">
            {HIW_STEPS.map((step, i) => (
              <div key={i} className="hiw__card">
                <div className="hiw__step">{step.num}</div>
                <div className="hiw__emoji">{step.icon}</div>
                <h3 className="hiw__card-title">{t(step.titleKey)}</h3>
                <p className="hiw__card-body">{t(step.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="crop-roll">
          <div className="crop-row">
            {cropRowA.map((crop, i) => (
              <div key={`crop-a-${i}`} className="crop-pill">
                <span className="crop-pill__dot" style={{ background: crop.color }} />
                {crop.label}
              </div>
            ))}
          </div>
          <div className="crop-row crop-row--rev">
            {cropRowB.map((crop, i) => (
              <div key={`crop-b-${i}`} className="crop-pill">
                <span className="crop-pill__dot" style={{ background: crop.color }} />
                {crop.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-s">
        <div className="wrap">
          <div className="cta-box">
            <h2 className="cta-box__title">Ready to Protect Your Crops?</h2>
            <p className="cta-box__body">
              Join thousands of farmers using AI-powered disease detection to maximize yields and minimize losses.
            </p>
            <div className="cta-box__btns">
              <Link to="/detect" className="btn-primary">
                Start Scanning <ChevronRight size={16} />
              </Link>
              <Link to="/advisory" className="btn-ghost">
                Get Advice
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__inner">
            <div className="footer__copy">
              © 2024 CropSense AI. {t('footer_rights') || 'All rights reserved.'}
            </div>
            <div className="footer__links">
              <a href="/privacy" className="footer__link">{t('footer_privacy') || 'Privacy'}</a>
              <a href="/api" className="footer__link">{t('footer_api') || 'API'}</a>
              <a href="/contact" className="footer__link">{t('footer_contact') || 'Contact'}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
