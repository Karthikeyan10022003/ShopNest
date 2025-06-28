import React, { useState } from 'react';
import { ShoppingCart, Mail, User, Star, Shield, Zap, Award, ChevronRight } from 'lucide-react';
import { Button } from './ui';

const Auth = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');

  const handleLogin = () => {
    onLogin(email, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">TechStore Pro</h2>
              <p className="text-blue-200 text-lg">Premium E-commerce Platform</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
              </div>
              <select
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15 appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin" className="bg-gray-800 text-white">Store Administrator</option>
                <option value="customer" className="bg-gray-800 text-white">Customer Account</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <Button
              onClick={handleLogin}
              loading={isLoading}
              className="w-full py-4 text-lg font-semibold rounded-2xl"
              size="lg"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span className="text-sm">Trusted</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Experience the future of e-commerce management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;