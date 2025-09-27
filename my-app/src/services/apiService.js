// src/services/apiService.js
const BASE_URL = 'http://10.0.2.2:8002/api/v1';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Owner Authentication
  async ownerLogin(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=password&username=${username}&password=${password}`,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ownerLogin error:', error);
      throw error;
    }
  }

  async ownerRegister(ownerData) {
    try {
      const response = await fetch(`${this.baseURL}/owners/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ownerRegister error:', error);
      throw error;
    }
  }

  // Shop Management
  async createShop(shopData, token) {
    try {
      const response = await fetch(`${this.baseURL}/shops/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('createShop error:', error);
      throw error;
    }
  }

  async getMyShops(token) {
    try {
      const response = await fetch(`${this.baseURL}/shops/my-shops`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('getMyShops error:', error);
      throw error;
    }
  }

  async getShopDetails(shopId, token) {
    try {
      const response = await fetch(`${this.baseURL}/shops/${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('getShopDetails error:', error);
      throw error;
    }
  }

  // Staff Management
  async addStaff(shopId, staffData, token) {
    try {
      const response = await fetch(`${this.baseURL}/shops/${shopId}/staff/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(staffData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('addStaff error:', error);
      throw error;
    }
  }

  // Staff Authentication
  async sendOTP(shopId, phone, token) {
    try {
      console.log(`🚀 Sending OTP to ${phone} for shop ${shopId}`);
      console.log(`📡 URL: ${this.baseURL}/shops/${shopId}/staff/send-otp`);
      
      const response = await fetch(`${this.baseURL}/shops/${shopId}/staff/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
      });

      console.log(`📊 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OTP Error:', errorText);
        throw new Error(`Failed to send OTP: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ OTP Response:', data);
      return data;
      
    } catch (error) {
      console.error('❌ sendOTP error:', error);
      throw error;
    }
  }

  async staffLogin(shopId, phone, otp, token) {
    try {
      console.log(`🔐 Staff login for ${phone} with OTP ${otp}`);
      
      const response = await fetch(`${this.baseURL}/shops/${shopId}/staff/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, otp }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Login Error:', errorText);
        throw new Error(`Login failed: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Login successful:', data);
      return data;
      
    } catch (error) {
      console.error('❌ staffLogin error:', error);
      throw error;
    }
  }

  // Role Management
  async createRole(shopId, roleData, token) {
    try {
      const response = await fetch(`${this.baseURL}/shops/${shopId}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('createRole error:', error);
      throw error;
    }
  }
}

export default new ApiService();
