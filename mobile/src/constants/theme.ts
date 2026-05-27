export const COLORS = {
  background: "#0a0a1a",
  surface: "#111827",
  surfaceLight: "#1f2937",
  border: "#374151",
  primary: "#3b82f6",
  primaryDark: "#2563eb",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  white: "#ffffff",
  textPrimary: "#f9fafb",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
  neonBlue: "#00d4ff",
  neonPurple: "#a855f7",
  neonGlow: "rgba(59, 130, 246, 0.3)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const STATION_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  PS4: { label: "PlayStation 4", icon: "gamepad-variant", color: "#3b82f6" },
  PS5: { label: "PlayStation 5", icon: "gamepad-variant", color: "#8b5cf6" },
  XBOX: { label: "Xbox", icon: "microsoft-xbox", color: "#10b981" },
  PC: { label: "PC Gamer", icon: "monitor", color: "#f59e0b" },
};

export const STATION_STATUSES: Record<string, { label: string; color: string }> = {
  FREE: { label: "Libre", color: "#10b981" },
  OCCUPIED: { label: "Occupé", color: "#f59e0b" },
  OUT_OF_SERVICE: { label: "Hors service", color: "#ef4444" },
};

export const PAYMENT_METHODS: Record<string, { label: string; color: string }> = {
  CASH: { label: "Espèces", color: "#10b981" },
  WAVE: { label: "Wave", color: "#3b82f6" },
  ORANGE_MONEY: { label: "Orange Money", color: "#f97316" },
  MTN_MONEY: { label: "MTN Money", color: "#eab308" },
};

export const SESSION_STATUSES: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "#10b981" },
  PAUSED: { label: "En pause", color: "#f59e0b" },
  COMPLETED: { label: "Terminée", color: "#6b7280" },
  CANCELLED: { label: "Annulée", color: "#ef4444" },
};
