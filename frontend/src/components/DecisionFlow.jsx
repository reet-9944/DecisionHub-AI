import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { icon: '📝', label: 'User Input', desc: 'Describe your situation' },
  { icon: '🧠', label: 'AI Analysis', desc: 'Deep pattern recognition' },
  { icon: '💡', label: 'Recommendation', desc: 'Actionable insights' },
  { icon: '👤', label: 'Human Review', desc: 'You stay in control' },
  { icon: '🔄', label: 'Feedback Loop', desc: 'Continuous improvement' },
];

export default function DecisionFlow() {
  return (
    <section style={{ padding: '5rem 2rem', background: '#080810' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
            How It Works
          </h2>
          <p style={{ color: '#64748b', fontSize: 16 }}>From your input to a confident decision in seconds.</p>
        </motion.div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, flexWrap: 'wrap',
        }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{ textAlign: 'center', padding: '1rem', minWidth: 130 }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 0.75rem',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
                  border: '1px solid rgba(124,58,237,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                }}>
                  {step.icon}
                </div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{step.label}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{step.desc}</div>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.1 }}
                  style={{
                    height: 2, width: 40, flexShrink: 0,
                    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                    borderRadius: 2,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
