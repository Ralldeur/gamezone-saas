import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  children: React.ReactNode;
}

export function GradientBackground({ children }: Props) {
  return (
    <LinearGradient
      colors={["#0a0a1a", "#111827", "#0f172a"]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

export function CardGradient({ children }: Props) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(55, 65, 81, 0.5)",
    padding: 16,
    marginBottom: 12,
  },
});
