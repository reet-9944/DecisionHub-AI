import React from 'react';
import { motion } from 'framer-motion';

export default function ReasoningTimeline({ steps = [] }) {
  if (!steps.length) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        color: '#64748b', fontSize: 12, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem',
      }}>
        AI Reasoning Timeline
      </div>

      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {/* Vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: 9, top: 8, bottom: 8,
            width: 2,
            background: 'linear-gradient(180deg, #7c3aed, #06b6d4)',
            borderRadius: 2,
            transformOrigin: 'top',
          }}
        />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            style={{ position: 'relative', marginBottom: i < steps.length - 1 ? '1.25rem' : 0 }}
          >
            {/* Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 + i * 0.15 }}
              style={{
                position: 'absolute', left: -24, top: 3,
                width: 14, height: 14, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                border: '2px solid #050508',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />
            </motion.div>

            <div style={{
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.12)',
              borderRadius: 10, padding: '10px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{
                  background: 'rgba(124,58,237,0.2)', color: '#a78bfa',
                  fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 100,
                }}>Step {i + 1}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{step}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
