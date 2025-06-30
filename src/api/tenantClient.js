// src/api/tenantClient.js
class TenantAwareAPIClient {
  constructor() {
    this.baseURL = '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set tenant context for all requests
  setTenant(tenant) {
    this.tenant = tenant;
    if (tenant) {
      this.defaultHeaders['X-Tenant-ID'] = tenant.id;
    } else {
      delete this.defaultHeaders['X-Tenant-ID'];
    }
  }

  // Generic request method with tenant context
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // Add tenant ID to request if not already present
    if (this.tenant && !config.headers['X-Tenant-ID']) {
      config.headers['X-Tenant-ID'] = this.tenant.id;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Tenant-specific API methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/customers${queryString ? `?${queryString}` : ''}`);
  }

  async getAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics${queryString ? `?${queryString}` : ''}`);
  }

  async getTenantSettings() {
    return this.request('/tenant/settings');
  }

  async updateTenantSettings(settings) {
    return this.request('/tenant/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Tenant resolution methods
  async resolveTenantBySubdomain(subdomain) {
    return this.request(`/tenants/resolve/subdomain/${subdomain}`);
  }

  async resolveTenantByDomain(domain) {
    return this.request(`/tenants/resolve/domain/${domain}`);
  }

  async getTenantById(tenantId) {
    return this.request(`/tenants/${tenantId}`);
  }
}

export const apiClient = new TenantAwareAPIClient();