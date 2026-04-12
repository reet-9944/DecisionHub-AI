import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ConfidenceBar({ value = 85 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
  const label = value >= 80 ? 'High Confidence' : value >= 60 ? 'Moderate Confidence' : 'Low Confidence';

  // Build segments (20 total)
  const total = 20;
  const filled = Math.round((value / 100) * total);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>AI Confidence Score</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '2px 10px', borderRadius: 100,
            background: `${color}18`, color, fontSize: 11, fontWeight: 700,
          }}>{label}</span>
          <span style={{ color, fontWeight: 800, fontSize: 22 }}>{display}%</span>
        </div>
      </div>

      {/* Segmented bar */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: i < filled ? 1 : 0.3 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            style={{
              flex: 1, height: 20, borderRadius: 3,
              background: i < filled
                ? `linear-gradient(180deg, ${color}, ${color}99)`
                : 'rgba(255,255,255,0.05)',
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>

      {/* Smooth bar underneath */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 2 }}
        />
      </div>
    </div>
  );
}
