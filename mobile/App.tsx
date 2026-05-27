import React, { useState, useEffect, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "./src/hooks/useAuth";
import { User } from "./src/types";
import { login as apiLogin, logout as apiLogout, initAuth } from "./src/services/api";
import { COLORS } from "./src/constants/theme";

import { LoginScreen } from "./src/screens/LoginScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { StationsScreen } from "./src/screens/StationsScreen";
import { PaymentsScreen } from "./src/screens/PaymentsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const DarkTheme = {
  dark: true,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.white,
    border: COLORS.border,
    notification: COLORS.danger,
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" as const },
    medium: { fontFamily: "System", fontWeight: "500" as const },
    bold: { fontFamily: "System", fontWeight: "700" as const },
    heavy: { fontFamily: "System", fontWeight: "800" as const },
  },
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initAuth();
        const savedUser = await SecureStore.getItemAsync("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        // No saved user
      } finally {
        setIsLoading(false);
      }
    }
    bootstrap();
  }, []);

  const authContext = useMemo(
    () => ({
      user,
      isLoading,
      signIn: async (email: string, password: string) => {
        const userData = await apiLogin(email, password);
        setUser(userData);
        await SecureStore.setItemAsync("user", JSON.stringify(userData));
      },
      signOut: async () => {
        await apiLogout();
        await SecureStore.deleteItemAsync("user");
        setUser(null);
      },
    }),
    [user, isLoading]
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar style="light" />
      {!user ? (
        <LoginScreen />
      ) : (
        <NavigationContainer theme={DarkTheme}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: COLORS.surface,
                borderTopColor: COLORS.border,
                borderTopWidth: 1,
                height: 60,
                paddingBottom: 8,
                paddingTop: 4,
              },
              tabBarActiveTintColor: COLORS.primary,
              tabBarInactiveTintColor: COLORS.textMuted,
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: "600",
              },
            }}
          >
            <Tab.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Stations"
              component={StationsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="gamepad-variant" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Paiements"
              component={PaymentsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Paramètres"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="cog" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </AuthContext.Provider>
  );
}
