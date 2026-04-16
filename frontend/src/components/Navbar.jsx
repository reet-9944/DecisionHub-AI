import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setUserMenu(false); }, [location]);

  const handleLogout = async () => { await logout(); navigate('/signin'); };
  const avatarKey = `avatar_${user?.id || user?.email}`;
  const savedAvatarId = user ? parseInt(localStorage.getItem(avatarKey)) || null : null;
  const AVATARS = [
    { id: 1, emoji: '🦊', bg: 'linear-gradient(135deg,#f97316,#fbbf24)' },
    { id: 2, emoji: '🐼', bg: 'linear-gradient(135deg,#6b7280,#d1d5db)' },
    { id: 3, emoji: '🦁', bg: 'linear-gradient(135deg,#d97706,#fcd34d)' },
    { id: 4, emoji: '🐯', bg: 'linear-gradient(135deg,#ea580c,#fb923c)' },
    { id: 5, emoji: '🐸', bg: 'linear-gradient(135deg,#16a34a,#4ade80)' },
    { id: 6, emoji: '🐧', bg: 'linear-gradient(135deg,#1d4ed8,#93c5fd)' },
    { id: 7, emoji: '🦋', bg: 'linear-gradient(135deg,#7c3aed,#c4b5fd)' },
    { id: 8, emoji: '🐉', bg: 'linear-gradient(135deg,#dc2626,#fca5a5)' },
    { id: 9, emoji: '🦄', bg: 'linear-gradient(135deg,#db2777,#f9a8d4)' },
    { id: 10, emoji: '🐺', bg: 'linear-gradient(135deg,#4b5563,#9ca3af)' },
    { id: 11, emoji: '🦅', bg: 'linear-gradient(135deg,#0369a1,#38bdf8)' },
    { id: 12, emoji: '🐬', bg: 'linear-gradient(135deg,#0891b2,#67e8f9)' },
    { id: 13, emoji: '🐻', bg: 'linear-gradient(135deg,#92400e,#d97706)' },
    { id: 14, emoji: '🦝', bg: 'linear-gradient(135deg,#374151,#6b7280)' },
    { id: 15, emoji: '🐙', bg: 'linear-gradient(135deg,#be185d,#f472b6)' },
    { id: 16, emoji: '🦖', bg: 'linear-gradient(135deg,#065f46,#34d399)' },
    { id: 17, emoji: '🤖', bg: 'linear-gradient(135deg,#1e40af,#7c3aed)' },
    { id: 18, emoji: '👾', bg: 'linear-gradient(135deg,#5b21b6,#8b5cf6)' },
    { id: 19, emoji: '🧙', bg: 'linear-gradient(135deg,#1e3a5f,#06b6d4)' },
    { id: 20, emoji: '🦸', bg: 'linear-gradient(135deg,#7c3aed,#06b6d4)' },
  ];
  const currentAvatar = AVATARS.find(a => a.id === savedAvatarId);
  const avatar = user?.photoURL;
  const initials = user?.displayName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(5,5,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: '#fff',
        }}>D</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.3px' }}>DecisionHub AI</span>
      </div>

      {/* Desktop */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
        {links.map(l => (
          <button key={l.path} onClick={() => navigate(l.path)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: location.pathname === l.path ? '#7c3aed' : '#94a3b8',
              fontSize: 14, fontWeight: 500, transition: 'color 0.2s', padding: '4px 0',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = location.pathname === l.path ? '#7c3aed' : '#94a3b8'}
          >{l.label}</button>
        ))}

        {user ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setUserMenu(!userMenu)} style={{
              width: 36, height: 36, borderRadius: '50%', border: '2px solid #7c3aed',
              background: currentAvatar ? currentAvatar.bg : avatar ? 'transparent' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              cursor: 'pointer', overflow: 'hidden', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: currentAvatar ? 18 : 14,
            }}>
              {currentAvatar ? currentAvatar.emoji
                : avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </button>
            <AnimatePresence>
              {userMenu && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{
                    position: 'absolute', top: '44px', right: 0, minWidth: 200,
                    background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, padding: '0.5rem', boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                  }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.25rem' }}>
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.displayName || user.name || 'User'}</p>
                    <p style={{ color: '#475569', fontSize: 11 }}>{user.email}</p>
                  </div>
                  <button onClick={() => { setUserMenu(false); navigate('/profile'); }} style={{
                    width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                    color: '#e2e8f0', fontSize: 13, cursor: 'pointer', textAlign: 'left', borderRadius: 8,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >👤 View Profile</button>
                  <button onClick={handleLogout} style={{
                    width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                    color: '#f87171', fontSize: 13, cursor: 'pointer', textAlign: 'left', borderRadius: 8,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >Sign Out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/signin')} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
              padding: '7px 16px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>Sign In</button>
            <button onClick={() => navigate('/signup')} style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none',
              borderRadius: 8, padding: '8px 18px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>Sign Up</button>
          </div>
        )}
      </div>

      {/* Mobile */}
      <button onClick={() => setOpen(!open)} className="mobile-menu-btn"
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 22 }}>
        {open ? '✕' : '☰'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute', top: '64px', left: 0, right: 0,
              background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
            {links.map(l => (
              <button key={l.path} onClick={() => navigate(l.path)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: 15, fontWeight: 500, textAlign: 'left' }}>
                {l.label}
              </button>
            ))}
            {user
              ? <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 15, fontWeight: 500, textAlign: 'left' }}>Sign Out</button>
              : <button onClick={() => navigate('/signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontSize: 15, fontWeight: 600, textAlign: 'left' }}>Sign In / Sign Up</button>
            }
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
