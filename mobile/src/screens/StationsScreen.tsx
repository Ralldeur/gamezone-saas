import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
// MaterialCommunityIcons is used in sub-components
import { GradientBackground } from "../components/GradientBackground";
import { StationCard } from "../components/StationCard";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  STATION_STATUSES,
  PAYMENT_METHODS,
} from "../constants/theme";
import { getStations, startSession, updateSession } from "../services/api";
import { Station } from "../types";

export function StationsScreen() {
  const [stations, setStations] = useState<Station[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const fetchStations = useCallback(async () => {
    try {
      const data = await getStations();
      setStations(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchStations, 5000);
    return () => clearInterval(interval);
  }, [fetchStations]);

  useEffect(() => {
    const id = setTimeout(fetchStations, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStations();
    setRefreshing(false);
  };

  const handleStartSession = (stationId: string) => {
    setSelectedStationId(stationId);
    setCustomerName("");
    setPaymentMethod("CASH");
    setShowStartModal(true);
  };

  const confirmStartSession = async () => {
    try {
      await startSession({
        stationId: selectedStationId,
        customerName: customerName || undefined,
        paymentMethod,
      });
      setShowStartModal(false);
      fetchStations();
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Erreur");
    }
  };

  const handlePause = async (sessionId: string) => {
    try {
      await updateSession(sessionId, "pause");
      fetchStations();
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleResume = async (sessionId: string) => {
    try {
      await updateSession(sessionId, "resume");
      fetchStations();
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleStopSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setPaymentMethod("CASH");
    setShowStopModal(true);
  };

  const confirmStopSession = async () => {
    try {
      await updateSession(selectedSessionId, "stop", { paymentMethod });
      setShowStopModal(false);
      fetchStations();
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Erreur");
    }
  };

  const free = stations.filter((s) => s.status === "FREE").length;
  const occupied = stations.filter((s) => s.status === "OCCUPIED").length;
  const oos = stations.filter((s) => s.status === "OUT_OF_SERVICE").length;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <Text style={styles.title}>Stations</Text>
        <Text style={styles.subtitle}>Gérez vos postes de jeu</Text>

        {/* Status summary */}
        <View style={styles.statusRow}>
          {Object.entries(STATION_STATUSES).map(([key, info]) => {
            const count = key === "FREE" ? free : key === "OCCUPIED" ? occupied : oos;
            return (
              <View key={key} style={[styles.statusBadge, { backgroundColor: `${info.color}15` }]}>
                <View style={[styles.statusDot, { backgroundColor: info.color }]} />
                <Text style={[styles.statusText, { color: info.color }]}>
                  {info.label}: {count}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Station cards */}
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            onStartSession={handleStartSession}
            onPauseSession={handlePause}
            onResumeSession={handleResume}
            onStopSession={handleStopSession}
          />
        ))}
      </ScrollView>

      {/* Start Session Modal */}
      <Modal visible={showStartModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Démarrer une session</Text>

            <Text style={styles.modalLabel}>Nom du client (optionnel)</Text>
            <TextInput
              style={styles.modalInput}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Nom du client"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.modalLabel}>Mode de paiement</Text>
            <View style={styles.paymentGrid}>
              {Object.entries(PAYMENT_METHODS).map(([key, info]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.paymentOption,
                    paymentMethod === key && {
                      borderColor: info.color,
                      backgroundColor: `${info.color}15`,
                    },
                  ]}
                  onPress={() => setPaymentMethod(key)}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === key && { color: info.color },
                    ]}
                  >
                    {info.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowStartModal(false)}
              >
                <Text style={styles.modalBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={confirmStartSession}
              >
                <Text style={styles.modalBtnText}>Démarrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Stop Session Modal */}
      <Modal visible={showStopModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Arrêter et payer</Text>

            <Text style={styles.modalLabel}>Mode de paiement</Text>
            <View style={styles.paymentGrid}>
              {Object.entries(PAYMENT_METHODS).map(([key, info]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.paymentOption,
                    paymentMethod === key && {
                      borderColor: info.color,
                      backgroundColor: `${info.color}15`,
                    },
                  ]}
                  onPress={() => setPaymentMethod(key)}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === key && { color: info.color },
                    ]}
                  >
                    {info.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowStopModal(false)}
              >
                <Text style={styles.modalBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: COLORS.danger }]}
                onPress={confirmStopSession}
              >
                <Text style={styles.modalBtnText}>Arrêter & Payer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
  },
  statusRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    flexWrap: "wrap",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700",
    marginBottom: SPACING.xl,
  },
  modalLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  modalInput: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.white,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.lg,
  },
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  paymentOptionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  modalBtnCancel: {
    backgroundColor: COLORS.surfaceLight,
  },
  modalBtnConfirm: {
    backgroundColor: COLORS.success,
  },
  modalBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
});
