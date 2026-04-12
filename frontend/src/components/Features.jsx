import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: '🔍', title: 'Explainable AI', desc: 'Every recommendation includes transparent reasoning steps — you always know the why behind the decision.', color: '#7c3aed' },
  { icon: '👤', title: 'Human Review System', desc: 'Request expert validation from domain specialists who can adjust or confirm AI recommendations.', color: '#10b981' },
  { icon: '📈', title: 'Factor Analysis Charts', desc: 'Visual breakdown of every factor influencing the AI decision with weighted bar charts.', color: '#f59e0b' },
  { icon: '🎯', title: 'Confidence Scoring', desc: 'Animated confidence meter shows exactly how reliable each recommendation is before you act.', color: '#06b6d4' },
  { icon: '🔄', title: 'Alternative Options', desc: 'AI always provides alternative paths — never locked into a single recommendation.', color: '#ec4899' },
  { icon: '🌐', title: 'Real-World Data', desc: 'Decisions informed by live market data, clinical guidelines, and government databases.', color: '#f97316' },
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
          <p style={{ color: '#64748b', fontSize: 16 }}>Human + AI collaboration at every step of the decision process.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              style={{
                background: '#0d0d14',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '1.5rem',
                transition: 'border-color 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${f.color}33`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: '1rem',
                background: `${f.color}15`, border: `1px solid ${f.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: '0.5rem' }}>{f.title}</div>
              <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
