import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  COLORS,
  BORDER_RADIUS,
  SPACING,
  FONT_SIZE,
  STATION_TYPES,
  STATION_STATUSES,
} from "../constants/theme";
import { Station } from "../types";
import {
  formatDuration,
  getElapsedSeconds,
  calculateSessionCost,
} from "../services/utils";

interface Props {
  station: Station;
  onStartSession: (stationId: string) => void;
  onPauseSession: (sessionId: string) => void;
  onResumeSession: (sessionId: string) => void;
  onStopSession: (sessionId: string) => void;
}

export function StationCard({
  station,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onStopSession,
}: Props) {
  const activeSession = station.sessions?.find(
    (s) => s.status === "ACTIVE" || s.status === "PAUSED"
  );
  const stationType = STATION_TYPES[station.type] || STATION_TYPES.PC;
  const statusInfo = STATION_STATUSES[station.status] || STATION_STATUSES.FREE;

  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (activeSession && activeSession.status === "ACTIVE") {
      intervalRef.current = setInterval(() => {
        setElapsed(
          getElapsedSeconds(
            activeSession.startTime,
            activeSession.totalPausedDuration,
            activeSession.pausedAt
          )
        );
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.status, activeSession?.startTime, activeSession?.totalPausedDuration, activeSession?.pausedAt]);

  const hourlyRate = station.hourlyRate || 500;
  const cost = calculateSessionCost(elapsed, hourlyRate);
  const borderColor = `${statusInfo.color}40`;

  return (
    <View style={[styles.card, { borderColor }]}>
      {/* Status badge */}
      <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
        <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
      </View>

      {/* Station info */}
      <View style={styles.stationInfo}>
        <MaterialCommunityIcons
          name={station.type === "PC" ? "monitor" : "gamepad-variant"}
          size={32}
          color={stationType.color}
        />
        <View style={styles.stationDetails}>
          <Text style={styles.stationName}>{station.name}</Text>
          <Text style={styles.stationType}>
            {stationType.label} • {hourlyRate} FCFA/h
          </Text>
        </View>
      </View>

      {/* Active session info */}
      {activeSession && (
        <View style={styles.sessionInfo}>
          <View style={styles.timerRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.neonBlue} />
            <Text style={styles.timerText}>{formatDuration(elapsed)}</Text>
          </View>
          <Text style={styles.costText}>{cost} FCFA</Text>
          {activeSession.customerName && (
            <Text style={styles.customerText}>{activeSession.customerName}</Text>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {station.status === "FREE" && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
            onPress={() => onStartSession(station.id)}
          >
            <MaterialCommunityIcons name="play" size={16} color="#fff" />
            <Text style={styles.actionText}>Démarrer</Text>
          </TouchableOpacity>
        )}
        {activeSession?.status === "ACTIVE" && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.warning }]}
              onPress={() => onPauseSession(activeSession.id)}
            >
              <MaterialCommunityIcons name="pause" size={16} color="#fff" />
              <Text style={styles.actionText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.danger }]}
              onPress={() =>
                Alert.alert("Arrêter la session ?", `Montant: ${cost} FCFA`, [
                  { text: "Annuler", style: "cancel" },
                  { text: "Arrêter", onPress: () => onStopSession(activeSession.id) },
                ])
              }
            >
              <MaterialCommunityIcons name="stop" size={16} color="#fff" />
              <Text style={styles.actionText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
        {activeSession?.status === "PAUSED" && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => onResumeSession(activeSession.id)}
            >
              <MaterialCommunityIcons name="play" size={16} color="#fff" />
              <Text style={styles.actionText}>Reprendre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.danger }]}
              onPress={() =>
                Alert.alert("Arrêter la session ?", `Montant: ${cost} FCFA`, [
                  { text: "Annuler", style: "cancel" },
                  { text: "Arrêter", onPress: () => onStopSession(activeSession.id) },
                ])
              }
            >
              <MaterialCommunityIcons name="stop" size={16} color="#fff" />
              <Text style={styles.actionText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  stationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  stationDetails: {
    marginLeft: SPACING.md,
  },
  stationName: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  stationType: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  sessionInfo: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  costText: {
    color: COLORS.neonBlue,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginTop: 4,
  },
  customerText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
    flex: 1,
    justifyContent: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
});
