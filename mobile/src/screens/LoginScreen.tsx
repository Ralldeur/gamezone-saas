import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZE } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("admin@gamezone.ci");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#0a0a1a", "#1e1b4b", "#0a0a1a"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.logoGradient}
            >
              <MaterialCommunityIcons name="gamepad-variant" size={40} color="#fff" />
            </LinearGradient>
            <Text style={styles.logoText}>GameZone</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre espace</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="admin@gamezone.ci"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Se connecter</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.demoText}>
              Demo: admin@gamezone.ci / admin123
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.xxxl,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  logoText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.title,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  form: {
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: "rgba(55, 65, 81, 0.5)",
    padding: SPACING.xxl,
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    paddingVertical: SPACING.md,
  },
  loginButton: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginGradient: {
    paddingVertical: SPACING.lg,
    alignItems: "center",
    borderRadius: BORDER_RADIUS.md,
  },
  loginText: {
    color: "#fff",
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  demoText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
});
