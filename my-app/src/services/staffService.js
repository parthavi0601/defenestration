// src/services/staffService.js
import apiService from './apiService';

// Jane's working token for testing
const TEMP_OWNER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lc21pdGgiLCJleHAiOjE3NTg5MTI5NTV9.jSkxHuxzm7Xf50D4WANwMSF_IZSU1OerjVs8bedfOAc";

class StaffService {
  async sendOTP(shopId, phone) {
    try {
      console.log('📱 StaffService: Sending OTP...', { shopId, phone });
      
      const response = await apiService.sendOTP(shopId, phone, TEMP_OWNER_TOKEN);
      
      return { success: true, data: response };
    } catch (error) {
      console.error('📱 StaffService OTP error:', error.message);
      return { 
        success: false, 
        error: error.message || 'Failed to send OTP'
      };
    }
  }

  async login(shopId, phone, otp) {
    try {
      console.log('🔐 StaffService: Attempting login...', { shopId, phone, otp });
      
      const response = await apiService.staffLogin(shopId, phone, otp, TEMP_OWNER_TOKEN);
      
      return { success: true, data: response };
    } catch (error) {
      console.error('🔐 StaffService login error:', error.message);
      return { 
        success: false, 
        error: error.message || 'Login failed'
      };
    }
  }

  async getStaffProfile() {
    try {
      // This would get staff data from AsyncStorage in a real app
      // For now, return mock data
      return { 
        success: true, 
        data: { name: 'Test Staff', role: 'Cashier' } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export default new StaffService();
