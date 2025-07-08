import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Bell, Lock, Sparkles, ChevronRight } from 'lucide-react';
import { navigation, customerNavigation } from '../utils/constants';
import { Badge } from './ui';

const Layout = ({ auth, onLogout, currentView, setCurrentView, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const activeNavigation = auth.role === 'customer' ? customerNavigation : navigation;

  // Mobile sidebar
  const MobileSidebar = () => (
    sidebarOpen && (
      <div className="fixed inset-0 flex z-40 lg:hidden">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-white/20 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechStore Pro
              </span>
            </div>
            <nav className="px-2 space-y-2">
              {activeNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-xl w-full text-left transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-4 flex-shrink-0 h-6 w-6 ${
                      currentView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    )
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white/80 lg:backdrop-blur-xl">
      <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <ShoppingCart className="h-7 w-7 text-white" />
          </div>
          <div className="ml-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechStore Pro
            </span>
            <p className="text-sm text-gray-500">Premium E-commerce</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-2">
          {activeNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                  currentView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {item.name}
              </button>
            );
          })}
        </nav>
        
        {/* User Profile Section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 w-full">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Karthik</p>
              <p className="text-xs text-gray-500 truncate">karthik@gmail.com</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Sign Out"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile header
  const MobileHeader = () => (
    <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </span>
          </div>
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            K
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop header
  const DesktopHeader = () => (
    <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200 lg:block hidden sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent capitalize">
              {currentView.replace('-', ' ')}
            </h2>
            <Badge variant="premium" size="sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer transition-colors duration-200" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                K
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Karthik</p>
                <p className="text-xs text-gray-500">karthik@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <MobileSidebar />
      <DesktopSidebar />
      
      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <MobileHeader />
        <DesktopHeader />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;