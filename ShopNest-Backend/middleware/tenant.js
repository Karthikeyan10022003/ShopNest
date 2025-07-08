// middleware/tenant.js
const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  try {
    let tenantId = null;

    // Try to get tenant ID from header first
    if (req.headers['x-tenant-id']) {
      tenantId = req.headers['x-tenant-id'];
    }
    // If authenticated user, get tenant from user
    else if (req.user && req.user.tenant_id) {
      tenantId = req.user.tenant_id;
    }
    // Try to resolve from hostname
    else {
      const hostname = req.get('host') || req.hostname;
      const tenant = await resolveTenantFromHostname(hostname);
      if (tenant) {
        tenantId = tenant._id;
      }
    }

    if (!tenantId) {
      return res.status(400).json({ 
        error: 'Tenant required',
        message: 'No tenant context found' 
      });
    }

    // Get tenant and validate
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ 
        error: 'Tenant not found',
        message: 'Invalid tenant ID' 
      });
    }

    // Check if tenant is active and can access
    if (!tenant.canAccess()) {
      return res.status(403).json({ 
        error: 'Tenant access denied',
        message: 'Tenant account is not active or subscription expired' 
      });
    }

    // Validate user belongs to tenant (if authenticated)
    if (req.user && req.user.role !== 'super_admin') {
      if (!req.user.tenant_id || !req.user.tenant_id.equals(tenant._id)) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'User does not belong to this tenant' 
        });
      }
    }

    // Add tenant to request
    req.tenant = tenant;
    req.tenantId = tenant._id;
    
    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to resolve tenant context' 
    });
  }
};

const resolveTenantFromHostname = async (hostname) => {
  try {
    // Handle localhost development
    if (hostname.includes('localhost')) {
      // Return a default tenant for development
      return await Tenant.findOne({ subdomain: 'techstore' });
    }

    // Try custom domain first
    let tenant = await Tenant.findByCustomDomain(hostname);
    if (tenant) return tenant;

    // Try subdomain
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www') {
      tenant = await Tenant.findBySubdomain(subdomain);
      if (tenant) return tenant;
    }

    return null;
  } catch (error) {
    console.error('Tenant resolution error:', error);
    return null;
  }
};

const checkTenantLimits = (resource) => {
  return async (req, res, next) => {
    try {
      if (!req.tenant) {
        return res.status(400).json({ 
          error: 'Tenant required',
          message: 'No tenant context found' 
        });
      }

      const isWithinLimits = req.tenant.isWithinLimits(resource);
      if (!isWithinLimits) {
        return res.status(403).json({ 
          error: 'Limit exceeded',
          message: `You have reached the maximum ${resource} limit for your plan`,
          current_usage: req.tenant.usage[`${resource}_count`],
          limit: req.tenant.limits[`max_${resource}`]
        });
      }

      next();
    } catch (error) {
      console.error('Tenant limits check error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to check tenant limits' 
      });
    }
  };
};

const optionalTenant = async (req, res, next) => {
  try {
    let tenantId = req.headers['x-tenant-id'] || req.user?.tenant_id;
    
    if (!tenantId) {
      const hostname = req.get('host') || req.hostname;
      const tenant = await resolveTenantFromHostname(hostname);
      if (tenant) {
        tenantId = tenant._id;
      }
    }

    if (tenantId) {
      const tenant = await Tenant.findById(tenantId);
      if (tenant && tenant.canAccess()) {
        req.tenant = tenant;
        req.tenantId = tenant._id;
      }
    }

    next();
  } catch (error) {
    // Continue without tenant context if resolution fails
    next();
  }
};

module.exports = {
  tenantMiddleware,
  checkTenantLimits,
  optionalTenant,
  resolveTenantFromHostname
};