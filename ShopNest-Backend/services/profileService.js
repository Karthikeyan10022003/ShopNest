// src/services/profileService.js - Updated with localStorage persistence

const API_BASE = '/api/profile';

// Helper functions for localStorage
const getStoredProfile = (userId) => {
  try {
    const stored = localStorage.getItem(`profile_${userId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading profile from localStorage:', error);
    return null;
  }
};

const storeProfile = (userId, profileData) => {
  try {
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
  } catch (error) {
    console.error('Error storing profile to localStorage:', error);
  }
};

const getStoredStats = (userId) => {
  try {
    const stored = localStorage.getItem(`stats_${userId}`);
    return stored ? JSON.parse(stored) : {
      totalOrders: 0,
      totalSpent: 0,
      wishlistItems: 0
    };
  } catch (error) {
    console.error('Error reading stats from localStorage:', error);
    return { totalOrders: 0, totalSpent: 0, wishlistItems: 0 };
  }
};

const storeStats = (userId, statsData) => {
  try {
    localStorage.setItem(`stats_${userId}`, JSON.stringify(statsData));
  } catch (error) {
    console.error('Error storing stats to localStorage:', error);
  }
};

export const profileService = {
  // Get current user profile
  getProfile: async (token, user) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Try to get stored profile, fallback to user data
    const storedProfile = getStoredProfile(user.email);
    
    const profileData = storedProfile || {
      id: user.id || 1,
      name: user.name || 'Customer User',
      email: user.email || 'customer@example.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      avatar: null,
      bio: 'Love shopping for quality products and discovering new brands.',
      website: 'https://johncustomer.com',
      preferences: {
        language: 'en',
        timezone: 'America/New_York',
        currency: 'USD',
        notifications: {
          email: true,
          sms: false,
          push: true,
          marketing: true
        }
      }
    };

    return {
      message: 'Profile retrieved successfully',
      user: profileData
    };
  },

  // Update user profile
  updateProfile: async (token, user, profileData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Get existing profile
      const existingProfile = getStoredProfile(user.email) || user;
      
      // Merge with new data
      const updatedProfile = {
        ...existingProfile,
        ...profileData,
        // Handle nested objects properly
        address: {
          ...existingProfile.address,
          ...(profileData.address || {})
        },
        preferences: {
          ...existingProfile.preferences,
          ...(profileData.preferences || {}),
          notifications: {
            ...existingProfile.preferences?.notifications,
            ...(profileData.preferences?.notifications || {})
          }
        }
      };

      // Store to localStorage
      storeProfile(user.email, updatedProfile);

      console.log('✅ Profile updated and stored:', updatedProfile);

      return {
        message: 'Profile updated successfully',
        user: updatedProfile
      };
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw new Error('Failed to update profile');
    }
  },

  // Change password
  changePassword: async (token, passwordData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Simulate password validation
      if (passwordData.currentPassword === 'wrongpassword') {
        throw new Error('Current password is incorrect');
      }

      console.log('✅ Password changed successfully');

      return {
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('❌ Password change failed:', error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (token, user, avatarData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      // Get existing profile
      const existingProfile = getStoredProfile(user.email) || user;
      
      // Update with new avatar
      const updatedProfile = {
        ...existingProfile,
        avatar: avatarData
      };

      // Store to localStorage
      storeProfile(user.email, updatedProfile);

      console.log('✅ Avatar uploaded and stored');

      return {
        message: 'Avatar uploaded successfully',
        avatar: avatarData
      };
    } catch (error) {
      console.error('❌ Avatar upload failed:', error);
      throw new Error('Failed to upload avatar');
    }
  },

  // Get user stats
  getUserStats: async (token, user) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      const stats = getStoredStats(user.email);
      
      return {
        message: 'User stats retrieved successfully',
        stats
      };
    } catch (error) {
      console.error('❌ Failed to get user stats:', error);
      throw new Error('Failed to fetch user stats');
    }
  },

  // Update user stats (for when orders are placed, etc.)
  updateUserStats: async (token, user, newStats) => {
    try {
      const existingStats = getStoredStats(user.email);
      const updatedStats = { ...existingStats, ...newStats };
      
      storeStats(user.email, updatedStats);
      
      return {
        message: 'Stats updated successfully',
        stats: updatedStats
      };
    } catch (error) {
      console.error('❌ Failed to update user stats:', error);
      throw new Error('Failed to update stats');
    }
  },

  // Clear stored data (for testing)
  clearStoredData: (userEmail) => {
    try {
      localStorage.removeItem(`profile_${userEmail}`);
      localStorage.removeItem(`stats_${userEmail}`);
      console.log('✅ Stored data cleared for user:', userEmail);
    } catch (error) {
      console.error('❌ Failed to clear stored data:', error);
    }
  }
};