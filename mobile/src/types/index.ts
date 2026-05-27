export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EMPLOYEE";
}

export interface Station {
  id: string;
  name: string;
  type: string;
  status: "FREE" | "OCCUPIED" | "OUT_OF_SERVICE";
  hourlyRate: number | null;
  sessions: GameSession[];
}

export interface GameSession {
  id: string;
  startTime: string;
  endTime: string | null;
  pausedAt: string | null;
  totalPausedDuration: number;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  customerName: string | null;
  plannedDuration: number | null;
  startedBy: { name: string };
  station: { name: string; type: string; hourlyRate: number | null };
  payment: { amount: number; method: string } | null;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  createdAt: string;
  session: {
    id: string;
    customerName: string | null;
    station: { name: string; type: string };
  };
  createdBy: { name: string };
}

export interface DashboardData {
  stations: {
    total: number;
    free: number;
    occupied: number;
    outOfService: number;
  };
  todayRevenue: number;
  monthRevenue: number;
  todaySessions: number;
  monthSessions: number;
  todayClients: number;
  monthClients: number;
  activeSessions: number;
  topStations: Array<{ name: string; type: string; count: number }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    method: string;
    createdAt: string;
    session: { station: { name: string } };
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: string;
    user: { name: string };
  }>;
  weeklyRevenue: Array<{ day: string; revenue: number }>;
}
