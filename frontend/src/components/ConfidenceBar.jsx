import React from 'react';
import { motion } from 'framer-motion';

export default function ConfidenceBar({ value = 85 }) {
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>Confidence Score</span>
        <span style={{ color, fontWeight: 700, fontSize: 14 }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}
