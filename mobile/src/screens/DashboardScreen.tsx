import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { StatCard } from "../components/StatCard";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, PAYMENT_METHODS } from "../constants/theme";
import { getDashboard } from "../services/api";
import { DashboardData } from "../types";
import { formatCurrency, formatDateTime } from "../services/utils";

export function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await getDashboard();
      setData(result);
      setError("");
    } catch {
      setError("Impossible de charger les données");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const id = setTimeout(fetchData, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (error && !data) {
    return (
      <GradientBackground>
        <View style={styles.centered}>
          <MaterialCommunityIcons name="wifi-off" size={48} color={COLORS.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.hintText}>{"Vérifiez que le serveur backend est lancé"}</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>{"Vue d'ensemble"}</Text>
          </View>
          <View style={[styles.activeBadge, { backgroundColor: data?.activeSessions ? `${COLORS.success}20` : `${COLORS.textMuted}20` }]}>
            <View style={[styles.activeDot, { backgroundColor: data?.activeSessions ? COLORS.success : COLORS.textMuted }]} />
            <Text style={[styles.activeText, { color: data?.activeSessions ? COLORS.success : COLORS.textMuted }]}>
              {data?.activeSessions || 0} active{(data?.activeSessions || 0) > 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Revenus du jour"
            value={formatCurrency(data?.todayRevenue || 0)}
            subtitle={`${formatCurrency(data?.monthRevenue || 0)} ce mois`}
            icon="cash"
            iconColor={COLORS.success}
          />
          <StatCard
            title="Sessions"
            value={String(data?.todaySessions || 0)}
            subtitle={`${data?.monthSessions || 0} ce mois`}
            icon="timer-outline"
            iconColor={COLORS.primary}
          />
          <StatCard
            title="Clients"
            value={String(data?.todayClients || 0)}
            subtitle={`${data?.monthClients || 0} ce mois`}
            icon="account-group"
            iconColor={COLORS.secondary}
          />
          <StatCard
            title="Stations"
            value={`${data?.stations?.occupied || 0}/${data?.stations?.total || 0}`}
            subtitle={`${data?.stations?.free || 0} libres`}
            icon="monitor"
            iconColor={COLORS.warning}
          />
        </View>

        {/* Weekly Revenue Chart (simplified as bars) */}
        {data?.weeklyRevenue && data.weeklyRevenue.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <MaterialCommunityIcons name="chart-bar" size={18} color={COLORS.primary} />
              {"  "}Revenus - 7 derniers jours
            </Text>
            <View style={styles.chartContainer}>
              {data.weeklyRevenue.map((day, i) => {
                const maxRevenue = Math.max(...data.weeklyRevenue.map((d) => d.revenue), 1);
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <View key={i} style={styles.barColumn}>
                    <Text style={styles.barValue}>
                      {day.revenue > 0 ? `${Math.round(day.revenue / 1000)}k` : "0"}
                    </Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${Math.max(height, 5)}%`,
                            backgroundColor: COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{day.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Top Stations */}
        {data?.topStations && data.topStations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <MaterialCommunityIcons name="star" size={18} color={COLORS.warning} />
              {"  "}Machines populaires
            </Text>
            {data.topStations.map((station, i) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Text style={styles.listRank}>#{i + 1}</Text>
                  <Text style={styles.listItemName}>{station.name}</Text>
                </View>
                <Text style={styles.listItemValue}>{station.count} sessions</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Payments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="cash-multiple" size={18} color={COLORS.success} />
            {"  "}Derniers paiements
          </Text>
          {data?.recentPayments && data.recentPayments.length > 0 ? (
            data.recentPayments.slice(0, 5).map((payment) => (
              <View key={payment.id} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View
                    style={[
                      styles.methodDot,
                      { backgroundColor: PAYMENT_METHODS[payment.method]?.color || COLORS.textMuted },
                    ]}
                  />
                  <View>
                    <Text style={styles.listItemName}>
                      {payment.session.station.name}
                    </Text>
                    <Text style={styles.listItemSub}>
                      {PAYMENT_METHODS[payment.method]?.label || payment.method}
                    </Text>
                  </View>
                </View>
                <Text style={styles.listItemValue}>{formatCurrency(payment.amount)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucun paiement</Text>
          )}
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={COLORS.neonPurple} />
            {"  "}Activité récente
          </Text>
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.slice(0, 5).map((activity) => (
              <View key={activity.id} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View>
                    <Text style={styles.listItemName}>{activity.description}</Text>
                    <Text style={styles.listItemSub}>
                      {activity.user.name} • {formatDateTime(activity.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucune activité</Text>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xxl,
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.lg,
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    marginBottom: SPACING.lg,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barValue: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
  },
  barTrack: {
    width: 24,
    height: 80,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
  },
  barLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(55, 65, 81, 0.3)",
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listRank: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    marginRight: SPACING.sm,
    width: 24,
  },
  listItemName: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
  },
  listItemSub: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  listItemValue: {
    color: COLORS.neonBlue,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  methodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    paddingVertical: SPACING.lg,
  },
});
