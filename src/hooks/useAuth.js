import { useState } from 'react';
import { authAPI } from '../api/mockData';

export const useAuth = () => {
  const [auth, setAuth] = useState({ role: null, user: null });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, role) => {
    if (!email) {
      alert('Enter your email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, role);
      if (response.success) {
        setAuth({ role, user: response.user });
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuth({ role: null, user: null });
  };

  return {
    auth,
    login,
    logout,
    isLoading
  };
};