import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PageLayout({ icon, title, subtitle, color = '#7c3aed', children }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#050508', paddingTop: '64px' }}>
      {/* Header */}
      <div style={{
        background: '#080810',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '3rem 2rem',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: 13, marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            ← Back to Home
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `${color}18`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>{icon}</div>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{title}</h1>
              <p style={{ color: '#64748b', fontSize: 15, marginTop: 2 }}>{subtitle}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {children}
      </div>
    </div>
  );
}
