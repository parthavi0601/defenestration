// src/services/authService.js - ENHANCED VERSION
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';

class AuthService {
  constructor() {
    this.initializeService();
  }

  // Initialize service and check existing tokens
  async initializeService() {
    try {
      const token = await this.getOwnerToken();
      const ownerData = await this.getOwnerData();
      
      if (token && ownerData) {
        console.log('✅ Existing owner session found:', ownerData.username);
      } else {
        console.log('ℹ️  No existing owner session');
      }
    } catch (error) {
      console.error('❌ AuthService initialization error:', error);
    }
  }

  // 🧪 Test backend connection
  async testConnection() {
    try {
      return await apiService.testConnection();
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Owner Authentication
  async ownerLogin(username, password) {
    try {
      console.log(`🔐 Attempting owner login for: ${username}`);
      
      // Validate inputs
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
      }
      
      if (username.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      
      const response = await apiService.ownerLogin(username, password);
      
      if (response.access_token) {
        console.log('✅ Login successful, storing tokens...');
        
        // Store tokens and data
        await AsyncStorage.setItem('ownerToken', response.access_token);
        await AsyncStorage.setItem('ownerData', JSON.stringify({
          owner_id: response.owner_id,
          username: response.username,
          expires_in: response.expires_in,
          login_time: new Date().toISOString()
        }));
        
        console.log('✅ Owner data stored successfully');
        return { success: true, data: response };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('❌ Owner login error:', error);
      return { success: false, error: error.message };
    }
  }

  async ownerRegister(ownerData) {
    try {
      console.log('📝 Attempting owner registration...');
      
      // Enhanced validation
      const requiredFields = ['first_name', 'last_name', 'email', 'username', 'password', 'mobile_number'];
      const missingFields = requiredFields.filter(field => !ownerData[field] || !ownerData[field].toString().trim());
      
      if (missingFields.length > 0) {
        return { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        };
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ownerData.email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // Username validation
      if (ownerData.username.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters' };
      }
      
      // Password validation
      if (ownerData.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      
      // Mobile number validation
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(ownerData.mobile_number)) {
        return { success: false, error: 'Please enter a valid mobile number' };
      }
      
      const response = await apiService.ownerRegister(ownerData);
      
      console.log('✅ Owner registration successful');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Owner registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Staff Authentication
  async staffLogin(shopId, phone, otp, ownerToken) {
    try {
      console.log(`👥 Attempting staff login for phone: ${phone}`);
      
      // Validate inputs
      if (!shopId || !phone || !otp || !ownerToken) {
        return { success: false, error: 'All fields are required for staff login' };
      }
      
      if (otp.length !== 6) {
        return { success: false, error: 'OTP must be 6 digits' };
      }
      
      const response = await apiService.staffLogin(shopId, phone, otp, ownerToken);
      
      if (response.access_token) {
        console.log('✅ Staff login successful, storing tokens...');
        
        await AsyncStorage.setItem('staffToken', response.access_token);
        await AsyncStorage.setItem('staffData', JSON.stringify({
          staff_id: response.staff_id,
          phone: response.phone,
          name: response.name,
          role: response.role,
          shop_id: shopId,
          login_time: new Date().toISOString()
        }));
        
        console.log('✅ Staff data stored successfully');
        return { success: true, data: response };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('❌ Staff login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP for staff login
  async sendOTP(shopId, phone, ownerToken) {
    try {
      console.log(`📱 Sending OTP to: ${phone}`);
      
      if (!shopId || !phone || !ownerToken) {
        return { success: false, error: 'Shop ID, phone, and owner token are required' };
      }
      
      const response = await apiService.sendOTP(shopId, phone, ownerToken);
      
      console.log('✅ OTP sent successfully');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      return { success: false, error: error.message };
    }
  }

  // Token Management
  async getOwnerToken() {
    try {
      const token = await AsyncStorage.getItem('ownerToken');
      return token;
    } catch (error) {
      console.error('❌ Error getting owner token:', error);
      return null;
    }
  }

  async getStaffToken() {
    try {
      const token = await AsyncStorage.getItem('staffToken');
      return token;
    } catch (error) {
      console.error('❌ Error getting staff token:', error);
      return null;
    }
  }

  async getOwnerData() {
    try {
      const data = await AsyncStorage.getItem('ownerData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Error getting owner data:', error);
      return null;
    }
  }

  async getStaffData() {
    try {
      const data = await AsyncStorage.getItem('staffData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Error getting staff data:', error);
      return null;
    }
  }

  // Check if owner is logged in
  async isOwnerLoggedIn() {
    try {
      const token = await this.getOwnerToken();
      const ownerData = await this.getOwnerData();
      
      if (!token || !ownerData) {
        return false;
      }
      
      // Check if token is expired (basic check)
      const loginTime = new Date(ownerData.login_time);
      const now = new Date();
      const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
      
      // Assuming tokens expire after 24 hours
      if (hoursSinceLogin > 24) {
        console.log('⚠️  Owner token may be expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error checking owner login status:', error);
      return false;
    }
  }

  // Check if staff is logged in
  async isStaffLoggedIn() {
    try {
      const token = await this.getStaffToken();
      const staffData = await this.getStaffData();
      
      if (!token || !staffData) {
        return false;
      }
      
      // Check if token is expired (basic check)
      const loginTime = new Date(staffData.login_time);
      const now = new Date();
      const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
      
      // Assuming tokens expire after 8 hours for staff
      if (hoursSinceLogin > 8) {
        console.log('⚠️  Staff token may be expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error checking staff login status:', error);
      return false;
    }
  }

  // Logout functions
  async ownerLogout() {
    try {
      console.log('👋 Owner logout...');
      await AsyncStorage.multiRemove(['ownerToken', 'ownerData']);
      console.log('✅ Owner logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Owner logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async staffLogout() {
    try {
      console.log('👋 Staff logout...');
      await AsyncStorage.multiRemove(['staffToken', 'staffData']);
      console.log('✅ Staff logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Staff logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      console.log('👋 Complete logout...');
      await AsyncStorage.multiRemove(['ownerToken', 'staffToken', 'ownerData', 'staffData']);
      console.log('✅ Complete logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Complete logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear all stored data (for debugging)
  async clearAllData() {
    try {
      console.log('🗑️  Clearing all auth data...');
      await AsyncStorage.clear();
      console.log('✅ All auth data cleared');
      return { success: true };
    } catch (error) {
      console.error('❌ Clear data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const ownerLoggedIn = await this.isOwnerLoggedIn();
      const staffLoggedIn = await this.isStaffLoggedIn();
      
      if (ownerLoggedIn) {
        const ownerData = await this.getOwnerData();
        return { 
          type: 'owner', 
          data: ownerData,
          isLoggedIn: true
        };
      } else if (staffLoggedIn) {
        const staffData = await this.getStaffData();
        return { 
          type: 'staff', 
          data: staffData,
          isLoggedIn: true
        };
      } else {
        return { 
          type: null, 
          data: null,
          isLoggedIn: false
        };
      }
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return { 
        type: null, 
        data: null,
        isLoggedIn: false,
        error: error.message
      };
    }
  }
}

export default new AuthService();
