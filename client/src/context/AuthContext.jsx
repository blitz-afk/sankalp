import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase User
  const [mongoUser, setMongoUser] = useState(null); // MongoDB User Profile
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const res = await authService.getProfile();
      if (res && res.data) {
        setMongoUser(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch MongoDB user profile:', err.message);
      setMongoUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile();
      } else {
        setMongoUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.loginWithEmail(email, password);
      setMongoUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.registerWithEmail(userData);
      setMongoUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role) => {
    setLoading(true);
    try {
      const result = await authService.loginWithGoogle(role);
      setMongoUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setMongoUser(null);
  };

  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  const value = {
    currentUser,
    mongoUser,
    role: mongoUser?.role || 'CITIZEN',
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
