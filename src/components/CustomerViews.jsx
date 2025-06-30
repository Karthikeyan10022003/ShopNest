import React, { useState } from 'react';
import { 
  Search, Filter, Plus, ShoppingCart, Heart, Eye, Star, Trash2, 
  Package, CreditCard, DollarSign, ShoppingBag, Lock, Share2,
  MapPin, Truck, Clock, Shield, Award, Gift, Percent, Grid,
  List, SlidersHorizontal, ArrowLeft, ArrowRight, Minus,X
} from 'lucide-react';
import { Card, CardContent, Button, Badge } from './ui';
import { categoriesAPI, couponsAPI } from '../api/mockData';

// Enhanced Product Card with advanced features
const ProductCard = ({ product, onAddToCart, onAddToWishlist, onViewDetails,showActions = true, viewMode = 'grid' }) => {
  // Add this state at the top of CustomerViews component, with other useState declarations


// Add this component inside CustomerViews, before the other view components

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              {product.discount > 0 && (
                <Badge variant="danger" className="absolute -top-2 -right-2" size="sm">
                  -{product.discount}%
                </Badge>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.brand} • {product.category}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviews})</span>
                </div>
                
                <Badge variant={product.stock > 20 ? 'success' : product.stock > 0 ? 'warning' : 'danger'} size="sm">
                  {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                </Badge>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="info" size="sm">{feature}</Badge>
                  ))}
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => onAddToCart?.(product)}
                  disabled={product.stock === 0}
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <div className="flex space-x-2">
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-lg transition-colors ${
                      isWishlisted ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Product Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {product.discount > 0 && (
            <Badge variant="danger" size="sm">-{product.discount}%</Badge>
          )}
          {product.freeShipping && (
            <Badge variant="success" size="sm">Free Shipping</Badge>
          )}
          {product.fastDelivery && (
            <Badge variant="info" size="sm">Fast Delivery</Badge>
          )}
          {product.tags?.includes('new-arrival') && (
            <Badge variant="premium" size="sm">New</Badge>
          )}
        </div>

        {/* Product Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`p-2 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 ${
                isWishlisted 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            {/* // In ProductCard component, find the eye button and change it to: */}
<button 
  onClick={() => onViewDetails?.(product.id)}
  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-all duration-200"
>
  <Eye className="w-4 h-4" />
</button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-green-50 hover:text-green-500 transition-all duration-200">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick View on Hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm opacity-75">({product.reviews})</span>
            </div>
            {product.features && product.features.length > 0 && (
              <span className="text-xs opacity-75">{product.features[0]}</span>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${selectedVariant?.price || product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            <Badge variant={product.stock > 20 ? 'success' : product.stock > 0 ? 'warning' : 'danger'} size="sm">
              {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
            </Badge>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Variants:</p>
              <div className="flex flex-wrap gap-1">
                {product.variants.slice(0, 3).map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 1 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Colors:</p>
              <div className="flex space-x-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {product.freeShipping && (
            <div className="flex items-center space-x-1">
              <Truck className="w-3 h-3" />
              <span>Free delivery</span>
            </div>
          )}
          {product.fastDelivery && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Same day</span>
            </div>
          )}
          {product.returnable && (
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>7 days return</span>
            </div>
          )}
        </div>
        
        {showActions && (
          <Button 
            onClick={() => onAddToCart?.(product)} 
            className="w-full"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const CustomerViews = ({ 
  currentView, 
  setCurrentView, 
  products, 
  searchTerm, 
  setSearchTerm,
  cart, 
  setCart, 
  wishlist, 
  setWishlist, 
  orders, 
  setOrders,
  auth,
  onLogout 
}) => {
  // Add this with your other useState declarations in CustomerViews
const [selectedOrderId, setSelectedOrderId] = useState(null);
  // Add this component inside CustomerViews, after ProductDetailView
const OrderDetailView = () => {
  const order = orders.find(o => o.id === selectedOrderId);
  
  if (!order) return null;

  // Order status progression
  const orderSteps = [
    { 
      id: 1, 
      title: 'Order Placed', 
      description: 'We have received your order',
      icon: Package,
      completed: true,
      date: order.date,
      time: '10:30 AM'
    },
    { 
      id: 2, 
      title: 'Order Confirmed', 
      description: 'Your order has been confirmed',
      icon: Shield,
      completed: true,
      date: order.date,
      time: '10:45 AM'
    },
    { 
      id: 3, 
      title: 'Processing', 
      description: 'We are preparing your items',
      icon: Clock,
      completed: order.status !== 'Processing',
      current: order.status === 'Processing',
      date: order.date,
      time: '2:15 PM'
    },
    { 
      id: 4, 
      title: 'Dispatched', 
      description: 'Your order is on the way',
      icon: Truck,
      completed: order.status === 'Shipped' || order.status === 'Delivered',
      current: order.status === 'Shipped',
      date: order.status === 'Shipped' || order.status === 'Delivered' ? order.date : null,
      time: '4:20 PM'
    },
    { 
      id: 5, 
      title: 'Out for Delivery', 
      description: 'Your order is out for delivery',
      icon: MapPin,
      completed: order.status === 'Delivered',
      current: order.status === 'Out for Delivery',
      date: order.status === 'Delivered' ? order.date : null,
      time: order.status === 'Delivered' ? '11:30 AM' : null
    },
    { 
      id: 6, 
      title: 'Delivered', 
      description: 'Your order has been delivered',
      icon: Award,
      completed: order.status === 'Delivered',
      current: false,
      date: order.status === 'Delivered' ? order.date : null,
      time: order.status === 'Delivered' ? '2:45 PM' : null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSelectedOrderId(null)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order {order.id} • Placed on {order.date}</p>
        </div>
        <Badge variant={
          order.status === 'Delivered' ? 'success' : 
          order.status === 'Processing' ? 'warning' : 
          order.status === 'Shipped' ? 'info' : 'default'
        } size="lg">
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Tracking */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                Track Your Order
              </h3>
              
              {/* Progress Timeline */}
              <div className="relative">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === orderSteps.length - 1;
                  
                  return (
                    <div key={step.id} className="relative flex items-start space-x-4 pb-8">
                      {/* Connecting Line */}
                      {!isLast && (
                        <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                          step.completed ? 'bg-green-500' : 
                          step.current ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                      )}
                      
                      {/* Step Icon */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                        step.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : step.current 
                            ? 'bg-blue-500 border-blue-500 text-white animate-pulse' 
                            : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-lg font-semibold ${
                            step.completed ? 'text-green-700' : 
                            step.current ? 'text-blue-700' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </h4>
                          {step.date && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">{step.date}</p>
                              {step.time && (
                                <p className="text-xs text-gray-500">{step.time}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          step.completed || step.current ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                        
                        {/* Current Step Animation */}
                        {step.current && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <span className="text-sm font-medium text-blue-800">
                                Currently in progress...
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tracking Number */}
              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                      <p className="text-lg font-mono text-gray-900">{order.trackingNumber}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              )}

              {/* Estimated Delivery */}
              {order.status !== 'Delivered' && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Estimated Delivery</p>
                      <p className="text-sm text-blue-600">
                        {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()} by 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.products?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.quantity || 1}</span>
                        <span className="font-semibold text-gray-900">${item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress?.name || auth.user.name}</p>
                <p className="text-gray-600">
                  {order.shippingAddress?.address || '123 Main Street'}<br />
                  {order.shippingAddress?.city || 'New York'}, {order.shippingAddress?.state || 'NY'} {order.shippingAddress?.zipCode || '10001'}<br />
                  {order.shippingAddress?.country || 'USA'}
                </p>
                <p className="text-sm text-gray-500">
                  Phone: {order.shippingAddress?.phone || '+1 (555) 123-4567'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod || 'Credit Card'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <Badge variant="success" size="sm">{order.paymentStatus || 'Paid'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-green-600">${order.total?.toFixed(2)}</span>
                </div>
                {order.appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Applied</span>
                    <span className="font-medium">{order.appliedCoupon}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {order.status !== 'Delivered' && (
                  <Button variant="outline" className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                {order.status === 'Delivered' && (
                  <Button className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Reorder Items
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
  const [selectedProductId, setSelectedProductId] = useState(null);
  const ProductDetailView = () => {
  const product = products.find(p => p.id === selectedProductId);
  
  if (!product) return null;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSelectedProductId(null)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">{product.brand} • {product.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            {product.discount > 0 && (
              <Badge variant="danger" className="absolute top-4 left-4" size="lg">
                -{product.discount}% OFF
              </Badge>
            )}
          </div>
          
          {/* Additional images if available */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 2}`}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Price and Rating */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-lg font-medium ml-2">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            <Badge variant={product.stock > 20 ? 'success' : product.stock > 0 ? 'warning' : 'danger'} size="lg">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </Badge>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Choose Variant</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <p className="font-medium">{variant.name}</p>
                    <p className="text-blue-600 font-bold">${variant.price}</p>
                    <p className="text-sm text-gray-500">{variant.stock} available</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Available Colors</h3>
              <div className="flex space-x-3">
                {product.colors.map((color, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 cursor-pointer transition-colors mb-1"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                    <span className="text-xs text-gray-600">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
            <div className="space-y-2">
              {product.freeShipping && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping available</span>
                </div>
              )}
              {product.fastDelivery && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>Same-day delivery available</span>
                </div>
              )}
              {product.returnable && (
                <div className="flex items-center space-x-2 text-purple-600">
                  <Shield className="w-4 h-4" />
                  <span>7-day return policy</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>{product.warranty} warranty</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={() => setCart(prev => [...prev, product])}
              disabled={product.stock === 0}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!wishlist.some(item => item.id === product.id)) {
                  setWishlist(prev => [...prev, product]);
                }
              }}
              size="lg"
              className="px-6"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-6">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onAddToCart={(product) => setCart(prev => [...prev, product])}
                onAddToWishlist={(product) => {
                  if (!wishlist.some(item => item.id === product.id)) {
                    setWishlist(prev => [...prev, product]);
                  }
                }}
                onViewDetails={setSelectedProductId}
                viewMode="grid"
              />
            ))}
        </div>
      </div>
    </div>
  );
};
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: [0, 5000],
    rating: 0,
    freeShipping: false,
    fastDelivery: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  
  const categories = categoriesAPI.getAll();

  // Customer Products View with Enhanced Features
  const CustomerProductsView = () => {
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesRating = product.rating >= filters.rating;
      const matchesFreeShipping = !filters.freeShipping || product.freeShipping;
      const matchesFastDelivery = !filters.fastDelivery || product.fastDelivery;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && 
             matchesRating && matchesFreeShipping && matchesFastDelivery;
    });

    return (
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Find the perfect tech products that match your lifestyle and needs
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Top Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              <button
                onClick={() => setFilters({...filters, category: ''})}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !filters.category 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.filter(c => c.parentId === null).map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilters({...filters, category: category.name})}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filters.category === category.name
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-200"
                >
                  <option value="relevance">Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                  <option value="discount">Biggest Discount</option>
                </select>

                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Quick filters:</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.freeShipping}
                  onChange={(e) => setFilters({...filters, freeShipping: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Free Shipping</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.fastDelivery}
                  onChange={(e) => setFilters({...filters, fastDelivery: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Fast Delivery</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} results
            {filters.category && ` in ${filters.category}`}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Truck className="w-4 h-4" />
            <span>{filteredProducts.filter(p => p.freeShipping).length} with free shipping</span>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => setCart(prev => [...prev, product])}
                onAddToWishlist={(product) => {
                  if (!wishlist.some(item => item.id === product.id)) {
                    setWishlist(prev => [...prev, product]);
                  }
                }}
                onViewDetails={setSelectedProductId}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => setCart(prev => [...prev, product])}
                onAddToWishlist={(product) => {
                  if (!wishlist.some(item => item.id === product.id)) {
                    setWishlist(prev => [...prev, product]);
                  }
                }}
                onViewDetails={setSelectedProductId}
                viewMode="list"
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilters({
                  category: '',
                  brand: '',
                  priceRange: [0, 5000],
                  rating: 0,
                  freeShipping: false,
                  fastDelivery: false
                });
              }}>
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Enhanced Cart View with Coupons and Advanced Features
  const CustomerCartView = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = cart.length > 0 && !cart.some(item => item.freeShipping) ? 9.99 : 0;
    let discount = 0;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = Math.min((subtotal * appliedCoupon.value) / 100, appliedCoupon.maxDiscount || Infinity);
      } else {
        discount = appliedCoupon.value;
      }
    }
    
    const tax = (subtotal - discount + shipping) * 0.1;
    const total = subtotal - discount + shipping + tax;

    const handleQuantityChange = (index, newQuantity) => {
      if (newQuantity === 0) {
        setCart(prev => prev.filter((_, i) => i !== index));
      } else {
        setCart(prev => prev.map((item, i) => 
          i === index ? { ...item, quantity: newQuantity } : item
        ));
      }
    };

    const applyCoupon = () => {
      const result = couponsAPI.validate(couponCode, subtotal);
      if (result.valid) {
        setAppliedCoupon(result.coupon);
        setCouponCode('');
      } else {
        alert(result.message);
      }
    };

    const handleCheckout = () => {
      if (!cart.length) return alert("Cart is empty");
      
      const newOrder = {
        id: Math.floor(Math.random() * 10000),
        date: new Date().toISOString().split('T')[0],
        total: total,
        status: 'Processing',
        products: cart.map(item => ({
          ...item,
          quantity: item.quantity || 1
        })),
        customerEmail: auth.user.email,
        appliedCoupon: appliedCoupon?.code
      };

      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setAppliedCoupon(null);
      alert("🎉 Order placed successfully! Thank you for your purchase.");
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('customer-products')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>
          <Badge variant="info" size="lg">
            {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
          </Badge>
        </div>

        {cart.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some amazing products to get started!</p>
              <Button onClick={() => setCurrentView('customer-products')}>
                <Plus className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Items in your cart</h3>
                  <div className="space-y-4">
                    {cart.map((product, index) => (
                      <div key={`${product.id}-${index}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.brand} • {product.category}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold text-blue-600">${product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                            )}
                            {product.freeShipping && (
                              <Badge variant="success" size="sm">Free Shipping</Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(index, (product.quantity || 1) - 1)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{product.quantity || 1}</span>
                          <button
                            onClick={() => handleQuantityChange(index, (product.quantity || 1) + 1)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => setCart(prev => prev.filter((_, i) => i !== index))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Products */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">You might also like</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.filter(p => !cart.some(c => c.id === p.id)).slice(0, 3).map(product => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-3">
                        <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded-md mb-2" />
                        <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                        <p className="text-blue-600 font-bold text-sm">${product.price}</p>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => setCart(prev => [...prev, product])}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Coupon Code */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Percent className="w-5 h-5 mr-2 text-green-600" />
                    Coupon Code
                  </h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                        <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                  )}
                  
                  {/* Available Coupons */}
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Available offers:</p>
                    {couponsAPI.getAll().filter(c => c.status === 'active').slice(0, 2).map(coupon => (
                      <div key={coupon.id} className="p-2 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{coupon.code}</p>
                            <p className="text-xs text-gray-600">{coupon.description}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCouponCode(coupon.code);
                              applyCoupon();
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleCheckout} className="w-full mt-6" size="lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  {/* Security & Trust Badges */}
                  <div className="flex items-center justify-center space-x-4 mt-6 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-4 h-4" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>Quality Assured</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Orders View with Tracking
  const CustomerOrdersView = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Orders
        </h1>
        <Badge variant="info" size="lg">
          {orders.length} orders
        </Badge>
      </div>
      
      {orders.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Your order history will appear here</p>
            <Button onClick={() => setCurrentView('customer-products')}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Order {order.id}</h3>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      order.status === 'Delivered' ? 'success' : 
                      order.status === 'Processing' ? 'warning' : 
                      order.status === 'Shipped' ? 'info' : 'default'
                    }>
                      {order.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">${order.total?.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Order Items */}
                {order.products && order.products.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {order.products.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <img
                          src={item.image || 'https://via.placeholder.com/40'}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="text-sm font-medium">${item.price}</p>
                      </div>
                    ))}
                    {order.products.length > 2 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{order.products.length - 2} more items
                      </p>
                    )}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Order Progress</span>
                    <span>{
                      order.status === 'Processing' ? '25%' :
                      order.status === 'Shipped' ? '75%' :
                      order.status === 'Delivered' ? '100%' : '10%'
                    }</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        order.status === 'Delivered' ? 'bg-green-500 w-full' : 
                        order.status === 'Shipped' ? 'bg-blue-500 w-3/4' :
                        order.status === 'Processing' ? 'bg-yellow-500 w-1/4' : 'bg-gray-400 w-1/12'
                      }`} 
                    />
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {order.trackingNumber && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Track: {order.trackingNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{order.products?.length || 0} items</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {/* // In CustomerOrdersView, find the "View Details" button and update it */}
<Button 
  variant="outline" 
  size="sm"
  onClick={() => setSelectedOrderId(order.id)}
>
  View Details
</Button>
                    {order.status === 'Delivered' && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Enhanced Wishlist View
  const CustomerWishlistView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Wishlist
        </h1>
        <Badge variant="info" size="lg">
          <Heart className="w-4 h-4 mr-1" />
          {wishlist.length} items
        </Badge>
      </div>
      
      {wishlist.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save your favorite products here for later</p>
            <Button onClick={() => setCurrentView('customer-products')}>
              <Plus className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Items you've saved for later</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  wishlist.forEach(product => setCart(prev => [...prev, product]));
                  setWishlist([]);
                }}
              >
                Add All to Cart
              </Button>
              <Button variant="outline" onClick={() => setWishlist([])}>
                Clear Wishlist
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product) => {
                  setCart(prev => [...prev, product]);
                  setWishlist(prev => prev.filter(item => item.id !== product.id));
                }}
                onAddToWishlist={(product) => {
                  setWishlist(prev => prev.filter(item => item.id !== product.id));
                }}
                onViewDetails={setSelectedProductId}
                showActions={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  // Enhanced Profile View
  const CustomerProfileView = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {auth.user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{auth.user.name}</h2>
                <p className="text-gray-600">{auth.user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="success">Verified Account</Badge>
                  <Badge variant="premium">Premium Member</Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={auth.user.name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={auth.user.email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="Add phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button>Update Profile</Button>
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Quick Actions */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{wishlist.length}</p>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-3" />
                  Track Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-3" />
                  Manage Addresses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-3" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="w-4 h-4 mr-3" />
                  Gift Cards
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card>
            <CardContent className="p-6">
              <Button 
                variant="danger" 
                onClick={onLogout}
                className="w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  if (selectedOrderId) {
  return <OrderDetailView />;
}
  if (selectedProductId) {
  return <ProductDetailView />;
}

  // Render based on current view
  switch (currentView) {
    case 'customer-products':
      return <CustomerProductsView />;
    case 'customer-cart':
      return <CustomerCartView />;
    case 'customer-orders':
      return <CustomerOrdersView />;
    case 'customer-wishlist':
      return <CustomerWishlistView />;
    case 'customer-profile':
      return <CustomerProfileView />;
    default:
      return <CustomerProductsView />;
  }
};

export default CustomerViews;