// src/services/offlineAuthService.js - OFFLINE AUTHENTICATION

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DUMMY_OWNER, DUMMY_STAFF } from '../data/dummyData';

class OfflineAuthService {
  
  // Owner Authentication
  async ownerLogin(username, password) {
    try {
      console.log(`🔐 Offline owner login attempt: ${username}`);
      
      // Check dummy credentials
      if (username === DUMMY_OWNER.username && password === DUMMY_OWNER.password) {
        
        // Store owner data
        const ownerData = {
          owner_id: DUMMY_OWNER.id,
          username: DUMMY_OWNER.username,
          first_name: DUMMY_OWNER.first_name,
          last_name: DUMMY_OWNER.last_name,
          email: DUMMY_OWNER.email,
          login_time: new Date().toISOString(),
          access_token: 'dummy_owner_token_' + Date.now()
        };
        
        await AsyncStorage.setItem('ownerToken', ownerData.access_token);
        await AsyncStorage.setItem('ownerData', JSON.stringify(ownerData));
        
        console.log('✅ Offline owner login successful');
        return { 
          success: true, 
          data: {
            access_token: ownerData.access_token,
            owner_id: ownerData.owner_id,
            username: ownerData.username,
            expires_in: 86400
          }
        };
      } else {
        console.log('❌ Invalid offline credentials');
        return { 
          success: false, 
          error: 'Invalid username or password' 
        };
      }
    } catch (error) {
      console.error('❌ Offline owner login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Staff Authentication with OTP simulation
  async staffLogin(phone, otp) {
    try {
      console.log(`👥 Offline staff login attempt: ${phone}`);
      
      // Find staff by phone
      const staff = DUMMY_STAFF.find(s => s.phone === phone);
      
      if (!staff) {
        return { 
          success: false, 
          error: 'Staff member not found with this phone number' 
        };
      }
      
      // Simple OTP validation (any 6-digit number works in demo)
      if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        return { 
          success: false, 
          error: 'Invalid OTP format. Please enter 6 digits.' 
        };
      }
      
      // Store staff data
      const staffData = {
        staff_id: staff.id,
        phone: staff.phone,
        name: `${staff.first_name} ${staff.last_name}`,
        role_id: staff.role_id,
        shop_id: staff.shop_id,
        login_time: new Date().toISOString(),
        access_token: 'dummy_staff_token_' + Date.now()
      };
      
      await AsyncStorage.setItem('staffToken', staffData.access_token);
      await AsyncStorage.setItem('staffData', JSON.stringify(staffData));
      
      console.log('✅ Offline staff login successful');
      return { 
        success: true, 
        data: {
          access_token: staffData.access_token,
          staff_id: staffData.staff_id,
          phone: staffData.phone,
          name: staffData.name,
          role: staffData.role_id
        }
      };
      
    } catch (error) {
      console.error('❌ Offline staff login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP simulation
  async sendOTP(phone) {
    try {
      console.log(`📱 Sending dummy OTP to: ${phone}`);
      
      // Check if staff exists
      const staff = DUMMY_STAFF.find(s => s.phone === phone);
      
      if (!staff) {
        return { 
          success: false, 
          error: 'Staff member not found with this phone number' 
        };
      }
      
      // Simulate OTP sending
      setTimeout(() => {
        console.log(`📱 Demo OTP for ${phone}: 123456`);
      }, 1000);
      
      return { 
        success: true, 
        data: { 
          message: 'OTP sent successfully (Demo: use 123456)',
          phone: phone,
          expires_in: 300
        }
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Token management
  async getOwnerToken() {
    return await AsyncStorage.getItem('ownerToken');
  }

  async getStaffToken() {
    return await AsyncStorage.getItem('staffToken');
  }

  async getOwnerData() {
    const data = await AsyncStorage.getItem('ownerData');
    return data ? JSON.parse(data) : null;
  }

  async getStaffData() {
    const data = await AsyncStorage.getItem('staffData');
    return data ? JSON.parse(data) : null;
  }

  async logout() {
    await AsyncStorage.multiRemove(['ownerToken', 'staffToken', 'ownerData', 'staffData']);
  }
}

export default new OfflineAuthService();
