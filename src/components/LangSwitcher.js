import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLang } from '../context/LangContext';
import './LangSwitcher.css';

export default function LangSwitcher() {
  const { lang, setLang, LANGUAGES } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => {
      document.removeEventListener('mousedown', fn);
    };
  }, []);

  return (
    <div className={`lang-sw ${open ? 'lang-sw--open' : ''}`} ref={ref}>
      <button className="lang-sw__btn" onClick={() => setOpen(p => !p)}>
        <Globe size={14}/>
        <span className="lang-sw__native">{current.native}</span>
        <ChevronDown size={14} className="lang-sw__caret"/>
      </button>
      {open && (
        <div className="lang-sw__dropdown">
          <div className="lang-sw__list">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                className={`lang-sw__item ${lang === l.code ? 'lang-sw__item--on' : ''}`}
                onClick={() => { setLang(l.code); setOpen(false); }}
              >
                <span className="lang-sw__item-flag">{l.flag}</span>
                <div className="lang-sw__item-labels">
                  <span className="lang-sw__item-label">{l.label}</span>
                  <span className="lang-sw__item-native">{l.native}</span>
                </div>
                {lang === l.code && <Check size={14} className="lang-sw__check"/>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}