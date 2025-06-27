import React, { useState, useEffect, useCallback } from 'react';
import { Grid3X3,ShoppingBag,Heart,User,Lock } from "lucide-react";

import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Menu,
  X,
  Home,
  CreditCard,
  Truck,
  Mail,
  BarChart3,
  Globe,
  Palette,
  Shield,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react';

// Mock API Data
const mockData = {
  stores: [
    { 
      id: 1, 
      name: 'TechStore Pro', 
      domain: 'techstore.myshop.com', 
      status: 'active',
      theme: 'modern',
      revenue: 45230,
      orders: 234,
      customers: 456,
      products: 89
    }
  ],
  products: [
    { id: 1, name: 'Wireless Headphones', price: 99.99, stock: 45, category: 'Electronics', status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
    { id: 2, name: 'Smart Watch', price: 299.99, stock: 23, category: 'Electronics', status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
    { id: 3, name: 'Laptop Stand', price: 49.99, stock: 67, category: 'Accessories', status: 'active', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop' },
    { id: 4, name: 'USB-C Hub', price: 79.99, stock: 12, category: 'Accessories', status: 'draft', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop' },
    { id: 5, name: 'Mechanical Keyboard', price: 149.99, stock: 31, category: 'Electronics', status: 'active', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=200&fit=crop' },
    { id: 6, name: 'Webcam HD', price: 89.99, stock: 18, category: 'Electronics', status: 'active', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop' }
  ],
  orders: [
    { id: '#ORD-001', customer: 'John Doe', total: 149.98, status: 'completed', date: '2025-01-22', items: 2 },
    { id: '#ORD-002', customer: 'Jane Smith', total: 299.99, status: 'processing', date: '2025-01-22', items: 1 },
    { id: '#ORD-003', customer: 'Mike Johnson', total: 99.99, status: 'shipped', date: '2025-01-21', items: 1 },
    { id: '#ORD-004', customer: 'Sarah Wilson', total: 179.98, status: 'pending', date: '2025-01-21', items: 3 },
    { id: '#ORD-005', customer: 'David Brown', total: 89.99, status: 'completed', date: '2025-01-20', items: 1 },
    { id: '#ORD-006', customer: 'Emily Davis', total: 249.97, status: 'processing', date: '2025-01-20', items: 2 }
  ],
  customers: [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 5, spent: 749.95, joined: '2025-01-15', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 12, spent: 1249.88, joined: '2024-11-22', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 3, spent: 399.97, joined: '2025-02-08', status: 'active' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', orders: 8, spent: 899.92, joined: '2024-12-03', status: 'inactive' },
    { id: 5, name: 'David Brown', email: 'david@example.com', orders: 2, spent: 189.98, joined: '2025-01-10', status: 'active' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', orders: 6, spent: 649.94, joined: '2024-12-15', status: 'active' }
  ]
};

// Utility Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'hover:bg-gray-100 text-gray-700',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);
const CustomerView = ({ user, onLogout }) => (
  <div className="p-8 space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Customer Profile</h1>
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <button
        onClick={onLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  </div>
);
const CustomerProductsView = ({ products,wishlist,setWishlist }) => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Browse Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md">
            <img
              src={product.image || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="font-bold text-blue-600">₹{product.price}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            <button
  onClick={() => {
    if (!wishlist.some(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  }}
  className="mt-2 w-full text-sm bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
>
  ❤️ Add to Wishlist
</button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const CustomerOrdersView = ({ orders }) => {

  const mockOrders = [
    { id: 1, date: '2024-06-20', total: 2499, status: 'Delivered' },
    { id: 2, date: '2024-06-15', total: 1299, status: 'Processing' },
  ];

  return (
    <div className="p-6 space-y-6">
  <h1 className="text-2xl font-bold">My Orders</h1>
  {orders.length === 0 ? (
    <p className="text-gray-600">No orders yet.</p>
  ) : (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white p-4 rounded shadow space-y-2">
          <div className="flex justify-between">
            <span><strong>Order ID:</strong> {order.id}</span>
            <span className="text-sm text-gray-600">{order.date}</span>
          </div>
          <div className="text-sm text-gray-600">Status: {order.status}</div>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-2">
            <div className={`h-2 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'} w-1/2`} />
          </div>
          <div className="text-sm text-gray-600">
            {order.products.length} item(s) – ₹{order.total}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};
const CustomerWishlistView = ({ wishlist, setCart }) => {

  return (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
    {wishlist.length === 0 ? (
      <p className="text-gray-600">Your wishlist is empty.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md">
            <img
              src={product.image || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="font-bold text-blue-600">₹{product.price}</p>
              <button
  onClick={() => {
    setCart((prev) => [...prev, product]);
  }}
  className="mt-2 w-full text-sm bg-green-600 text-white py-1 rounded hover:bg-green-700"
>
  🛒 Add to Cart
</button>

            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};
const CustomerCartView = ({ cart, setCart, setOrders,user})=>{
  

  const handleCheckout = () => {
    if (!cart.length) return alert("Cart is empty");

    const newOrder = {
  id: Math.floor(Math.random() * 10000),
  date: new Date().toISOString().split('T')[0],
  total: cart.reduce((sum, p) => sum + p.price, 0),
  status: 'Processing',
  products: [...cart],
  customerEmail: user.email, // ✅ Tie order to user
};

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    alert("Payment successful. Order placed!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map((product) => (
              <div key={product.id} className="bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">₹{product.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white p-6 shadow rounded space-y-4">
            <h2 className="text-lg font-bold">Total: ₹{cart.reduce((sum, p) => sum + p.price, 0)}</h2>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Pay & Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const CustomerProfileView = ({ user, onLogout }) => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button
        onClick={onLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  </div>
);


const SidebarItem = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left transition-colors duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  >
    <Icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
    {label}
  </button>
);

// Main Dashboard Component
const EcommerceSaaS = () => {
 

  const [storeSettings, setStoreSettings] = useState({
  name: "My Store",
  domain: "mystore.com",
  description: "",
});

const [themeSettings, setThemeSettings] = useState({
  theme: "Bold",
  color: "#3B82F6",
  logo: null,
});

const [notifications, setNotifications] = useState({
  order: true,
  stock: true,
  marketing: false,
});

const [paymentSettings, setPaymentSettings] = useState({
  currency: "USD",
  methods: {
    creditCard: true,
    paypal: true,
    applePay: false,
    googlePay: false,
  },
});
 useEffect(() => {
  document.body.className = themeSettings.theme; // e.g., 'modern', 'bold'
  document.documentElement.style.setProperty('--theme-color', themeSettings.color);
}, [themeSettings]);

  const [customers, setCustomers] = useState([]); // For admin CustomersView

  const [cart, setCart] = useState([]);
const [orders, setOrders] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  const [auth, setAuth] = useState({ role: null, user: null }); // role: 'admin' | 'customer'
  const [deleteProductId, setDeleteProductId] = useState(null);

  const [products, setProducts] = useState(mockData.products);

  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore] = useState(mockData.stores[0]);
  const handleView = (type: string, item: any) => {
  alert(`Viewing ${type}: ${JSON.stringify(item, null, 2)}`);
};
  const [showAddProductModal, setShowAddProductModal] = useState(false);
const [newProduct, setNewProduct] = useState({
  name: '',
  price: '',
  stock: '',
  category: '',
  status: 'active',
  image: ''
});
const handleEdit = (type: string, item: any) => {
  alert(`Editing ${type}: ${JSON.stringify(item, null, 2)}`);
};

const handleDelete = (type: string, item: any) => {
  alert(`Deleting ${type}: ${JSON.stringify(item, null, 2)}`);
};

const handleMore = (type: string, item: any) => {
  alert(`More options for ${type}: ${JSON.stringify(item, null, 2)}`);
};


  // Simulate API calls
  const simulateApiCall = useCallback((duration = 1000) => {
    setLoading(true);
    setTimeout(() => setLoading(false), duration);
  }, []);

  // Navigation items
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'marketing', name: 'Marketing', icon: Mail },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  // Dashboard Stats
  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-green-800">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">${selectedStore.revenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 ml-1">+12.5% from last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-500 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-blue-800">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">{selectedStore.orders}</p>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600 ml-1">+8.2% from last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="p-3 bg-purple-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-purple-800">Total Customers</p>
              <p className="text-2xl font-bold text-purple-900">{selectedStore.customers}</p>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600 ml-1">+15.3% from last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="flex items-center p-6">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="p-3 bg-orange-500 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-orange-800">Total Products</p>
              <p className="text-2xl font-bold text-orange-900">{selectedStore.products}</p>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600 ml-1">+3.1% from last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Recent Orders Component
  const RecentOrders = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('orders')}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={order.status === 'completed' ? 'success' : order.status === 'processing' ? 'warning' : order.status === 'shipped' ? 'info' : 'default'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  // Dashboard View
  const DashboardView = ({products}) => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={()=>setShowAddProductModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('products')}>
                  <Package className="h-4 w-4 mr-3" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('orders')}>
                  <ShoppingCart className="h-4 w-4 mr-3" />
                  Process Orders
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('customers')}>
                  <Users className="h-4 w-4 mr-3" />
                  View Customers
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('analytics')}>
                  <BarChart3 className="h-4 w-4 mr-3" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
               {products.slice(0, 4).map((product, index) => (

                  <div key={product.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Products View
  const ProductsView = ({ products, setProducts, setDeleteProductId }) => {

    // const [products, setProducts] = useState(mockData.products);
const [filteredProducts, setFilteredProducts] = useState(products);


    useEffect(() => {
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredProducts(filtered);
}, [searchTerm, products]);



    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={() => setShowAddProductModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-12 w-12 rounded-lg object-cover" src={product.image} alt={product.name} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center ${product.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stock}
                            {product.stock < 20 && <AlertCircle className="h-4 w-4 ml-1" />}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={product.status === 'active' ? 'success' : 'warning'}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView('product', product)}>
  <Eye className="h-4 w-4" />
</Button>
<Button variant="ghost" size="sm" onClick={() => handleEdit('product', product)}>
  <Edit className="h-4 w-4" />
</Button>
<Button variant="ghost" size="sm" onClick={() => setDeleteProductId(product.id)}>
  <MoreHorizontal className="h-4 w-4" />
</Button>


                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Orders View
  const OrdersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          order.status === 'completed' ? 'success' : 
                          order.status === 'processing' ? 'warning' : 
                          order.status === 'shipped' ? 'info' : 'default'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleView('order', order)}>
  <Eye className="h-4 w-4" />
</Button>
<Button variant="ghost" size="sm" onClick={() => handleEdit('order', order)}>
  <Edit className="h-4 w-4" />
</Button>
<Button variant="ghost" size="sm" onClick={() => handleMore('order', order)}>
  <MoreHorizontal className="h-4 w-4" />
</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Customers View
const CustomersView = ({ customers, orders }) => {
  // ADD THE JSX YOU POSTED HERE ↓
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
      {customers.length === 0 ? (
        <p className="text-gray-600">No customers have logged in yet.</p>
      ) : (
        customers.map((customer) => {
          const customerOrders = orders.filter(o => o.customerEmail === customer.email);
          return (
            <div key={customer.email} className="bg-white p-4 rounded shadow space-y-2">
              <h2 className="text-lg font-semibold">{customer.name}</h2>
              <p className="text-sm text-gray-500">{customer.email}</p>
              <p className="text-sm text-gray-600">
                Orders: {customerOrders.length}
              </p>
              {customerOrders.map(order => (
                <div key={order.id} className="pl-4 text-sm text-gray-700">
                  Order #{order.id} - ₹{order.total} - {order.status}
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};


  // Analytics View
  const AnalyticsView = ({products}) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Insights and performance metrics</p>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-200">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Sales Chart</p>
                <p className="text-gray-500 text-sm">Interactive chart would display here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
             {products.slice(0, 4).map((product, index) => (

                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      #{index + 1}
                    </div>
                    <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">${product.price}</div>
                    <div className="text-xs text-gray-500">{product.stock} in stock</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Product Sales</span>
                <span className="text-sm font-medium text-gray-900">$32,450</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium text-gray-900">$8,780</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '19%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxes</span>
                <span className="text-sm font-medium text-gray-900">$4,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Order #ORD-001 completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New product added</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New customer registered</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                  <p className="text-xs text-gray-500">8 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Marketing View
  const MarketingView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-600 mt-1">Grow your business with targeted campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Email Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">24.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Summer Sale Newsletter</p>
                  <p className="text-xs text-gray-500">Sent 2 days ago • 2,340 recipients</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success">Active</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Product Launch Campaign</p>
                  <p className="text-xs text-gray-500">Sent 1 week ago • 1,875 recipients</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">Completed</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Customer Retention Program</p>
                  <p className="text-xs text-gray-500">Scheduled for tomorrow • 3,420 recipients</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="warning">Scheduled</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Settings View
 const SettingsView = ({
  storeSettings,
  setStoreSettings,
  themeSettings,
  setThemeSettings,
  notifications,
  setNotifications,
  paymentSettings,
  setPaymentSettings,
}) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeSettings.color);
  }, [themeSettings.color]);

  const handleThemeChange = (theme) => {
    setThemeSettings({ ...themeSettings, theme });
    document.body.className = theme;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Store Settings</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Name</label>
                <input
                  type="text"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Domain</label>
                <input
                  type="text"
                  value={storeSettings.domain}
                  onChange={(e) => setStoreSettings({ ...storeSettings, domain: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Description</label>
                <input
                  type="text"
                  value={storeSettings.description}
                  onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <Button className="w-full" onClick={() => alert("Store settings saved!")}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={themeSettings.theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    type="color"
                    value={themeSettings.color}
                    onChange={(e) => setThemeSettings({ ...themeSettings, color: e.target.value })}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={themeSettings.color}
                    onChange={(e) => setThemeSettings({ ...themeSettings, color: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  onChange={(e) => setThemeSettings({ ...themeSettings, logo: e.target.files[0] })}
                />
              </div>
              <Button className="w-full" onClick={() => alert("Theme updated successfully!")}>Update Theme</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['current', 'new', 'confirm'].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)} Password
                  </label>
                  <input
                    type="password"
                    value={passwords[key]}
                    onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              ))}
              <Button
                className="w-full"
                onClick={() => {
                  if (passwords.new !== passwords.confirm) {
                    alert("Passwords do not match");
                  } else {
                    alert("Password updated successfully!");
                  }
                }}
              >
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => setNotifications({ ...notifications, [key]: !value })}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Methods</label>
                <div className="mt-2 space-y-2">
                  {Object.entries(paymentSettings.methods).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => setPaymentSettings({
                          ...paymentSettings,
                          methods: {
                            ...paymentSettings.methods,
                            [key]: !value,
                          },
                        })}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => alert("Payment settings saved!")}
              >
                Save Payment Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
  // Render current view
 const renderCurrentView = () => {
 if (auth.role === 'customer') {
  switch (currentView) {
    case 'customer-products':
      return <CustomerProductsView products={products} wishlist={wishlist} setWishlist={setWishlist}/>;
    case 'customer-orders':

      return <CustomerOrdersView orders={orders} />;
    case 'customer-wishlist':


    return <CustomerWishlistView wishlist={wishlist} setCart={setCart} />;
    case 'customer-profile':
      return <CustomerProfileView user={auth.user} onLogout={() => setAuth({ role: null, user: null })} />;
    case 'customer-cart':
      return <CustomerCartView cart={cart} setCart={setCart} setOrders={setOrders}user={auth.user}/>;
    default:
      return <CustomerProductsView products={products} />;
  }
}



  switch (currentView) {
    case 'dashboard':
      return <DashboardView products={products} />;
    case 'products':
      return <ProductsView products={products} setProducts={setProducts} setDeleteProductId={setDeleteProductId} />;
    case 'orders':
      return <OrdersView />;
     case 'customers':
        return <CustomersView customers={customers} orders={orders} />;
    case 'settings':
      return <SettingsView
  storeSettings={storeSettings}
  setStoreSettings={setStoreSettings}
  themeSettings={themeSettings}
  setThemeSettings={setThemeSettings}
  notifications={notifications}
  setNotifications={setNotifications}
  paymentSettings={paymentSettings}
  setPaymentSettings={setPaymentSettings}
/>;
;
      case 'marketing':
        return <MarketingView/>
    case 'analytics':
      return <AnalyticsView products={products} />;
    default:
      return <DashboardView products={products} />;

  }
};

 
const LoginView = ({setAuth,setCustomers})=>{
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');

  const handleLogin = () => {
    if (!email) return alert('Enter your email');
    setAuth({ role, user: { email, name: role === 'admin' ? 'Admin User' : 'Customer User' } });
    if (role === 'customer') {
  setCustomers((prev) => {
    const exists = prev.find((c) => c.email === email);
    if (exists) return prev;
    return [...prev, { email, name: 'Customer User' }];
  });
}

  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">ShopNest</h2>
            <p className="text-gray-300">Touch-Shop-Repeat</p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-opacity-15"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-opacity-15 appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin" className="bg-gray-800 text-white">Administrator</option>
                <option value="customer" className="bg-gray-800 text-white">Customer</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Secure login with end-to-end encryption
            </p>
          </div>
        </div>

        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 bg-opacity-20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500 bg-opacity-20 rounded-full blur-xl animate-pulse"></div>
      </div>
    </div>
  );
};


if (!auth.role) {
  return <LoginView setAuth={setAuth} setCustomers={setCustomers} />;
}
  else{
  return (
    <div className="min-h-screen bg-gray-50">
      {auth.role && (
  <button
    onClick={() => setAuth({ role: null, user: null })}
    className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md"
  >
    Logout
  </button>
)}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">EcommerceHub</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left transition-colors duration-200 ${
                        currentView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-4 flex-shrink-0 h-6 w-6 ${
                        currentView === item.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">EcommerceHub</span>
            </div>
           {auth.role === 'customer' && (
  <nav className="mt-5 px-2 space-y-1">
    <SidebarItem icon={Grid3X3} label="Products" onClick={() => setCurrentView('customer-products')} />
      <SidebarItem icon={CreditCard} label="Cart" onClick={() => setCurrentView('customer-cart')} />

    <SidebarItem icon={ShoppingBag} label="My Orders" onClick={() => setCurrentView('customer-orders')} />
    <SidebarItem icon={Heart} label="Wishlist" onClick={() => setCurrentView('customer-wishlist')} />
    <SidebarItem icon={User} label="Profile" onClick={() => setCurrentView('customer-profile')} />
  </nav>
)}

{auth.role=='admin' && (

            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200 ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      currentView === item.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page header */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:block hidden">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">{currentView}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">3</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">AD</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderCurrentView()}
            </div>
          </div>
        </main>
        {showAddProductModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          className="w-full border px-3 py-2 rounded-md"
        />
        <select
          value={newProduct.status}
          onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowAddProductModal(false)}>Cancel</Button>
        <Button onClick={() => {
  const newEntry = {
    ...newProduct,
    id: products.length + 1,
    price: parseFloat(newProduct.price),
    stock: parseInt(newProduct.stock),
  };
  setProducts([...products, newEntry]);
  setNewProduct({ name: '', price: '', stock: '', category: '', status: 'active', image: '' });
  setShowAddProductModal(false);
}}>
          Save
        </Button>
      </div>
    </div>
  </div>
)}
{deleteProductId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Delete Product</h2>
      <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this product?</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setDeleteProductId(null)}>Cancel</Button>
        <Button
          variant="danger"
          onClick={() => {
            setProducts(prev => prev.filter(p => p.id !== deleteProductId));
            setDeleteProductId(null);
          }}
        >
          Confirm Delete
        </Button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}
};

export default EcommerceSaaS;