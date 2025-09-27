// src/config/api.js
import AsyncStorage from '@react-native-async-storage/async-storage'

// API Configuration
const API_CONFIG = {
  // Use your computer's IP address for local development
  // You can find it by running `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  BASE_URL: __DEV__ 
    ? 'http://192.168.137.154:8000'  // Replace with your computer's IP
    : 'https://your-production-api.com',
  
  TIMEOUT: 10000, // 10 seconds
  
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/v1/token',
    REGISTER_OWNER: '/api/v1/owners/',  // You'll need to add this endpoint
    STAFF_LOGIN: '/api/v1/staff/login',
    
    // Shops
    SHOPS: '/api/v1/shops',
    SHOP_ROLES: (shopId) => `/api/v1/shops/${shopId}/roles`,
    
    // Staff
    SHOP_STAFF: (shopId) => `/api/v1/shops/${shopId}/staff`,
    SPECIFIC_STAFF: (shopId, staffId) => `/api/v1/shops/${shopId}/staff/${staffId}`,
    
    // Schedules
    GENERATE_SCHEDULE: '/api/v1/schedules/generate',
    PUBLISH_SCHEDULE: (scheduleId) => `/api/v1/schedules/${scheduleId}/publish`,
    SCHEDULE_SHIFTS: (scheduleId) => `/api/v1/schedules/${scheduleId}/shifts`,
    
    // Explanations
    SHIFT_EXPLAIN: (shiftId) => `/api/v1/shifts/${shiftId}/explain`,
    
    // Health
    HEALTH: '/health',
    API_INFO: '/api/v1/info'
  }
}

export default API_CONFIG
