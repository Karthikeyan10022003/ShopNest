// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export const useAuth = () => {
  const [auth, setAuth] = useState({ role: null, user: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          apiClient.setToken(token);
          const response = await apiClient.getCurrentUser();
          setAuth({ 
            role: response.user.role, 
            user: response.user 
          });
        } catch (error) {
          console.error('Failed to restore session:', error);
          apiClient.setToken(null);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (email, role) => {
    if (!email) {
      alert('Enter your email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, use a default password
      // In production, you'd have a proper login form
      const response = await apiClient.login(email, 'password123');
      
      if (response.user) {
        setAuth({ 
          role: response.user.role, 
          user: response.user 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuth({ role: null, user: null });
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      const response = await apiClient.register(userData);
      
      if (response.user) {
        setAuth({ 
          role: response.user.role, 
          user: response.user 
        });
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    auth,
    login,
    logout,
    register,
    isLoading,
    isInitialized
  };
};