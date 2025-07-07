// main.jsx - Entry point for React app (only needed if running as standalone app)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your Tailwind CSS styles
import { TenantProvider } from './context/TenantContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TenantProvider><App/></TenantProvider>
    {/* <App /> */}
  </React.StrictMode>
);