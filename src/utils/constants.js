import { 
  Home, Package, ShoppingCart, Users, BarChart3, Mail, Settings,
  Grid3X3, ShoppingBag, Heart, User 
} from 'lucide-react';

// Admin Navigation
export const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'products', name: 'Products', icon: Package },
  { id: 'orders', name: 'Orders', icon: ShoppingCart },
  { id: 'customers', name: 'Customers', icon: Users },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'marketing', name: 'Marketing', icon: Mail },
  { id: 'settings', name: 'Settings', icon: Settings }
];

// Customer Navigation
export const customerNavigation = [
  { id: 'customer-products', name: 'Products', icon: Grid3X3 },
  { id: 'customer-cart', name: 'Cart', icon: ShoppingCart },
  { id: 'customer-orders', name: 'My Orders', icon: ShoppingBag },
  { id: 'customer-wishlist', name: 'Wishlist', icon: Heart },
  { id: 'customer-profile', name: 'Profile', icon: User }
];

// Status variants
export const statusVariants = {
  active: 'success',
  completed: 'success',
  processing: 'warning',
  shipped: 'info',
  pending: 'warning',
  draft: 'warning'
};

// Theme options
export const themes = [
  { value: 'modern', label: 'Modern & Sleek' },
  { value: 'classic', label: 'Classic Elegance' },
  { value: 'minimal', label: 'Minimal Clean' },
  { value: 'bold', label: 'Bold & Vibrant' }
];

// Currency options
export const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];