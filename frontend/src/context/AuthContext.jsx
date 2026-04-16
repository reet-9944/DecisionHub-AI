import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext(null);
const API = '/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore JWT session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.user) setUser(data.user);
          else localStorage.removeItem('token');
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      // Also listen for Firebase Google session
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser && !localStorage.getItem('token')) {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            provider: 'google',
          });
        }
        setLoading(false);
      });
      return unsub;
    }
  }, []);

  const signup = async (name, email, password) => {
    const res = await fetch(`${API}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed.');
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const signin = async (email, password) => {
    const res = await fetch(`${API}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sign in failed.');
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const signinWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    setUser({
      id: firebaseUser.uid,
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      provider: 'google',
    });
  };

  const logout = async () => {
    localStorage.removeItem('token');
    try { await signOut(auth); } catch {}
    setUser(null);
  };

  const resetPassword = async () => {
    throw new Error('Password reset: use the Forgot Password option on Sign In page.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, signinWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
