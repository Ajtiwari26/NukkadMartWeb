// API Configuration
export const API_CONFIG = {
  // Local backend for testing
  // BASE_URL: 'http://localhost:8000',
  
  // Production backend
  BASE_URL: 'http://13.235.254.91:8000',
  
  API_VERSION: '/api/v1',
  
  // WebSocket URL
  // WS_BASE_URL: 'ws://localhost:8000/api/v1',
  WS_BASE_URL: 'ws://13.235.254.91:8000/api/v1',
  
  // Timeouts
  TIMEOUT: 30000,
  
  // Google Maps
  GOOGLE_MAPS_API_KEY: 'AIzaSyCsZ1wSI0CdaLU35oH4l4dhQrz7TjBSYTw',
  
  // Razorpay
  RAZORPAY_KEY_ID: 'rzp_live_IOk2tHMSQHhGzI',
  
  // Default Location (Bhopal)
  DEFAULT_LAT: 23.2599,
  DEFAULT_LNG: 77.4126,
}

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/users/login`,
  REGISTER: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/users/register`,
  QUICK_REGISTER: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/users/quick-register`,
  
  // Stores
  STORES_NEARBY: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/stores/nearby`,
  STORES_DEMO: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/stores/demo`,
  STORE_DETAILS: (id: string) => `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/stores/${id}`,
  
  // Products
  PRODUCTS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/inventory/products`,
  PRODUCT_SEARCH: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/inventory/search`,
  
  // Orders
  ORDERS: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/orders`,
  ORDER_DETAILS: (id: string) => `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/orders/${id}`,
  
  // OCR
  OCR_SCAN: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/ocr/scan`,
  
  // Voice Assistant
  VOICE_WS: (userId: string) => `${API_CONFIG.WS_BASE_URL}/ws/voice/customer/${userId}`,
}
