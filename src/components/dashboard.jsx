import React from 'react';
import { 
  DollarSign, ShoppingCart, Users, Package, Plus, Download, ChevronRight,
  CheckCircle, AlertCircle, Activity, Award, Star, Zap, BarChart3
} from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Badge } from './ui';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { mockData } from '../api/mockData';

// Enhanced Stats Widget with animations
const StatsWidget = ({ icon: Icon, title, value, change, color, prefix = '', suffix = '' }) => {
  const animatedValue = useAnimatedCounter(value, 2000);
  
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${color} border-0`}>
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <CardContent className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">
              {prefix}{animatedValue.toLocaleString()}{suffix}
            </p>
            {change && (
              <div className="flex items-center space-x-1">
                <span className={`text-sm text-green-300`}>
                  +{Math.abs(change)}%
                </span>
                <span className="text-white/60 text-sm">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Dashboard Stats
const DashboardStats = () => {
  const selectedStore = mockData.stores[0];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsWidget
        icon={DollarSign}
        title="Total Revenue"
        value={selectedStore.revenue}
        change={12.5}
        color="from-emerald-500 to-green-600"
        prefix="$"
      />
      <StatsWidget
        icon={ShoppingCart}
        title="Total Orders"
        value={selectedStore.orders}
        change={8.2}
        color="from-blue-500 to-cyan-600"
      />
      <StatsWidget
        icon={Users}
        title="Total Customers"
        value={selectedStore.customers}
        change={15.3}
        color="from-purple-500 to-pink-600"
      />
      <StatsWidget
        icon={Package}
        title="Total Products"
        value={selectedStore.products}
        change={3.1}
        color="from-orange-500 to-red-600"
      />
    </div>
  );
};

const Dashboard = ({ setCurrentView, setShowAddProductModal, products }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowAddProductModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders Widget */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
                <Button variant="ghost" size="sm" onClick={() => setCurrentView('orders')}>
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                {mockData.orders.slice(0, 5).map((order, index) => (
                  <div 
                    key={order.id} 
                    className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          order.status === 'completed' ? 'bg-green-500' :
                          order.status === 'processing' ? 'bg-yellow-500' :
                          order.status === 'shipped' ? 'bg-blue-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${order.total}</p>
                        <Badge 
                          variant={
                            order.status === 'completed' ? 'success' : 
                            order.status === 'processing' ? 'warning' : 
                            order.status === 'shipped' ? 'info' : 'default'
                          }
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Chart Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Sales Analytics</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">7D</Button>
                  <Button variant="ghost" size="sm">30D</Button>
                  <Button variant="ghost" size="sm">90D</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Interactive Sales Chart</p>
                    <p className="text-gray-500">Real-time analytics visualization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { icon: Package, label: 'Add New Product', view: 'products', color: 'from-blue-500 to-cyan-500' },
                  { icon: ShoppingCart, label: 'Process Orders', view: 'orders', color: 'from-green-500 to-emerald-500' },
                  { icon: Users, label: 'View Customers', view: 'customers', color: 'from-purple-500 to-pink-500' },
                  { icon: BarChart3, label: 'View Analytics', view: 'analytics', color: 'from-orange-500 to-red-500' }
                ].map((action, index) => (
                  <button
                    key={action.view}
                    onClick={() => setCurrentView(action.view)}
                    className="w-full p-3 rounded-lg border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-200 text-left group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Top Products
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products?.slice(0, 4).map((product, index) => (
                  <div 
                    key={product.id} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative">
                      <img 
                        className="w-12 h-12 rounded-lg object-cover shadow-sm" 
                        src={product.image} 
                        alt={product.name} 
                      />
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-blue-600">${product.price}</p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-500" />
                Recent Activity
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: 'Order #ORD-001 completed', time: '2 hours ago', color: 'text-green-500' },
                  { icon: Package, text: 'New product added', time: '4 hours ago', color: 'text-blue-500' },
                  { icon: Users, text: 'New customer registered', time: '6 hours ago', color: 'text-purple-500' },
                  { icon: AlertCircle, text: 'Low stock alert', time: '8 hours ago', color: 'text-yellow-500' }
                ].map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;