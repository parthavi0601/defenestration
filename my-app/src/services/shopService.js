// src/services/shopService.js
import apiService from './apiService';
import authService from './authService';

class ShopService {
  async createShop(shopData) {
    try {
      const token = await authService.getOwnerToken();
      const response = await apiService.createShop(shopData, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getMyShops() {
    try {
      const token = await authService.getOwnerToken();
      const response = await apiService.getMyShops(token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getShopDetails(shopId) {
    try {
      const token = await authService.getOwnerToken();
      const response = await apiService.getShopDetails(shopId, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async addStaff(shopId, staffData) {
    try {
      const token = await authService.getOwnerToken();
      const response = await apiService.addStaff(shopId, staffData, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createRole(shopId, roleData) {
    try {
      const token = await authService.getOwnerToken();
      const response = await apiService.createRole(shopId, roleData, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ShopService();
