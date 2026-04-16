import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AVATARS = [
  { id: 1,  emoji: '🦊', bg: 'linear-gradient(135deg,#f97316,#fbbf24)' },
  { id: 2,  emoji: '🐼', bg: 'linear-gradient(135deg,#6b7280,#d1d5db)' },
  { id: 3,  emoji: '🦁', bg: 'linear-gradient(135deg,#d97706,#fcd34d)' },
  { id: 4,  emoji: '🐯', bg: 'linear-gradient(135deg,#ea580c,#fb923c)' },
  { id: 5,  emoji: '🐸', bg: 'linear-gradient(135deg,#16a34a,#4ade80)' },
  { id: 6,  emoji: '🐧', bg: 'linear-gradient(135deg,#1d4ed8,#93c5fd)' },
  { id: 7,  emoji: '🦋', bg: 'linear-gradient(135deg,#7c3aed,#c4b5fd)' },
  { id: 8,  emoji: '🐉', bg: 'linear-gradient(135deg,#dc2626,#fca5a5)' },
  { id: 9,  emoji: '🦄', bg: 'linear-gradient(135deg,#db2777,#f9a8d4)' },
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

const DOMAINS = [
  { label: 'Healthcare', icon: '🏥', path: '/healthcare', color: '#10b981' },
  { label: 'Career', icon: '🚀', path: '/career', color: '#f59e0b' },
  { label: 'Resume', icon: '📄', path: '/resume', color: '#06b6d4' },
  { label: 'Finance', icon: '💰', path: '/finance', color: '#7c3aed' },
  { label: 'Public Services', icon: '🏛️', path: '/public-services', color: '#ec4899' },
  { label: 'Business', icon: '📊', path: '/business', color: '#f97316' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const avatarKey = `avatar_${user?.id || user?.email}`;
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem(avatarKey);
    return saved ? parseInt(saved) : null;
  });
  const [showPicker, setShowPicker] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentAvatar = AVATARS.find(a => a.id === selectedAvatar);
  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleSaveAvatar = (id) => {
    setSelectedAvatar(id);
    if (id) localStorage.setItem(avatarKey, id);
    else localStorage.removeItem(avatarKey);
    setShowPicker(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => { await logout(); navigate('/signin'); };

  return (
    <div style={{ minHeight: '100vh', background: '#050508', paddingTop: '80px', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24, padding: '2.5rem', marginBottom: '1.25rem',
            position: 'relative', overflow: 'hidden',
          }}>
          <div style={{
            position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <motion.div whileHover={{ scale: 1.05 }} onClick={() => setShowPicker(true)}
                style={{
                  width: 100, height: 100, borderRadius: '50%', cursor: 'pointer',
                  background: currentAvatar ? currentAvatar.bg : 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: currentAvatar ? 46 : 38, fontWeight: 800, color: '#fff',
                  border: '3px solid rgba(124,58,237,0.5)',
                  boxShadow: '0 0 32px rgba(124,58,237,0.25)',
                  userSelect: 'none', overflow: 'hidden',
                }}>
                {currentAvatar ? currentAvatar.emoji
                  : user?.photoURL
                    ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials}
              </motion.div>
              <div onClick={() => setShowPicker(true)} style={{
                position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 12, border: '2px solid #050508',
              }}>✏️</div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>
                {user?.name || 'User'}
              </h1>
              <p style={{ color: '#475569', fontSize: 14, margin: '0 0 12px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Badge color="#10b981">● Active</Badge>
                <Badge color="#a78bfa">{user?.provider === 'google' ? '🔵 Google' : '🔐 Email'}</Badge>
                <Badge color="#06b6d4">Joined {joinDate}</Badge>
              </div>
            </div>
          </div>

          {saved && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '1.25rem', padding: '10px 14px', borderRadius: 10,
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                color: '#10b981', fontSize: 13, textAlign: 'center',
              }}>✓ Avatar updated!</motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'AI Domains', value: '6', icon: '🧠', color: '#7c3aed' },
            { label: 'Analyses', value: '∞', icon: '⚡', color: '#06b6d4' },
            { label: 'Plan', value: 'Free', icon: '✨', color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '1.25rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: 24, fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Quick Access */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          style={{
            background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '1.5rem', marginBottom: '1.25rem',
          }}>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 1rem' }}>Quick Access</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {DOMAINS.map(d => (
              <motion.button key={d.path} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate(d.path)}
                style={{
                  background: `${d.color}12`, border: `1px solid ${d.color}30`,
                  borderRadius: 12, padding: '0.875rem 0.5rem', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                <span style={{ fontSize: 22 }}>{d.icon}</span>
                <span style={{ color: d.color, fontSize: 11, fontWeight: 600 }}>{d.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          style={{
            background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '1.5rem', marginBottom: '1.25rem',
          }}>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 1rem' }}>Account Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Full Name', value: user?.name || '—' },
              { label: 'Email', value: user?.email || '—' },
              { label: 'Sign-in Method', value: user?.provider === 'google' ? 'Google OAuth' : 'Email & Password' },
              { label: 'Account Type', value: 'Free Plan' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', background: '#13131f', borderRadius: 10,
              }}>
                <span style={{ color: '#475569', fontSize: 13 }}>{item.label}</span>
                <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          style={{
            width: '100%', padding: '14px', borderRadius: 14,
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
          Sign Out
        </motion.button>
      </div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPicker(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(10px)', zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            }}>
            <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24, padding: '2rem', maxWidth: 460, width: '100%',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Choose Your Avatar</h2>
                  <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>Pick your character</p>
                </div>
                <button onClick={() => setShowPicker(false)} style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8,
                  color: '#94a3b8', fontSize: 16, cursor: 'pointer',
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.65rem' }}>
                {AVATARS.map(av => (
                  <motion.button key={av.id} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.93 }}
                    onClick={() => handleSaveAvatar(av.id)}
                    style={{
                      aspectRatio: '1', borderRadius: 14, background: av.bg, cursor: 'pointer',
                      border: selectedAvatar === av.id ? '3px solid #7c3aed' : '3px solid transparent',
                      fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: selectedAvatar === av.id ? '0 0 18px rgba(124,58,237,0.6)' : 'none',
                      transition: 'box-shadow 0.2s',
                    }}>
                    {av.emoji}
                  </motion.button>
                ))}
              </div>

              <button onClick={() => handleSaveAvatar(null)} style={{
                width: '100%', marginTop: '1rem', padding: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, color: '#94a3b8', fontSize: 13, cursor: 'pointer',
              }}>
                Use my initials ({initials})
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Badge({ color, children }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
      background: `${color}18`, border: `1px solid ${color}30`, color,
    }}>{children}</span>
  );
}
