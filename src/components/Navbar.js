import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [loc]);

  const links = [
    { to: '/',         label: 'Home' },
    { to: '/detect',   label: 'Detector' },
    { to: '/advisory', label: 'Advisory' },
    { to: '/analyses', label: 'Analyses' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__logo">
          <div className="nav__logo-icon">🌿</div>
          <span className="nav__logo-text">CropSense<em>AI</em></span>
        </Link>

        <div className="nav__links">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav__link ${loc.pathname === l.to ? 'nav__link--on' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link to="/detect" className="nav__cta">Scan Crop →</Link>

        <button className="nav__hamburger" onClick={() => setOpen(p => !p)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="nav__drawer">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav__drawer-link ${loc.pathname === l.to ? 'nav__drawer-link--on' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}