import React from 'react';
import { motion } from 'framer-motion';
import ConfidenceBar from './ConfidenceBar';

export default function ResultPanel({ result }) {
  if (!result) return null;
  const { recommendation, reasoning, confidence, actions } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#0d0d14',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: 20, padding: '2rem',
        boxShadow: '0 20px 60px rgba(124,58,237,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>✦</div>
        <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>AI Analysis Result</span>
      </div>

      <ConfidenceBar value={confidence} />

      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem' }}>
          Recommendation
        </div>
        <p style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, background: 'rgba(124,58,237,0.08)', padding: '1rem', borderRadius: 10, borderLeft: '3px solid #7c3aed' }}>
          {recommendation}
        </p>
      </div>

      {reasoning?.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.75rem' }}>
            Reasoning Steps
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {reasoning.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(124,58,237,0.2)', color: '#a78bfa',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</span>
                <span style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {actions?.length > 0 && (
        <div>
          <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.75rem' }}>
            Suggested Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {actions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: '#10b981', fontSize: 14 }}>✓</span>
                <span style={{ color: '#cbd5e1', fontSize: 14 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
