// API Configuration
const isDevelopment = true; // Use local development server
const PRODUCTION_URL = 'https://lpbackend-w3g7.onrender.com';
const LOCAL_URL = 'http://192.168.1.6:5000'; // Replace with your local IP

export const API_CONFIG = {
  BASE_URL: isDevelopment ? LOCAL_URL : PRODUCTION_URL,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REGISTER_VERIFIED: '/api/auth/register-verified',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
  },
  VERIFICATION: {
    SEND: '/api/verification/send',
    VERIFY: '/api/verification/verify',
    RESEND: '/api/verification/resend',
    METHOD: '/api/verification/method',
  },
  USERS: {
    ME: '/api/users/me',
    LOCATION: '/api/users/me/location',
    AVAILABILITY: '/api/users/me/availability',
    DONATIONS: '/api/users/me/donations',
    ELIGIBILITY: (userId) => `/api/users/${userId}/eligibility`,
    LEADERBOARD: '/api/users/leaderboard',
  },
  REQUESTS: {
    LIST: '/api/requests',
    CREATE: '/api/requests',
    ACCEPT: (id) => `/api/requests/${id}/accept`,
  },
  NOTIFICATIONS: {
    PUSH: '/api/notifications/push',
  },
  BLOOD_CAMPS: {
    LIST: '/api/blood-camps',
    DETAIL: (id) => `/api/blood-camps/${id}`,
  },
}; 