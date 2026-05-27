"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useApi, apiPost, apiPatch, apiDelete } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Plus,
  Play,
  Pause,
  Square,
  Wrench,
  Trash2,
  Edit,
  Gamepad2,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  cn,
  STATION_TYPES,
  STATION_STATUSES,
  PAYMENT_METHODS,
  formatDuration,
  getElapsedSeconds,
} from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Station {
  id: string;
  name: string;
  type: string;
  status: string;
  hourlyRate: number | null;
  sessions: Array<{
    id: string;
    startTime: string;
    pausedAt: string | null;
    totalPausedDuration: number;
    status: string;
    customerName: string | null;
    plannedDuration: number | null;
    startedBy: { name: string };
  }>;
}

function StationTimer({ session }: { session: Station["sessions"][0] }) {
  const [elapsed, setElapsed] = useState(() =>
    getElapsedSeconds(
      session.startTime,
      session.totalPausedDuration,
      session.pausedAt
    )
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (session.status === "ACTIVE") {
      intervalRef.current = setInterval(() => {
        setElapsed(
          getElapsedSeconds(
            session.startTime,
            session.totalPausedDuration,
            session.pausedAt
          )
        );
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session.status, session.startTime, session.totalPausedDuration, session.pausedAt]);

  return (
    <div className="flex items-center gap-1.5 text-lg font-mono font-bold text-white">
      <Clock className="w-4 h-4 text-blue-400" />
      {formatDuration(elapsed)}
    </div>
  );
}

export default function StationsPage() {
  const { data: authSession } = useSession();
  const { data: stations, loading, refetch } = useApi<Station[]>("/api/stations", {
    refreshInterval: 5000,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [newStation, setNewStation] = useState({
    name: "",
    type: "PS5",
    hourlyRate: "",
  });

  const [sessionForm, setSessionForm] = useState({
    customerName: "",
    plannedDuration: "",
  });

  const [stopPaymentMethod, setStopPaymentMethod] = useState("CASH");

  const isAdmin = authSession?.user?.role === "ADMIN";

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiPost("/api/stations", {
        name: newStation.name,
        type: newStation.type,
        hourlyRate: newStation.hourlyRate
          ? parseFloat(newStation.hourlyRate)
          : null,
      });
      setShowAddModal(false);
      setNewStation({ name: "", type: "PS5", hourlyRate: "" });
      refetch();
    } catch {
      // Error handled silently
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) return;
    setFormLoading(true);
    try {
      await apiPatch(`/api/stations/${selectedStation.id}`, {
        name: newStation.name,
        type: newStation.type,
        hourlyRate: newStation.hourlyRate
          ? parseFloat(newStation.hourlyRate)
          : null,
      });
      setShowEditModal(false);
      refetch();
    } catch {
      // Error handled silently
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStation = async (id: string) => {
    if (!confirm("Supprimer cette station ?")) return;
    try {
      await apiDelete(`/api/stations/${id}`);
      refetch();
    } catch {
      // Error handled silently
    }
  };

  const handleToggleStatus = async (station: Station) => {
    const newStatus =
      station.status === "OUT_OF_SERVICE" ? "FREE" : "OUT_OF_SERVICE";
    try {
      await apiPatch(`/api/stations/${station.id}`, { status: newStatus });
      refetch();
    } catch {
      // Error handled silently
    }
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) return;
    setFormLoading(true);
    try {
      await apiPost("/api/sessions", {
        stationId: selectedStation.id,
        customerName: sessionForm.customerName || null,
        plannedDuration: sessionForm.plannedDuration
          ? parseInt(sessionForm.plannedDuration)
          : null,
      });
      setShowSessionModal(false);
      setSessionForm({ customerName: "", plannedDuration: "" });
      refetch();
    } catch {
      // Error handled silently
    } finally {
      setFormLoading(false);
    }
  };

  const handlePauseResume = async (station: Station) => {
    const activeSession = station.sessions[0];
    if (!activeSession) return;
    const action =
      activeSession.status === "ACTIVE" ? "pause" : "resume";
    try {
      await apiPatch(`/api/sessions/${activeSession.id}`, { action });
      refetch();
    } catch {
      // Error handled silently
    }
  };

  const handleStopSession = async () => {
    if (!selectedStation) return;
    const activeSession = selectedStation.sessions[0];
    if (!activeSession) return;
    setFormLoading(true);
    try {
      await apiPatch(`/api/sessions/${activeSession.id}`, {
        action: "stop",
        paymentMethod: stopPaymentMethod,
      });
      setShowStopModal(false);
      refetch();
    } catch {
      // Error handled silently
    } finally {
      setFormLoading(false);
    }
  };

  const getStationIcon = (type: string) => {
    switch (type) {
      case "PS4":
      case "PS5":
        return <Gamepad2 className="w-8 h-8" />;
      case "XBOX":
        return <Gamepad2 className="w-8 h-8" />;
      default:
        return <Monitor className="w-8 h-8" />;
    }
  };

  const getTypeColor = (type: string) => {
    const t = STATION_TYPES.find((st) => st.value === type);
    return t?.color || "#666";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-800 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse"
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
          <h1 className="text-2xl font-bold text-white">Stations</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gérez vos postes de jeu
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        )}
      </div>

      {/* Status summary */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(STATION_STATUSES).map(([key, val]) => {
          const count =
            stations?.filter((s) => s.status === key).length || 0;
          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium",
                val.bg,
                val.border,
                val.color
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  key === "FREE" && "bg-green-400",
                  key === "OCCUPIED" && "bg-blue-400",
                  key === "OUT_OF_SERVICE" && "bg-red-400"
                )}
              />
              {val.label}: {count}
            </div>
          );
        })}
      </div>

      {/* Station grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stations?.map((station, i) => {
          const status =
            STATION_STATUSES[
              station.status as keyof typeof STATION_STATUSES
            ] || STATION_STATUSES.FREE;
          const activeSession = station.sessions[0];
          const isOccupied = station.status === "OCCUPIED";
          const isOutOfService = station.status === "OUT_OF_SERVICE";

          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={cn(
                  "relative overflow-hidden",
                  isOccupied && "border-blue-500/30",
                  isOutOfService && "border-red-500/30 opacity-60"
                )}
              >
                {/* Status indicator */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    station.status === "FREE" && "bg-green-400",
                    station.status === "OCCUPIED" &&
                      "bg-blue-400 animate-pulse-glow",
                    station.status === "OUT_OF_SERVICE" && "bg-red-400"
                  )}
                />

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{
                      backgroundColor: `${getTypeColor(station.type)}20`,
                    }}
                  >
                    <div style={{ color: getTypeColor(station.type) }}>
                      {getStationIcon(station.type)}
                    </div>
                  </div>
                  <Badge
                    variant={
                      station.status === "FREE"
                        ? "success"
                        : station.status === "OCCUPIED"
                          ? "info"
                          : "danger"
                    }
                  >
                    {status.label}
                  </Badge>
                </div>

                {/* Info */}
                <h3 className="text-white font-semibold mb-1">
                  {station.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {STATION_TYPES.find((t) => t.value === station.type)?.label}
                  {station.hourlyRate && ` • ${station.hourlyRate} FCFA/h`}
                </p>

                {/* Active session info */}
                {activeSession && (
                  <div className="mb-3 p-2 bg-gray-800/50 rounded-lg space-y-1">
                    <StationTimer session={activeSession} />
                    {activeSession.customerName && (
                      <p className="text-xs text-gray-400">
                        Client: {activeSession.customerName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Par {activeSession.startedBy.name}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  {station.status === "FREE" && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedStation(station);
                        setShowSessionModal(true);
                      }}
                    >
                      <Play className="w-3.5 h-3.5" />
                      Démarrer
                    </Button>
                  )}
                  {isOccupied && activeSession && (
                    <>
                      <Button
                        size="sm"
                        variant={
                          activeSession.status === "PAUSED"
                            ? "success"
                            : "secondary"
                        }
                        onClick={() => handlePauseResume(station)}
                      >
                        {activeSession.status === "PAUSED" ? (
                          <Play className="w-3.5 h-3.5" />
                        ) : (
                          <Pause className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        onClick={() => {
                          setSelectedStation(station);
                          setShowStopModal(true);
                        }}
                      >
                        <Square className="w-3.5 h-3.5" />
                        Arrêter
                      </Button>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(station)}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedStation(station);
                          setNewStation({
                            name: station.name,
                            type: station.type,
                            hourlyRate: station.hourlyRate?.toString() || "",
                          });
                          setShowEditModal(true);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStation(station.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add Station Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter une station"
      >
        <form onSubmit={handleAddStation} className="space-y-4">
          <Input
            label="Nom"
            placeholder="PS5 - Poste 3"
            value={newStation.name}
            onChange={(e) =>
              setNewStation({ ...newStation, name: e.target.value })
            }
            required
          />
          <Select
            label="Type"
            value={newStation.type}
            onChange={(e) =>
              setNewStation({ ...newStation, type: e.target.value })
            }
            options={STATION_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
          <Input
            label="Tarif horaire (FCFA)"
            type="number"
            placeholder="Laisser vide pour le tarif par défaut"
            value={newStation.hourlyRate}
            onChange={(e) =>
              setNewStation({ ...newStation, hourlyRate: e.target.value })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              type="button"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" loading={formLoading} className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Station Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier la station"
      >
        <form onSubmit={handleUpdateStation} className="space-y-4">
          <Input
            label="Nom"
            value={newStation.name}
            onChange={(e) =>
              setNewStation({ ...newStation, name: e.target.value })
            }
            required
          />
          <Select
            label="Type"
            value={newStation.type}
            onChange={(e) =>
              setNewStation({ ...newStation, type: e.target.value })
            }
            options={STATION_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
          <Input
            label="Tarif horaire (FCFA)"
            type="number"
            value={newStation.hourlyRate}
            onChange={(e) =>
              setNewStation({ ...newStation, hourlyRate: e.target.value })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              type="button"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" loading={formLoading} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Start Session Modal */}
      <Modal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        title={`Démarrer - ${selectedStation?.name}`}
      >
        <form onSubmit={handleStartSession} className="space-y-4">
          <Input
            label="Nom du client (optionnel)"
            placeholder="Ex: Kouamé"
            value={sessionForm.customerName}
            onChange={(e) =>
              setSessionForm({
                ...sessionForm,
                customerName: e.target.value,
              })
            }
          />
          <Input
            label="Durée prévue en minutes (optionnel)"
            type="number"
            placeholder="Ex: 60"
            value={sessionForm.plannedDuration}
            onChange={(e) =>
              setSessionForm({
                ...sessionForm,
                plannedDuration: e.target.value,
              })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowSessionModal(false)}
              type="button"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" loading={formLoading} className="flex-1">
              <Play className="w-4 h-4" />
              Démarrer la session
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stop Session Modal */}
      <Modal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        title={`Arrêter - ${selectedStation?.name}`}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Choisissez le mode de paiement pour terminer la session.
          </p>
          <Select
            label="Mode de paiement"
            value={stopPaymentMethod}
            onChange={(e) => setStopPaymentMethod(e.target.value)}
            options={PAYMENT_METHODS.map((m) => ({
              value: m.value,
              label: m.label,
            }))}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowStopModal(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleStopSession}
              loading={formLoading}
              className="flex-1"
            >
              <Square className="w-4 h-4" />
              Arrêter et payer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
