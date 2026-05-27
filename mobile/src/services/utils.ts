export function formatCurrency(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} FCFA`;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }
  return `${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export function getElapsedSeconds(
  startTime: string,
  totalPausedDuration: number,
  pausedAt: string | null
): number {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  let elapsed = Math.floor((now - start) / 1000) - totalPausedDuration;

  if (pausedAt) {
    const pauseTime = new Date(pausedAt).getTime();
    const pauseDuration = Math.floor((now - pauseTime) / 1000);
    elapsed -= pauseDuration;
  }

  return Math.max(elapsed, 0);
}

export function calculateSessionCost(
  elapsedSeconds: number,
  hourlyRate: number
): number {
  return Math.round((elapsedSeconds / 3600) * hourlyRate);
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
