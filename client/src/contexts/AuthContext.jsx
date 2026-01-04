import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vbc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('vbc_token') || null);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('vbc_user', JSON.stringify(user));
      localStorage.setItem('vbc_token', token);
    } else {
      localStorage.removeItem('vbc_user');
      localStorage.removeItem('vbc_token');
    }
  }, [user, token]);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
