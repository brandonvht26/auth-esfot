import { useRef, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Animated, ScrollView,
} from "react-native";
import { router }    from "expo-router";
import { YStack, XStack } from "tamagui";
import { useSession } from "@/features/session/model/useSession";
import { Button }     from "@/shared/ui/Button";
import { theme }      from "@/core/styles/theme";

const achievements = [
  { icon: "🔐", label: "Autenticación con Supabase Auth" },
  { icon: "🔑", label: "Tokens persistidos con SecureStore" },
  { icon: "⚡", label: "Estado de sesión con TanStack Query" },
  { icon: "🧩", label: "Arquitectura Feature-Sliced Design" },
  { icon: "📱", label: "Expo Router con TypeScript" },
  { icon: "🌐", label: "App web en Vercel para auth flows" },
  { icon: "📋", label: "CRUD de Tareas con Supabase" },
];

export const HomePage = () => {
  const { user, signOut } = useSession();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: () => signOut() },
      ]
    );
  }, [signOut]);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={[
          styles.animatedContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🎓</Text>
            <Text style={styles.headerTitle}>ESFOT</Text>
            <Text style={styles.headerSub}>
              Tecnología Superior en Desarrollo de Software
            </Text>
          </View>

          {/* Mensaje principal */}
          <View style={styles.card}>
            <Text style={styles.welcomeIcon}>🚀</Text>
            <Text style={styles.welcomeTitle}>
              ¡Bienvenido, lo lograste,{" "}tecnólogo de la ESFOT!
            </Text>
            <View style={styles.divider} />
            <Text style={styles.challengeText}>
              ¿No fue tan difícil... o sí? 😄
            </Text>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>

          {/* Logros como cards Tamagui */}
          <YStack gap="$2">
            <Text style={styles.achievementsTitle}>Lo que implementaste:</Text>
            {achievements.map((item) => (
              <XStack
                key={item.label}
                backgroundColor="$background"
                padding="$3"
                borderRadius="$3"
                gap="$3"
                alignItems="center"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Text style={styles.achievementIcon}>{item.icon}</Text>
                <Text style={styles.achievementLabel}>{item.label}</Text>
              </XStack>
            ))}
          </YStack>

          {/* Botones de acción */}
          <View style={styles.actions}>
            <Button
              onPress={() => router.push("/tasks")}
              label="📋 Mis Tareas"
            />
            <Button
              onPress={() => router.push("/change-password")}
              label="🔑 Cambiar contraseña"
              variant="ghost"
            />
            <Button
              onPress={handleSignOut}
              label="Cerrar sesión"
              variant="ghost"
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: theme.colors.bg },
  animatedContainer: { flex: 1 },
  scroll:            { padding: 24, gap: 20, paddingBottom: 40 },
  header:            { backgroundColor: theme.colors.primary, borderRadius: 16,
                       padding: 24, alignItems: "center", ...theme.shadow.card },
  headerIcon:        { fontSize: 48, marginBottom: 8 },
  headerTitle:       { color: "#fff", fontSize: 28, fontWeight: "800" },
  headerSub:         { color: "rgba(255,255,255,0.75)", fontSize: 12,
                       textAlign: "center", marginTop: 4 },
  card:              { backgroundColor: theme.colors.card, borderRadius: 16,
                       padding: 28, alignItems: "center", ...theme.shadow.card },
  welcomeIcon:       { fontSize: 56, marginBottom: 16 },
  welcomeTitle:      { fontSize: 22, fontWeight: "800", color: theme.colors.primary,
                       textAlign: "center", lineHeight: 30, marginBottom: 16 },
  divider:           { width: "100%", height: 1,
                       backgroundColor: theme.colors.border, marginVertical: 12 },
  challengeText:     { fontSize: 18, color: theme.colors.textMid,
                       fontWeight: "600", marginBottom: 8 },
  emailText:         { fontSize: 13, color: theme.colors.textMuted },
  achievementsTitle: { fontSize: 15, fontWeight: "700",
                       color: theme.colors.primary, marginBottom: 4 },
  achievementIcon:   { fontSize: 20 },
  achievementLabel:  { fontSize: 14, color: theme.colors.textMid, flex: 1 },
  actions:           { gap: 12 },
});
