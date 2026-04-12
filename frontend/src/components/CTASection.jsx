import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section style={{ padding: '5rem 2rem', background: '#080810' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{
            display: 'inline-block', marginBottom: '1rem',
            padding: '5px 14px', borderRadius: 100,
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
            color: '#a78bfa', fontSize: 12, fontWeight: 600,
          }}>
            Get Started Free
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', marginBottom: '1rem' }}>
            Ready to decide better?
          </h2>
          <p style={{ color: '#64748b', fontSize: 17, marginBottom: '2rem', lineHeight: 1.7 }}>
            Join thousands of people using DecisionHub AI to navigate life's most important choices.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/healthcare')}
              style={{
                padding: '14px 32px', borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                border: 'none', color: '#fff', fontWeight: 700, fontSize: 16,
                cursor: 'pointer', boxShadow: '0 4px 30px rgba(124,58,237,0.35)',
              }}
            >
              Start for Free
            </button>
            <button
              onClick={() => document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 32px', borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#d1d5db', fontWeight: 600, fontSize: 16, cursor: 'pointer',
              }}
            >
              View Domains
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
