import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, onAuthStateChange, signOut as apiSignOut } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    getCurrentUser()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    // Listen for changes
    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      if (session?.user) {
        getCurrentUser().then(setUser).catch(() => setUser(null));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await apiSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
