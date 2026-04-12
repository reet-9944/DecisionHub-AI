import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{
      background: '#050508',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 2rem 2rem',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff',
              }}>D</div>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>DecisionHub AI</span>
            </div>
            <p style={{ color: '#475569', fontSize: 13, maxWidth: 240, lineHeight: 1.6 }}>
              AI-powered decision intelligence for every domain of life.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: '0.75rem' }}>Domains</div>
              {[['Healthcare', '/healthcare'], ['Career', '/career'], ['Resume', '/resume'], ['Finance', '/finance']].map(([l, p]) => (
                <div key={l} onClick={() => navigate(p)} style={{ color: '#475569', fontSize: 13, marginBottom: '0.4rem', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#94a3b8'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >{l}</div>
              ))}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: '0.75rem' }}>More</div>
              {[['Public Services', '/public-services'], ['Business', '/business']].map(([l, p]) => (
                <div key={l} onClick={() => navigate(p)} style={{ color: '#475569', fontSize: 13, marginBottom: '0.4rem', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#94a3b8'}
                  onMouseLeave={e => e.target.style.color = '#475569'}
                >{l}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#334155', fontSize: 13 }}>© 2026 DecisionHub AI. All rights reserved.</span>
          <span style={{ color: '#334155', fontSize: 13 }}>Built with AI ✦</span>
        </div>
      </div>
    </footer>
  );
}
