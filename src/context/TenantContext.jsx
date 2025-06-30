// src/context/TenantContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { resolveTenantFromURL, fetchTenantById, getMockTenantData } from '../utils/tenantResolver';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize tenant from URL
  useEffect(() => {
    initializeTenant();
  }, []);

  const initializeTenant = async () => {
    try {
      setLoading(true);
      
      // First try to get from localStorage
      const storedTenant = localStorage.getItem('currentTenant');
      if (storedTenant) {
        try {
          const tenantData = JSON.parse(storedTenant);
          setTenant(tenantData);
        } catch (e) {
          console.error('Failed to parse stored tenant:', e);
        }
      }

      // Try to resolve tenant from URL
      let tenantInfo;
      try {
        tenantInfo = await resolveTenantFromURL();
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        // Fallback to mock data for development
        tenantInfo = getMockTenantData();
      }
      
      if (tenantInfo) {
        setTenant(tenantInfo);
        localStorage.setItem('currentTenant', JSON.stringify(tenantInfo));
        setError(null);
      } else {
        throw new Error('Tenant not found');
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to initialize tenant:', err);
      
      // For development, provide a default tenant
      if (process.env.NODE_ENV === 'development') {
        const defaultTenant = getMockTenantData();
        setTenant(defaultTenant);
        localStorage.setItem('currentTenant', JSON.stringify(defaultTenant));
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = async (tenantId) => {
    try {
      setLoading(true);
      let tenantInfo;
      
      try {
        tenantInfo = await fetchTenantById(tenantId);
      } catch (apiError) {
        console.warn('API not available for tenant switch:', apiError);
        // In development, just reload with mock data
        if (process.env.NODE_ENV === 'development') {
          window.location.reload();
          return;
        }
        throw apiError;
      }
      
      setTenant(tenantInfo);
      localStorage.setItem('currentTenant', JSON.stringify(tenantInfo));
      
      // Redirect to tenant's domain
      const targetURL = tenantInfo.custom_domain 
        ? `https://${tenantInfo.custom_domain}` 
        : `https://${tenantInfo.subdomain}.yourdomain.com`;
      
      window.location.href = targetURL;
    } catch (err) {
      setError(err.message);
      console.error('Failed to switch tenant:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTenant = async () => {
    if (tenant?.id) {
      try {
        let updatedTenant;
        try {
          updatedTenant = await fetchTenantById(tenant.id);
        } catch (apiError) {
          console.warn('API not available for refresh:', apiError);
          // Keep current tenant data if API is unavailable
          return;
        }
        
        setTenant(updatedTenant);
        localStorage.setItem('currentTenant', JSON.stringify(updatedTenant));
      } catch (err) {
        console.error('Failed to refresh tenant:', err);
      }
    }
  };

  const value = {
    tenant,
    loading,
    error,
    switchTenant,
    refreshTenant,
    isMultiTenant: true
  };

  // Show loading screen while resolving tenant
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your store...</p>
        </div>
      </div>
    );
  }

  // Show error screen if tenant resolution failed (only in production)
  if (error && process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900">
        <div className="text-center text-white max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-white text-red-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Go to Main Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};