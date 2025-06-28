import React from 'react';

// Loading Spinner Component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gradient-to-r from-blue-500 to-purple-600 border-t-transparent"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
    </div>
  </div>
);

// Badge Component
export const Badge = ({ children, variant = 'default', className = '', size = 'md' }) => {
  const variants = {
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
    premium: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium shadow-sm ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// Button Component
export const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, loading = false, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 border border-gray-300 shadow-sm hover:shadow-md',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
    ghost: 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 border border-transparent hover:border-gray-200',
    outline: 'border-2 border-gray-300 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-700 transition-all duration-200',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
      )}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${hover ? 'hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

// Card Header Component
export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl ${className}`}>
    {children}
  </div>
);

// Card Content Component
export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);