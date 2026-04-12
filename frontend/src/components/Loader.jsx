import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ text = 'Analyzing...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            style={{
              width: 10, height: 10, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            }}
          />
        ))}
      </div>
      <span style={{ color: '#64748b', fontSize: 14 }}>{text}</span>
    </div>
  );
}
