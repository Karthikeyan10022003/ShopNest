import { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { apiClient } from '../api/tenantClient';

export const useTenantProducts = (params = {}) => {
  const { tenant } = useTenant();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Always fetch products when component mounts or tenant/params change
    fetchProducts();
  }, [tenant, JSON.stringify(params)]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock product data
        const mockProducts = [
          {
            id: 1,
            name: 'iPhone 15 Pro Max',
            price: 1199.99,
            stock: 45,
            category: 'Smartphones',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
            rating: 4.8,
            reviews: 2324
          },
          {
            id: 2,
            name: 'MacBook Pro 14-inch M3',
            price: 1999.99,
            stock: 23,
            category: 'Laptops',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
            rating: 4.9,
            reviews: 1156
          },
          {
            id: 3,
            name: 'Sony WH-1000XM5 Headphones',
            price: 349.99,
            stock: 67,
            category: 'Headphones',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
            rating: 4.7,
            reviews: 889
          },
          {
            id: 4,
            name: 'PlayStation 5 Console',
            price: 499.99,
            stock: 12,
            category: 'Gaming',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
            rating: 4.8,
            reviews: 3456
          },
          {
            id: 5,
            name: 'Nike Air Force 1',
            price: 90.00,
            stock: 156,
            category: 'Footwear',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
            rating: 4.6,
            reviews: 2145
          }
        ];
        
        // Filter based on search if provided
        let filteredProducts = mockProducts;
        if (params.search) {
          filteredProducts = mockProducts.filter(product =>
            product.name.toLowerCase().includes(params.search.toLowerCase()) ||
            product.category.toLowerCase().includes(params.search.toLowerCase())
          );
        }
        
        setProducts(filteredProducts);
        return;
      }
      
      // Production API call
      if (tenant) {
        apiClient.setTenant(tenant);
        const data = await apiClient.getProducts(params);
        setProducts(data.products || data || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Mock product creation
        const newProduct = {
          ...productData,
          id: Date.now(), // Use timestamp as ID
          rating: 0,
          reviews: 0,
          image: productData.image || 'https://via.placeholder.com/400x400?text=New+Product'
        };
        
        console.log('Creating product:', newProduct);
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
      }
      
      const newProduct = await apiClient.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      console.error('Create product error:', err);
      throw err;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Mock product update
        console.log('Updating product:', productId, productData);
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, ...productData } : p
        ));
        return { ...productData, id: productId };
      }
      
      const updatedProduct = await apiClient.updateProduct(productId, productData);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      console.error('Update product error:', err);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Mock product deletion
        console.log('Deleting product:', productId);
        setProducts(prev => {
          const newProducts = prev.filter(p => p.id !== productId);
          console.log('Products after delete:', newProducts);
          return newProducts;
        });
        return;
      }
      
      await apiClient.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Delete product error:', err);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};

export const useTenantOrders = (params = {}) => {
  const { tenant } = useTenant();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenant) {
      apiClient.setTenant(tenant);
      fetchOrders();
    }
  }, [tenant, JSON.stringify(params)]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        // Mock orders data
        await new Promise(resolve => setTimeout(resolve, 800));
        setOrders([]);
        setLoading(false);
        return;
      }
      
      const data = await apiClient.getOrders(params);
      setOrders(data.orders || data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const newOrder = {
          ...orderData,
          id: Date.now(),
          status: 'processing',
          created_at: new Date().toISOString()
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
      }
      
      const newOrder = await apiClient.createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders,
  };
};

export const useTenantCustomers = (params = {}) => {
  const { tenant } = useTenant();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenant) {
      apiClient.setTenant(tenant);
      fetchCustomers();
    }
  }, [tenant, JSON.stringify(params)]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 600));
        setCustomers([]);
        setLoading(false);
        return;
      }
      
      const data = await apiClient.getCustomers(params);
      setCustomers(data.customers || data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
  };
};

export const useTenantAnalytics = (params = {}) => {
  const { tenant } = useTenant();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenant) {
      apiClient.setTenant(tenant);
      fetchAnalytics();
    }
  }, [tenant, JSON.stringify(params)]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock analytics data
        const mockAnalytics = {
          totalRevenue: 245670,
          totalOrders: 1834,
          totalCustomers: 567,
          totalProducts: 89,
          revenueGrowth: 12.5,
          orderGrowth: 8.2,
          customerGrowth: 15.3,
          productGrowth: 3.1,
          averageOrderValue: 133.85,
          conversionRate: 3.2
        };
        
        setAnalytics(mockAnalytics);
        setLoading(false);
        return;
      }
      
      const data = await apiClient.getAnalytics(params);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export const useTenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenant) {
      apiClient.setTenant(tenant);
    }
  }, [tenant]);

  const updateSettings = async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await refreshTenant();
        setLoading(false);
        return settings;
      }
      
      const updatedSettings = await apiClient.updateTenantSettings(settings);
      await refreshTenant();
      return updatedSettings;
    } catch (err) {
      setError(err.message);
      console.error('Failed to update tenant settings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings: tenant,
    loading,
    error,
    updateSettings,
  };
};