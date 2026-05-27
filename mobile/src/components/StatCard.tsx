import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZE } from "../constants/theme";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
}

export function StatCard({ title, value, subtitle, icon, iconColor = COLORS.primary }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    width: "48%",
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
});
