import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const { signin, signinWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signin(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signinWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#050508',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: 440,
          background: '#0d0d14',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24, padding: '2.5rem',
          boxShadow: '0 24px 80px rgba(124,58,237,0.1)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: '#fff',
            margin: '0 auto 1rem',
          }}>D</div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {showReset ? 'Reset Password' : 'Welcome back'}
          </h1>
          <p style={{ color: '#475569', fontSize: 14 }}>
            {showReset ? 'Enter your email to receive a reset link' : 'Sign in to DecisionHub AI'}
          </p>
        </div>

        {!showReset ? (
          <>
            {/* Google Button */}
            <button onClick={handleGoogle} disabled={googleLoading}
              style={{
                width: '100%', padding: '12px', borderRadius: 12,
                background: '#13131f', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                marginBottom: '1.5rem', transition: 'border-color 0.2s',
                opacity: googleLoading ? 0.7 : 1,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              {googleLoading ? <Spinner /> : (
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ color: '#475569', fontSize: 12 }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Email" type="email" value={form.email}
                onChange={v => setForm(p => ({ ...p, email: v }))}
                placeholder="you@example.com" />
              <Field label="Password" type="password" value={form.password}
                onChange={v => setForm(p => ({ ...p, password: v }))}
                placeholder="••••••••" />

              {error && <ErrorBox msg={error} />}

              <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                {loading ? <><Spinner /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <button onClick={() => setShowReset(true)}
              style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: 13, cursor: 'pointer', marginTop: '0.75rem', width: '100%' }}>
              Forgot password?
            </button>

            <p style={{ textAlign: 'center', color: '#475569', fontSize: 13, marginTop: '1.5rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#7c3aed', fontWeight: 600 }}>Sign Up</Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resetSent ? (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '1rem', color: '#10b981', fontSize: 14, textAlign: 'center' }}>
                Reset link sent! Check your email.
              </div>
            ) : (
              <>
                <Field label="Email" type="email" value={resetEmail}
                  onChange={setResetEmail} placeholder="you@example.com" />
                {error && <ErrorBox msg={error} />}
                <button type="submit" style={primaryBtn(false)}>Send Reset Link</button>
              </>
            )}
            <button type="button" onClick={() => { setShowReset(false); setResetSent(false); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer' }}>
              ← Back to Sign In
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 10,
          background: '#13131f', border: `1px solid ${focused ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
          color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  );
}

const ErrorBox = ({ msg }) => (
  <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13 }}>
    {msg}
  </div>
);

const Spinner = () => (
  <span style={{
    display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff',
    animation: 'spin 0.7s linear infinite',
  }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </span>
);

const primaryBtn = (loading) => ({
  width: '100%', padding: '13px', borderRadius: 12,
  background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
  border: 'none', color: '#fff', fontWeight: 700, fontSize: 15,
  cursor: loading ? 'not-allowed' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  boxShadow: loading ? 'none' : '0 4px 24px rgba(124,58,237,0.3)',
  transition: 'opacity 0.2s',
});

function getFriendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
