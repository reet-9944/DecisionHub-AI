import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: '🔍', title: 'Explainable AI', desc: 'Every recommendation comes with transparent reasoning steps so you understand the why.' },
  { icon: '⚡', title: 'Real-time Analysis', desc: 'Get AI-powered insights in under 2 seconds across all 6 decision domains.' },
  { icon: '🎯', title: 'Confidence Scoring', desc: 'Each result includes a confidence meter so you know how reliable the recommendation is.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Your data is processed securely and never stored without your explicit consent.' },
  { icon: '🧩', title: 'Multi-Domain', desc: 'One platform covering healthcare, career, finance, resume, civic, and business decisions.' },
  { icon: '🔄', title: 'Feedback Loop', desc: 'The AI improves with your feedback, getting smarter with every interaction.' },
];

export default function Features() {
  return (
    <section style={{ padding: '5rem 2rem', background: '#050508' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
            Built for Confidence
          </h2>
          <p style={{ color: '#64748b', fontSize: 16 }}>Everything you need to make better decisions, faster.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: '#0d0d14',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '1.5rem',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: '0.5rem' }}>{f.title}</div>
              <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
