import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'Healthcare', path: '/healthcare' },
  { label: 'Career', path: '/career' },
  { label: 'Resume', path: '/resume' },
  { label: 'Finance', path: '/finance' },
  { label: 'Public Services', path: '/public-services' },
  { label: 'Business', path: '/business' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 2rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(5,5,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: '#fff'
        }}>D</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.3px' }}>
          DecisionHub AI
        </span>
      </div>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
        {links.map(l => (
          <button
            key={l.path}
            onClick={() => navigate(l.path)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: location.pathname === l.path ? '#7c3aed' : '#94a3b8',
              fontSize: 14, fontWeight: 500,
              transition: 'color 0.2s',
              padding: '4px 0',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = location.pathname === l.path ? '#7c3aed' : '#94a3b8'}
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => navigate('/healthcare')}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            border: 'none', borderRadius: 8, padding: '8px 18px',
            color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}
        >
          Try Now
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'none', background: 'none', border: 'none',
          cursor: 'pointer', color: '#fff', fontSize: 22,
        }}
        className="mobile-menu-btn"
      >
        {open ? '✕' : '☰'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute', top: '64px', left: 0, right: 0,
              background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
            }}
          >
            {links.map(l => (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#d1d5db', fontSize: 15, fontWeight: 500, textAlign: 'left',
                }}
              >
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
}
