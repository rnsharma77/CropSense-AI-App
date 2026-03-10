import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LangSwitcher from './LangSwitcher';
import { useLang } from '../context/LangContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const loc = useLocation();
  const { t } = useLang();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { to: '/',         key: 'nav_home'     },
    { to: '/detect',   key: 'nav_detector' },
    { to: '/advisory', key: 'nav_advisory' },
    { to: '/analyses', key: 'nav_analyses' },
    { to: '/chat',     key: 'nav_chatbot'  },
  ];

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__logo" style={{textDecoration:'none'}}>
          <div className="nav__logo-icon">🌿</div>
          <span className="nav__logo-text">CropSense <em>AI</em></span>
        </Link>

        <div className="nav__links">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav__link ${loc.pathname === l.to ? 'nav__link--on' : ''}`}>{t(l.key)}</Link>
          ))}
        </div>

        <div className="nav__right">
          <LangSwitcher />
          <Link to="/detect" className="nav__cta">{t('nav_detector')}</Link>
        </div>

        <button className="nav__hamburger" onClick={() => setOpen(p => !p)}>
          {open ? <X size={20}/> : <Menu size={20}/>} 
        </button>
      </div>

      {open && (
        <div className="nav__drawer">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              onClick={() => setOpen(false)}
              className={`nav__drawer-link ${loc.pathname === l.to ? 'nav__drawer-link--on' : ''}`}>{t(l.key)}</Link>
          ))}
          <div style={{padding:'8px 14px'}}>
            <LangSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
