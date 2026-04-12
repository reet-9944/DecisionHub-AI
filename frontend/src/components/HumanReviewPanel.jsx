import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HumanReviewPanel({ aiResult, domain }) {
  const [status, setStatus] = useState('idle'); // idle | pending | reviewed
  const [review, setReview] = useState(null);

  const requestReview = async () => {
    setStatus('pending');
    // Simulate human expert review (1.5-3s)
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));

    const reviews = {
      healthcare: {
        expert: 'Dr. Sarah Chen, MD — Internal Medicine',
        decision: aiResult.recommendation,
        adjustment: 'AI assessment is sound. Additionally recommend blood panel and CBC test to rule out systemic infection. Telehealth consultation available within 4 hours.',
        agreement: 88,
        note: 'AI reasoning aligns with clinical guidelines. Minor additions for completeness.',
      },
      career: {
        expert: 'James Okafor — Senior Career Coach, 12 yrs exp.',
        decision: aiResult.recommendation,
        adjustment: 'Strong AI analysis. I would also suggest targeting hybrid roles that blend your current expertise with the new domain — reduces transition risk by ~40%.',
        agreement: 91,
        note: 'Existing experience is a bigger asset than the AI weighted. Leverage it.',
      },
      resume: {
        expert: 'Priya Nair — HR Director, Fortune 500',
        decision: aiResult.recommendation,
        adjustment: 'ATS score is accurate. Additionally, the summary section needs a stronger value proposition. Recruiters spend 6 seconds on first scan — lead with impact.',
        agreement: 85,
        note: 'Keyword optimization is correct. Human readability also matters beyond ATS.',
      },
      finance: {
        expert: 'Marcus Webb — CFP, Certified Financial Planner',
        decision: aiResult.recommendation,
        adjustment: 'AI allocation is solid for the risk profile. Consider adding a 5-10% allocation to inflation-protected securities given current macro conditions.',
        agreement: 87,
        note: 'Current market volatility warrants slightly more conservative positioning.',
      },
      public: {
        expert: 'Elena Rodriguez — Public Policy Advisor',
        decision: aiResult.recommendation,
        adjustment: 'Programs identified are correct. Also check for local non-profit supplemental programs — they often have faster processing and fewer eligibility restrictions.',
        agreement: 90,
        note: 'Federal programs are accurate. Local resources often overlooked by AI.',
      },
      business: {
        expert: 'David Kim — Startup Advisor, 3 exits',
        decision: aiResult.recommendation,
        adjustment: 'Strategy is directionally correct. At this stage, I would prioritize one ICP (Ideal Customer Profile) over broad market approach. Focus beats breadth every time.',
        agreement: 83,
        note: 'AI tends to recommend broad strategies. Niche focus drives faster traction.',
      },
    };

    setReview(reviews[domain] || reviews.career);
    setStatus('reviewed');
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Human Expert Review</div>
            <div style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>
              Request validation from a domain expert
            </div>
          </div>

          {status === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={requestReview}
              style={{
                padding: '10px 20px', borderRadius: 10,
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#a78bfa', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              👤 Request Human Review
            </motion.button>
          )}

          {status === 'pending' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: 13 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 14, height: 14, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
              Expert reviewing...
            </div>
          )}
        </div>

        <AnimatePresence>
          {status === 'reviewed' && review && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 14, padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>👤</div>
                <div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>Human Expert Validated</div>
                  <div style={{ color: '#475569', fontSize: 11 }}>{review.expert}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ color: '#10b981', fontWeight: 800, fontSize: 18 }}>{review.agreement}%</div>
                  <div style={{ color: '#475569', fontSize: 10 }}>AI Agreement</div>
                </div>
              </div>

              {/* Agreement bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${review.agreement}%` }}
                    transition={{ duration: 0.8 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: 2 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                  Expert Adjustment
                </div>
                <p style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.7, background: 'rgba(16,185,129,0.08)', padding: '10px 12px', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
                  {review.adjustment}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <span style={{ color: '#f59e0b', fontSize: 13 }}>💡</span>
                <span style={{ color: '#64748b', fontSize: 12, fontStyle: 'italic' }}>{review.note}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
