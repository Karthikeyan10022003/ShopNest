import React, { useState } from 'react';
import { ChevronDown, Building, Globe } from 'lucide-react';

const TenantSwitcher = ({ currentTenant, onTenantSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mockTenants] = useState([
    { id: '1', name: 'TechStore Pro', subdomain: 'techstore', plan: 'pro' },
    { id: '2', name: 'Fashion Hub', subdomain: 'fashionhub', plan: 'basic' },
    { id: '3', name: 'Home Goods', subdomain: 'homegoods', plan: 'enterprise' }
  ]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Building className="w-4 h-4" />
        <span>{currentTenant?.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {mockTenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => {
                  onTenantSwitch(tenant.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition-colors ${
                  currentTenant?.id === tenant.id ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <Globe className="w-4 h-4" />
                <div className="flex-1">
                  <p className="font-medium">{tenant.name}</p>
                  <p className="text-xs text-gray-500">{tenant.subdomain}.yourdomain.com</p>
                </div>
                <Badge variant={tenant.plan === 'enterprise' ? 'premium' : 'info'} size="sm">
                  {tenant.plan}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSwitcher;