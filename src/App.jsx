import React, { useState } from 'react';
import Layout from './components/layout';
import Auth from './components/auth';
import Dashboard from './components/dashboard';
import Products from './components/products';
import CustomerViews from './components/CustomerViews';
import { Orders, Customers, Analytics, Marketing, Settings } from './components/OtherViews';
import { useAuth } from './hooks/useAuth';
import { mockData } from './api/mockData';

const App = () => {
  const { auth, login, logout, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(mockData.products);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

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
      case 'orders':
        return <Orders />;
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