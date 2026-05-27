import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, PAYMENT_METHODS } from "../constants/theme";
import { getPayments } from "../services/api";
import { Payment } from "../types";
import { formatCurrency, formatDateTime } from "../services/utils";

export function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("");

  const fetchPayments = useCallback(async () => {
    try {
      const data = await getPayments(filter || undefined);
      setPayments(data);
    } catch {
      // silent
    }
  }, [filter]);

  useEffect(() => {
    const id = setTimeout(fetchPayments, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const filters = [{ key: "", label: "Tous" }, ...Object.entries(PAYMENT_METHODS).map(([k, v]) => ({ key: k, label: v.label }))];

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <Text style={styles.title}>Paiements</Text>
        <Text style={styles.subtitle}>Historique des transactions</Text>

        {/* Total */}
        <View style={styles.totalCard}>
          <MaterialCommunityIcons name="cash-multiple" size={24} color={COLORS.success} />
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Total affiché</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalRevenue)}</Text>
          </View>
          <Text style={styles.totalCount}>{payments.length} paiements</Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                filter === f.key && styles.filterChipActive,
              ]}
              onPress={() => setFilter(f.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === f.key && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Payment list */}
        {payments.length > 0 ? (
          payments.map((payment) => {
            const method = PAYMENT_METHODS[payment.method];
            return (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentLeft}>
                    <View
                      style={[
                        styles.methodBadge,
                        { backgroundColor: `${method?.color || COLORS.textMuted}20` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={
                          payment.method === "CASH"
                            ? "cash"
                            : payment.method === "WAVE"
                            ? "cellphone"
                            : "phone"
                        }
                        size={20}
                        color={method?.color || COLORS.textMuted}
                      />
                    </View>
                    <View>
                      <Text style={styles.paymentStation}>
                        {payment.session.station.name}
                      </Text>
                      <Text style={styles.paymentMeta}>
                        {method?.label || payment.method} • {payment.createdBy.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </Text>
                    <Text style={styles.paymentDate}>
                      {formatDateTime(payment.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cash-off" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Aucun paiement</Text>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: 40,
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
  totalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  totalInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  totalValue: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700",
  },
  totalCount: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
  filterRow: {
    marginBottom: SPACING.lg,
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  paymentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  methodBadge: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  paymentStation: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  paymentMeta: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  paymentRight: {
    alignItems: "flex-end",
  },
  paymentAmount: {
    color: COLORS.success,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  paymentDate: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xxxl,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.md,
  },
});
