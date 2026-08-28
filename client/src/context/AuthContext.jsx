import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profiles/me');
      setProfile(data.profile || data);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser);
    if (nextUser) await fetchProfile(); else setProfile(null);
    setLoading(false);
  }), []);

  const signUp = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  };
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signOut = async () => { await firebaseSignOut(auth); setUser(null); setProfile(null); };
  const refreshProfile = () => { if (user) fetchProfile(); };

  return <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
