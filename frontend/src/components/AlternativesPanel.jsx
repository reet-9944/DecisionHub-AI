import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlternativesPanel({ alternatives = [] }) {
  const [open, setOpen] = useState(false);
  if (!alternatives?.length) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
          color: '#94a3b8', fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
      >
        <span>🔀</span>
        <span>Alternative Options ({alternatives.length})</span>
        <span style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {alternatives.map((alt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    background: 'rgba(6,182,212,0.05)',
                    border: '1px solid rgba(6,182,212,0.12)',
                    borderRadius: 10, padding: '10px 14px',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                  }}
                >
                  <span style={{ color: '#06b6d4', fontSize: 14, marginTop: 1 }}>◈</span>
                  <span style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{alt}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
