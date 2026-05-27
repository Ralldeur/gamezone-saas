import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { PAYMENT_CONFIG } from "../constants/config";

export function SettingsScreen() {
  const { user, signOut } = useAuth();

  const paymentIntegrations = [
    {
      name: "Wave",
      enabled: PAYMENT_CONFIG.WAVE.enabled,
      color: "#3b82f6",
      icon: "cellphone" as const,
    },
    {
      name: "Orange Money",
      enabled: PAYMENT_CONFIG.ORANGE_MONEY.enabled,
      color: "#f97316",
      icon: "phone" as const,
    },
    {
      name: "MTN MoMo",
      enabled: PAYMENT_CONFIG.MTN_MONEY.enabled,
      color: "#eab308",
      icon: "phone" as const,
    },
  ];

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Paramètres</Text>
        <Text style={styles.subtitle}>Configuration de votre compte</Text>

        {/* Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "Utilisateur"}</Text>
              <Text style={styles.profileEmail}>{user?.email || ""}</Text>
              <View style={[styles.roleBadge, { backgroundColor: user?.role === "ADMIN" ? `${COLORS.secondary}20` : `${COLORS.primary}20` }]}>
                <Text style={[styles.roleText, { color: user?.role === "ADMIN" ? COLORS.secondary : COLORS.primary }]}>
                  {user?.role === "ADMIN" ? "Administrateur" : "Employé"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Integrations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intégrations Paiement</Text>
          <Text style={styles.sectionSubtitle}>
            Configurez les APIs de paiement mobile dans config.ts
          </Text>
          {paymentIntegrations.map((integration) => (
            <View key={integration.name} style={styles.integrationItem}>
              <View style={styles.integrationLeft}>
                <View style={[styles.integrationIcon, { backgroundColor: `${integration.color}20` }]}>
                  <MaterialCommunityIcons
                    name={integration.icon}
                    size={20}
                    color={integration.color}
                  />
                </View>
                <Text style={styles.integrationName}>{integration.name}</Text>
              </View>
              <View style={[styles.integrationStatus, { backgroundColor: integration.enabled ? `${COLORS.success}20` : `${COLORS.textMuted}20` }]}>
                <Text style={[styles.integrationStatusText, { color: integration.enabled ? COLORS.success : COLORS.textMuted }]}>
                  {integration.enabled ? "Actif" : "Non configuré"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0 (MVP)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plateforme</Text>
            <Text style={styles.infoValue}>Expo / React Native</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Backend</Text>
            <Text style={styles.infoValue}>Next.js API</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
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
    marginBottom: SPACING.xl,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700",
  },
  profileInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  profileName: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
  },
  profileEmail: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.xs,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  integrationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(55, 65, 81, 0.3)",
  },
  integrationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  integrationIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  integrationName: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  integrationStatus: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  integrationStatusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(55, 65, 81, 0.3)",
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  infoValue: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
  },
});
