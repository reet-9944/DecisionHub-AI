import React from 'react';
import { motion } from 'framer-motion';

export default function FactorsChart({ factors = [] }) {
  if (!factors || factors.length === 0) return null;

  const maxVal = Math.max(...factors.map(f => f.value));

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        color: '#64748b', fontSize: 12, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem',
      }}>
        Factors Influencing Decision
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {factors.map((f, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#cbd5e1', fontSize: 13 }}>• {f.label}</span>
              <span style={{ color: f.color || '#7c3aed', fontSize: 13, fontWeight: 600 }}>{f.value}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(f.value / maxVal) * 100}%` }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 3,
                  background: f.color
                    ? `linear-gradient(90deg, ${f.color}, ${f.color}88)`
                    : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
