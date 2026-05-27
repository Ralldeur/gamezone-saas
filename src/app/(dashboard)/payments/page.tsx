"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Filter,
  DollarSign,
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  PAYMENT_METHODS,
} from "@/lib/utils";

interface Payment {
  id: string;
  amount: number;
  method: string;
  createdAt: string;
  session: {
    station: { name: string; type: string };
  };
  createdBy: { name: string };
}

export default function PaymentsPage() {
  const [methodFilter, setMethodFilter] = useState("");
  const url = methodFilter
    ? `/api/payments?method=${methodFilter}`
    : "/api/payments";

  const { data: payments, loading } = useApi<Payment[]>(url, {
    refreshInterval: 10000,
  });

  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const cashPayments =
    payments?.filter((p) => p.method === "CASH").reduce((s, p) => s + p.amount, 0) || 0;
  const mobilePayments =
    payments
      ?.filter((p) => p.method !== "CASH")
      .reduce((s, p) => s + p.amount, 0) || 0;

  const getMethodIcon = (method: string) => {
    if (method === "CASH") return <Banknote className="w-4 h-4" />;
    return <Smartphone className="w-4 h-4" />;
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "CASH":
        return "success";
      case "WAVE":
        return "info";
      case "ORANGE_MONEY":
        return "warning";
      case "MTN_MONEY":
        return "default";
      default:
        return "default" as const;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-800 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
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
      <div>
        <h1 className="text-2xl font-bold text-white">Paiements</h1>
        <p className="text-gray-400 text-sm mt-1">
          Historique des transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total affiché"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="w-5 h-5 text-green-400" />}
          glow="green"
        />
        <StatCard
          title="Espèces"
          value={formatCurrency(cashPayments)}
          icon={<Banknote className="w-5 h-5 text-yellow-400" />}
          glow="yellow"
        />
        <StatCard
          title="Mobile Money"
          value={formatCurrency(mobilePayments)}
          icon={<Smartphone className="w-5 h-5 text-blue-400" />}
          glow="blue"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={methodFilter === "" ? "primary" : "secondary"}
          onClick={() => setMethodFilter("")}
        >
          <Filter className="w-3.5 h-3.5" />
          Tous
        </Button>
        {PAYMENT_METHODS.map((method) => (
          <Button
            key={method.value}
            size="sm"
            variant={methodFilter === method.value ? "primary" : "secondary"}
            onClick={() => setMethodFilter(method.value)}
          >
            {method.label}
          </Button>
        ))}
      </div>

      {/* Payments table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Station
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Opérateur
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {payments?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500 text-sm"
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Aucun paiement trouvé
                  </td>
                </tr>
              ) : (
                payments?.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {payment.session.station.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.session.station.type}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          getMethodColor(payment.method) as
                            | "success"
                            | "warning"
                            | "info"
                            | "default"
                        }
                        className="inline-flex items-center gap-1"
                      >
                        {getMethodIcon(payment.method)}
                        {PAYMENT_METHODS.find(
                          (m) => m.value === payment.method
                        )?.label || payment.method}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {payment.createdBy.name}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {formatDateTime(payment.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-bold text-green-400">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
