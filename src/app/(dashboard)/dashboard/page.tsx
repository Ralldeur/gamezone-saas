"use client";

import { useApi } from "@/hooks/useApi";
import { StatCard, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTime, PAYMENT_METHODS } from "@/lib/utils";
import {
  DollarSign,
  Users,
  Monitor,
  Timer,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

interface DashboardData {
  stations: {
    total: number;
    free: number;
    occupied: number;
    outOfService: number;
  };
  activeSessions: number;
  revenue: { today: number; month: number };
  sessions: { today: number; month: number };
  clients: { today: number; month: number };
  recentPayments: Array<{
    id: string;
    amount: number;
    method: string;
    createdAt: string;
    session: {
      station: { name: string; type: string };
    };
    createdBy: { name: string };
  }>;
  topStations: Array<{
    name: string;
    type: string;
    sessions: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: string;
    user: { name: string };
  }>;
  last7Days: Array<{
    date: string;
    label: string;
    revenue: number;
    sessions: number;
  }>;
}

export default function DashboardPage() {
  const { data, loading } = useApi<DashboardData>("/api/dashboard", {
    refreshInterval: 10000,
  });

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-800 rounded-lg w-48 animate-pulse" />
            <div className="h-4 bg-gray-800 rounded-lg w-32 mt-2 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Vue d&apos;ensemble de votre salle de jeux
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-400/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-medium">
              {data.activeSessions} session{data.activeSessions > 1 ? "s" : ""}{" "}
              active{data.activeSessions > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenus du jour"
          value={formatCurrency(data.revenue.today)}
          subtitle={`${formatCurrency(data.revenue.month)} ce mois`}
          icon={<DollarSign className="w-5 h-5 text-green-400" />}
          glow="green"
        />
        <StatCard
          title="Sessions aujourd'hui"
          value={data.sessions.today}
          subtitle={`${data.sessions.month} ce mois`}
          icon={<Timer className="w-5 h-5 text-blue-400" />}
          glow="blue"
        />
        <StatCard
          title="Clients aujourd'hui"
          value={data.clients.today}
          subtitle={`${data.clients.month} ce mois`}
          icon={<Users className="w-5 h-5 text-purple-400" />}
          glow="purple"
        />
        <StatCard
          title="Stations"
          value={`${data.stations.occupied}/${data.stations.total}`}
          subtitle={`${data.stations.free} libres, ${data.stations.outOfService} HS`}
          icon={<Monitor className="w-5 h-5 text-yellow-400" />}
          glow="yellow"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Revenus - 7 derniers jours
              </h2>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="label"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Revenu",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#colorGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top stations */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">
              Machines populaires
            </h2>
          </div>
          <div className="space-y-3">
            {data.topStations.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Aucune donnée disponible
              </p>
            ) : (
              data.topStations.map((station, i) => (
                <motion.div
                  key={station.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center text-sm font-bold text-blue-400">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {station.name}
                      </p>
                      <p className="text-xs text-gray-500">{station.type}</p>
                    </div>
                  </div>
                  <Badge variant="info">{station.sessions} sessions</Badge>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent activity and payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent payments */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">
              Derniers paiements
            </h2>
          </div>
          <div className="space-y-3">
            {data.recentPayments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Aucun paiement
              </p>
            ) : (
              data.recentPayments.map((payment) => {
                const method = PAYMENT_METHODS.find(
                  (m) => m.value === payment.method
                );
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {payment.session.station.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {method?.label || payment.method} &bull;{" "}
                        {payment.createdBy.name} &bull;{" "}
                        {formatTime(payment.createdAt)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-green-400">
                      +{formatCurrency(payment.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">
              Activité récente
            </h2>
          </div>
          <div className="space-y-3">
            {data.recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Aucune activité
              </p>
            ) : (
              data.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-xl"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.user.name} &bull;{" "}
                      {formatTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
