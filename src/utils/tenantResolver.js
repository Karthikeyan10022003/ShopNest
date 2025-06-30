// src/utils/tenantResolver.js
import { apiClient } from '../api/tenantClient';

export const resolveTenantFromURL = async () => {
  const hostname = window.location.hostname;
  const subdomain = extractSubdomain(hostname);
  
  // Try to resolve by custom domain first
  if (!subdomain || subdomain === 'www') {
    return await resolveTenantByDomain(hostname);
  }
  
  // Then try subdomain
  return await resolveTenantBySubdomain(subdomain);
};

export const extractSubdomain = (hostname) => {
  // Handle localhost development
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    const params = new URLSearchParams(window.location.search);
    return params.get('tenant'); // ?tenant=techstore for development
  }
  
  const parts = hostname.split('.');
  
  // For production: subdomain.yourdomain.com
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
};

export const resolveTenantBySubdomain = async (subdomain) => {
  try {
    const response = await apiClient.resolveTenantBySubdomain(subdomain);
    return response;
  } catch (error) {
    console.error('Failed to resolve tenant by subdomain:', error);
    return null;
  }
};

export const resolveTenantByDomain = async (domain) => {
  try {
    const response = await apiClient.resolveTenantByDomain(domain);
    return response;
  } catch (error) {
    console.error('Failed to resolve tenant by domain:', error);
    return null;
  }
};

export const fetchTenantById = async (tenantId) => {
  try {
    const response = await apiClient.getTenantById(tenantId);
    return response;
  } catch (error) {
    console.error('Failed to fetch tenant:', error);
    throw error;
  }
};

// Mock tenant data for development (when API is not available)
export const getMockTenantData = () => {
  const hostname = window.location.hostname;
  const subdomain = extractSubdomain(hostname);
  
  // Return mock tenant based on subdomain or default
  const mockTenants = {
    techstore: {
      id: '1',
      name: 'TechStore Pro',
      subdomain: 'techstore',
      custom_domain: null,
      plan: 'pro',
      status: 'active',
      currency: 'USD',
      max_products: 1000,
      max_orders: 10000,
      max_storage_mb: 5120,
      used_storage_mb: 1024,
      brand_colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6'
      },
      logo_url: null,
      settings: {
        tagline: 'Premium E-commerce Platform',
        welcome_message: 'Experience the future of e-commerce management'
      }
    },
    fashionhub: {
      id: '2',
      name: 'Fashion Hub',
      subdomain: 'fashionhub',
      custom_domain: null,
      plan: 'basic',
      status: 'active',
      currency: 'EUR',
      max_products: 100,
      max_orders: 1000,
      max_storage_mb: 1024,
      used_storage_mb: 256,
      brand_colors: {
        primary: '#EC4899',
        secondary: '#8B5CF6'
      },
      logo_url: null,
      settings: {
        tagline: 'Fashion Forward',
        welcome_message: 'Discover the latest fashion trends'
      }
    }
  };

  return mockTenants[subdomain] || mockTenants.techstore;
};

// Development helper to switch tenants
export const switchToTenant = (subdomain) => {
  if (process.env.NODE_ENV === 'development') {
    const currentURL = new URL(window.location);
    currentURL.searchParams.set('tenant', subdomain);
    window.location.href = currentURL.toString();
  } else {
    window.location.href = `https://${subdomain}.yourdomain.com`;
  }
};