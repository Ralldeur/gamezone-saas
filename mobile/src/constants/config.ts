// API Base URL - change this to your deployed backend URL
// For local development: http://YOUR_IP:3000
// For production: https://your-app.vercel.app
export const API_BASE_URL = "http://localhost:3000";

// Payment API Configuration (placeholders for future integration)
export const PAYMENT_CONFIG = {
  WAVE: {
    enabled: false,
    apiKey: "",
    merchantId: "",
    baseUrl: "https://api.wave.com/v1",
  },
  ORANGE_MONEY: {
    enabled: false,
    clientId: "",
    clientSecret: "",
    baseUrl: "https://api.orange.com/orange-money-webpay/dev/v1",
  },
  MTN_MONEY: {
    enabled: false,
    subscriptionKey: "",
    apiKey: "",
    baseUrl: "https://sandbox.momodeveloper.mtn.com",
  },
};
