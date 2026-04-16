import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Stub auth context — wire up Firebase when keys are added to frontend/.env
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signup = async () => {};
  const signin = async () => {};
  const signinWithGoogle = async () => {};
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading: false, signup, signin, signinWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
