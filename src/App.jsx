import React, { useState } from 'react';
import Layout from './components/layout';
import Auth from './components/auth';
import Dashboard from './components/dashboard';
import Products from './components/products';
import CustomerViews from './components/CustomerViews';
import { Orders, Customers, Analytics, Marketing, Settings } from './components/OtherViews';
import { useAuth } from './hooks/useAuth';
import { mockData } from './api/mockData';
import { useTenant } from './context/TenantContext';
import { useTenantProducts } from './hooks/useTenantData';


const App = () => {
  const { auth, login, logout, isLoading: authLoading, isInitialized } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
 // Comment out useTenantProducts for now since it's causing issues
// const { products, createProduct, updateProduct, deleteProduct } = useTenantProducts();
  // const [orders, setOrders] = useState([]);  
// Fix the useState - you need both products AND setProducts
const [products, setProducts] = useState(mockData.products);  // ✅ CORRECT!

// Add these functions for now
const createProduct = async (data) => {
  setProducts(prev => [...prev, { ...data, id: Date.now() }]);
};
const updateProduct = async (id, data) => {
  setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
};
const deleteProduct = async (id) => {
  setProducts(prev => prev.filter(p => p.id !== id));
};
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Show loading while initializing
  if (!isInitialized || tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your store...</p>
        </div>
      </div>
    );
  }

  // Handle customer registration on login
  const handleLogin = (email, role) => {
    login(email, role);
    if (role === 'customer') {
      setCustomers(prev => {
        const exists = prev.find(c => c.email === email);
        if (exists) return prev;
        return [...prev, { email, name: 'Customer User' }];
      });
      setCurrentView('customer-products');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('dashboard');
    setCart([]);
    setOrders([]);
    setWishlist([]);
  };

  // Show login if not authenticated
  if (!auth.role) {
    return <Auth onLogin={handleLogin} isLoading={authLoading} />;
  }


  // Render current view based on user role and selection
  const renderCurrentView = () => {
    if (auth.role === 'customer') {
      return (
        <CustomerViews
          currentView={currentView}
          setCurrentView={setCurrentView}
          products={products}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cart={cart}
          setCart={setCart}  
          wishlist={wishlist}
          setWishlist={setWishlist}
          orders={orders}
          setOrders={setOrders}
          auth={auth}
          onLogout={handleLogout}
        />
      );
    }

    // Admin views
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            setCurrentView={setCurrentView}
            setShowAddProductModal={setShowAddProductModal}
            products={products}
          />
        );
      case 'products':
        return (
          <Products
            products={products}
            setProducts={setProducts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showAddProductModal={showAddProductModal}
            setShowAddProductModal={setShowAddProductModal}
          />
        );
      // In your renderCurrentView function in App.jsx
      case 'orders':
        return <Orders orders={orders} setOrders={setOrders} />;
      case 'customers':
        return <Customers customers={customers} />;
      case 'analytics':
        return <Analytics />;
      case 'marketing':
        return <Marketing />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard
            setCurrentView={setCurrentView}
            setShowAddProductModal={setShowAddProductModal}
            products={products}
          />
        );
    }
  };

  // Show login if not authenticated
  if (!auth.role) {
    return <Auth onLogin={handleLogin} isLoading={isLoading} />;
  }

  // Main app layout
  return (
    <Layout
      auth={auth}
      onLogout={handleLogout}
      currentView={currentView}
      setCurrentView={setCurrentView}
    >
      {renderCurrentView()}
    </Layout>
  );
};

export default App;