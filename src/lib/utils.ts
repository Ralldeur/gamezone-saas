export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, currency = "FCFA") {
  return `${amount.toLocaleString("fr-FR")} ${currency}`;
}

export function formatDuration(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  }
  return `${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function calculateSessionCost(
  startTime: Date,
  endTime: Date | null,
  totalPausedDuration: number,
  hourlyRate: number
) {
  const end = endTime || new Date();
  const totalSeconds =
    Math.floor((end.getTime() - new Date(startTime).getTime()) / 1000) -
    totalPausedDuration;
  const hours = Math.max(totalSeconds / 3600, 0);
  return Math.round(hours * hourlyRate);
}

export function getElapsedSeconds(
  startTime: Date | string,
  totalPausedDuration: number,
  pausedAt: Date | string | null
) {
  const now = new Date();
  const start = new Date(startTime);
  let elapsed = Math.floor((now.getTime() - start.getTime()) / 1000) - totalPausedDuration;

  if (pausedAt) {
    const pauseStart = new Date(pausedAt);
    const pauseElapsed = Math.floor((now.getTime() - pauseStart.getTime()) / 1000);
    elapsed -= pauseElapsed;
  }

  return Math.max(elapsed, 0);
}

export const STATION_TYPES = [
  { value: "PS4", label: "PlayStation 4", color: "#003087" },
  { value: "PS5", label: "PlayStation 5", color: "#00439C" },
  { value: "XBOX", label: "Xbox", color: "#107C10" },
  { value: "PC", label: "PC Gamer", color: "#FF6600" },
] as const;

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Espèces", icon: "Banknote" },
  { value: "WAVE", label: "Wave", icon: "Smartphone" },
  { value: "ORANGE_MONEY", label: "Orange Money", icon: "Smartphone" },
  { value: "MTN_MONEY", label: "MTN Money", icon: "Smartphone" },
] as const;

export const SESSION_STATUSES = {
  ACTIVE: { label: "Active", color: "text-green-400", bg: "bg-green-400/10" },
  PAUSED: { label: "En pause", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  COMPLETED: { label: "Terminée", color: "text-blue-400", bg: "bg-blue-400/10" },
  CANCELLED: { label: "Annulée", color: "text-red-400", bg: "bg-red-400/10" },
} as const;

export const STATION_STATUSES = {
  FREE: { label: "Libre", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30" },
  OCCUPIED: { label: "Occupé", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30" },
  OUT_OF_SERVICE: { label: "Hors service", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
} as const;
