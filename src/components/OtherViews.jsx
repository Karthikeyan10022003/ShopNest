import React from 'react';
import { Card, CardContent, CardHeader } from './ui';
import { Users, Package, BarChart3, Mail, Settings as SettingsIcon } from 'lucide-react';

// Orders Component
export const Orders = () => (
  <div className="space-y-6">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Order Management
    </h1>
    <p className="text-gray-600">Track and manage all your orders efficiently</p>
    <Card className="text-center py-16">
      <CardContent>
        <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Module</h3>
        <p className="text-gray-600">Order management interface would be implemented here</p>
      </CardContent>
    </Card>
  </div>
);

// Customers Component
export const Customers = ({ customers }) => (
  <div className="space-y-6">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Customer Management
    </h1>
    <p className="text-gray-600">View and manage your customer base</p>
    {customers?.length === 0 ? (
      <Card className="text-center py-16">
        <CardContent>
          <Users className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers yet</h3>
          <p className="text-gray-600">Customer data will appear here once users register</p>
        </CardContent>
      </Card>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.email}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

// Analytics Component
export const Analytics = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Analytics & Insights
      </h1>
      <p className="text-gray-600 mt-2">Deep dive into your store's performance metrics</p>
    </div>
    
    <Card className="text-center py-16">
      <CardContent>
        <BarChart3 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-600">Advanced analytics and reporting features would be implemented here</p>
      </CardContent>
    </Card>
  </div>
);

// Marketing Component
export const Marketing = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Marketing Hub
      </h1>
      <p className="text-gray-600 mt-2">Grow your business with powerful marketing tools</p>
    </div>
    
    <Card className="text-center py-16">
      <CardContent>
        <Mail className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketing Center</h3>
        <p className="text-gray-600">Email campaigns, social media management, and marketing automation would be implemented here</p>
      </CardContent>
    </Card>
  </div>
);

// Settings Component
export const Settings = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Settings & Configuration
      </h1>
      <p className="text-gray-600 mt-2">Customize your store preferences and settings</p>
    </div>
    
    <Card className="text-center py-16">
      <CardContent>
        <SettingsIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings Panel</h3>
        <p className="text-gray-600">Store settings, theme customization, payment configuration, and user preferences would be implemented here</p>
      </CardContent>
    </Card>
  </div>
);