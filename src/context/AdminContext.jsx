import { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('adminPassword') || '';
  });

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin);
    localStorage.setItem('adminPassword', adminPassword);
  }, [isAdmin, adminPassword]);

  const login = (password) => {
    if (password === '123') {
      setIsAdmin(true);
      setAdminPassword(password);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminPassword('');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminPassword');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminPassword, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
