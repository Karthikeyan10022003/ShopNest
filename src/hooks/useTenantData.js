// src/hooks/useTenantData.js
import { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { apiClient } from '../services/apiClient';

export const useTenantProducts = (params = {}) => {
  const { tenant } = useTenant();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tenant) {
      fetchProducts();
    }
  }, [tenant, JSON.stringify(params)]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getProducts(params, tenant._id);
      setProducts(response.products || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch products:', err);
      
      // Fallback to empty array on error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await apiClient.createProduct(productData, tenant._id);
      setProducts(prev => [response.product, ...prev]);
      return response.product;
    } catch (err) {
      console.error('Create product error:', err);
      throw err;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const response = await apiClient.updateProduct(productId, productData, tenant._id);
      setProducts(prev => prev.map(p => 
        p._id === productId ? response.product : p
      ));
      return response.product;
    } catch (err) {
      console.error('Update product error:', err);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await apiClient.deleteProduct(productId, tenant._id);
      setProducts(prev => prev.filter(p => p._id !== productId));
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