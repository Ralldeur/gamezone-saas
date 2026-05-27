"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Timer,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatDateTime,
  formatDuration,
  formatCurrency,
  SESSION_STATUSES,
  getElapsedSeconds,
} from "@/lib/utils";
import { useEffect, useRef } from "react";

interface GameSession {
  id: string;
  startTime: string;
  endTime: string | null;
  pausedAt: string | null;
  totalPausedDuration: number;
  status: string;
  customerName: string | null;
  plannedDuration: number | null;
  station: { name: string; type: string; hourlyRate: number | null };
  startedBy: { name: string };
  payment: { amount: number; method: string } | null;
}

function SessionDuration({ session }: { session: GameSession }) {
  const computeElapsed = () => {
    if (session.endTime) {
      const total =
        Math.floor(
          (new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()) /
            1000
        ) - session.totalPausedDuration;
      return Math.max(total, 0);
    }
    return getElapsedSeconds(
      session.startTime,
      session.totalPausedDuration,
      session.pausedAt
    );
  };

  const [elapsed, setElapsed] = useState(computeElapsed);
  const isActive = session.status === "ACTIVE" || session.status === "PAUSED";
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isActive) {
      intervalRef.current = setInterval(() => {
        setElapsed(computeElapsed());
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, session.startTime, session.totalPausedDuration, session.pausedAt, session.endTime]);

  return (
    <span className="font-mono text-sm">{formatDuration(elapsed)}</span>
  );
}

export default function SessionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const url = statusFilter
    ? `/api/sessions?status=${statusFilter}`
    : "/api/sessions";

  const { data: sessions, loading } = useApi<GameSession[]>(url, {
    refreshInterval: 5000,
  });

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "PAUSED":
        return "warning";
      case "COMPLETED":
        return "info";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-800 rounded-lg w-48 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Historique et sessions en cours
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={statusFilter === "" ? "primary" : "secondary"}
          onClick={() => setStatusFilter("")}
        >
          <Filter className="w-3.5 h-3.5" />
          Toutes
        </Button>
        {Object.entries(SESSION_STATUSES).map(([key, val]) => (
          <Button
            key={key}
            size="sm"
            variant={statusFilter === key ? "primary" : "secondary"}
            onClick={() => setStatusFilter(key)}
          >
            {val.label}
          </Button>
        ))}
      </div>

      {/* Sessions list */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Station
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Début
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Durée
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Opérateur
                </th>
                <th className="text-right p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {sessions?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-gray-500 text-sm"
                  >
                    <Timer className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Aucune session trouvée
                  </td>
                </tr>
              ) : (
                sessions?.map((session) => {
                  const statusInfo =
                    SESSION_STATUSES[
                      session.status as keyof typeof SESSION_STATUSES
                    ];
                  return (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {session.station.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.station.type}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {session.customerName || "—"}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {formatDateTime(session.startTime)}
                      </td>
                      <td className="p-4">
                        <SessionDuration session={session} />
                      </td>
                      <td className="p-4">
                        <Badge variant={statusBadgeVariant(session.status)}>
                          {statusInfo?.label || session.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {session.startedBy.name}
                      </td>
                      <td className="p-4 text-right">
                        {session.payment ? (
                          <span className="text-sm font-medium text-green-400">
                            {formatCurrency(session.payment.amount)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
