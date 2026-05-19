import { useRef, useEffect, useCallback } from "react";
import { StyleSheet, SafeAreaView, Alert, Animated, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { YStack, XStack, Card, Button, Text, View } from "tamagui";
import { useSession } from "@/features/session/model/useSession";
import { theme } from "@/core/styles/theme";

export const HomePage = () => {
  const { user, signOut } = useSession();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1 = useRef(new Animated.Value(0)).current;
  const card2 = useRef(new Animated.Value(0)).current;
  const card3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 6,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 6,
      }),
    ]).start();

    Animated.stagger(250, [card1, card2, card3].map((val) =>
      Animated.spring(val, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      })
    )).start();
  }, [fadeAnim, slideAnim, card1, card2, card3]);

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
          {/* Lottie animación superior */}
          <YStack alignItems="center" marginBottom="$1">
            <LottieView
              source={{ uri: "https://assets2.lottiefiles.com/packages/lf20_l3q3xz9q.json" }}
              autoPlay
              loop
              style={{ width: 120, height: 120 }}
            />
          </YStack>

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

          {/* Acciones como Cards Tamagui en columna */}
          <YStack gap={14}>
            <Animated.View style={{ opacity: card1, transform: [{ translateY: card1.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
              <Card
                elevate
                padded
                onPress={() => router.push("/tasks")}
                backgroundColor="$blue9"
                borderRadius="$4"
                width="100%"
                pressStyle={{ scale: 0.92, opacity: 0.85 }}
              >
                <Card.Header alignItems="center" gap="$2">
                  <Ionicons name="list-outline" size={28} color="white" />
                  <Button.Text color="white" fontWeight="700" fontSize={15}>
                    Mis Tareas
                  </Button.Text>
                </Card.Header>
              </Card>
            </Animated.View>

            <Animated.View style={{ opacity: card2, transform: [{ translateY: card2.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
              <Card
                elevate
                padded
                onPress={() => router.push("/change-password")}
                backgroundColor="$blue9"
                borderRadius="$4"
                width="100%"
                pressStyle={{ scale: 0.92, opacity: 0.85 }}
              >
                <Card.Header alignItems="center" gap="$2">
                  <Ionicons name="lock-closed-outline" size={28} color="white" />
                  <Button.Text color="white" fontWeight="700" fontSize={15}>
                    Cambiar contraseña
                  </Button.Text>
                </Card.Header>
              </Card>
            </Animated.View>

            <Animated.View style={{ opacity: card3, transform: [{ translateY: card3.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
              <Card
                elevate
                padded
                onPress={handleSignOut}
                backgroundColor="$blue9"
                borderRadius="$4"
                width="100%"
                pressStyle={{ scale: 0.92, opacity: 0.85 }}
              >
                <Card.Header alignItems="center" gap="$2">
                  <Ionicons name="log-out-outline" size={28} color="white" />
                  <Button.Text color="white" fontWeight="700" fontSize={15}>
                    Cerrar sesión
                  </Button.Text>
                </Card.Header>
              </Card>
            </Animated.View>
          </YStack>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: theme.colors.bg },
  animatedContainer: { flex: 1 },
  scroll:            { padding: 20, gap: 16, paddingBottom: 60 },
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

});
