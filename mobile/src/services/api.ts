import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../constants/config";

let authToken: string | null = null;

export async function initAuth() {
  authToken = await SecureStore.getItemAsync("authToken");
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/mobile-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur de connexion" }));
    throw new Error(err.error || "Identifiants incorrects");
  }

  const data = await res.json();
  authToken = data.token;
  await SecureStore.setItemAsync("authToken", data.token);
  return data.user;
}

export async function logout() {
  authToken = null;
  await SecureStore.deleteItemAsync("authToken");
}

async function apiRequest<T>(
  endpoint: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options?.method || "GET",
    headers: getHeaders(),
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur serveur" }));
    throw new Error(err.error || `Erreur ${res.status}`);
  }

  return res.json();
}

// Dashboard
export const getDashboard = () => apiRequest<import("../types").DashboardData>("/api/dashboard");

// Stations
export const getStations = () => apiRequest<import("../types").Station[]>("/api/stations");

export const createStation = (data: { name: string; type: string; hourlyRate?: number }) =>
  apiRequest("/api/stations", { method: "POST", body: data });

export const updateStation = (id: string, data: Record<string, unknown>) =>
  apiRequest(`/api/stations/${id}`, { method: "PATCH", body: data });

export const deleteStation = (id: string) =>
  apiRequest(`/api/stations/${id}`, { method: "DELETE" });

// Sessions
export const getSessions = (status?: string) =>
  apiRequest<import("../types").GameSession[]>(
    `/api/sessions${status ? `?status=${status}` : ""}`
  );

export const startSession = (data: {
  stationId: string;
  customerName?: string;
  paymentMethod: string;
}) => apiRequest("/api/sessions", { method: "POST", body: data });

export const updateSession = (id: string, action: string, data?: Record<string, unknown>) =>
  apiRequest(`/api/sessions/${id}`, { method: "PATCH", body: { action, ...data } });

// Payments
export const getPayments = (method?: string) =>
  apiRequest<import("../types").Payment[]>(
    `/api/payments${method ? `?method=${method}` : ""}`
  );

// Payment Integration Placeholders
// These functions will be implemented when real payment APIs are connected

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function initiateWavePayment(_amount: number, _phoneNumber: string) {
  // TODO: Integrate with Wave API
  // const { apiKey, merchantId, baseUrl } = PAYMENT_CONFIG.WAVE;
  // POST to ${baseUrl}/checkout/sessions
  throw new Error("Wave payment integration coming soon");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function initiateOrangeMoneyPayment(_amount: number, _phoneNumber: string) {
  // TODO: Integrate with Orange Money API
  // const { clientId, clientSecret, baseUrl } = PAYMENT_CONFIG.ORANGE_MONEY;
  // Step 1: Get OAuth token
  // Step 2: POST payment request
  throw new Error("Orange Money integration coming soon");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function initiateMTNMomoPayment(_amount: number, _phoneNumber: string) {
  // TODO: Integrate with MTN MoMo API
  // const { subscriptionKey, apiKey, baseUrl } = PAYMENT_CONFIG.MTN_MONEY;
  // Step 1: Create API user
  // Step 2: Request to pay
  throw new Error("MTN MoMo integration coming soon");
}
