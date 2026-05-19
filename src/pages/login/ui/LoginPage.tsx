import { useState } from "react";
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, Alert, TouchableOpacity, ScrollView
} from "react-native";
import LottieView from "lottie-react-native";
import { router }          from "expo-router";
import { useLogin }        from "@/features/auth/model/useLogin";
import { useGoogleLogin } from "@/features/auth/model/useGoogleLogin";
import { Input }           from "@/shared/ui/Input";
import { Button }          from "@/shared/ui/Button";
import { theme }           from "@/core/styles/theme";

export const LoginPage = () => {
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const login = useLogin();
  const googleLogin = useGoogleLogin();

  const handleGoogleLogin = async () => {
    try {
      await googleLogin.mutateAsync();
    } catch (err: any) {
      if (err.message !== "Login cancelado") {
        Alert.alert("Error", err.message ?? "No se pudo iniciar con Google.");
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Completa email y contraseña.");
      return;
    }
    try {
      await login.mutateAsync({ email, password });
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Credenciales incorrectas.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Header con Lottie */}
          <View style={styles.header}>
            <LottieView
              source={{ uri: "https://assets2.lottiefiles.com/packages/lf20_l3q3xz9q.json" }}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>ESFOT — Inicia sesión</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="tu@correo.com"
            />
            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholder="Tu contraseña"
              rightElement={(
                <TouchableOpacity
                  onPress={() => setShowPass((p) => !p)}
                  style={{ paddingHorizontal:12, paddingVertical:13 }}
                >
                  <Text style={{ fontSize:20 }}>{showPass ? "🙈" : "👁"}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              style={{ alignSelf:"flex-end" }}
            >
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Botón con Lottie loading */}
            {login.isPending ? (
              <View style={styles.loadingContainer}>
                <LottieView
                  source={{ uri: "https://assets10.lottiefiles.com/packages/lf20_p1qi3mhn.json" }}
                  autoPlay
                  loop
                  style={{ width: 80, height: 80 }}
                />
                <Text style={styles.loadingText}>Iniciando sesión...</Text>
              </View>
            ) : (
              <Button
                onPress={handleLogin}
                isLoading={false}
                label="Iniciar sesión"
              />
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={googleLogin.isPending}
              style={styles.googleBtn}
            >
              <Text style={styles.googleBtnText}>
                {googleLogin.isPending ? "Conectando..." : "🔵  Continuar con Google"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={{ alignItems:"center" }}
            >
              <Text style={styles.linkMuted}>
                ¿No tienes cuenta?{" "}
                <Text style={{ color: theme.colors.primary, fontWeight:"700" }}>
                  Regístrate
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg },
  scroll:    { flexGrow:1, justifyContent:"center", padding:24 },
  card:      { backgroundColor: theme.colors.card, borderRadius:20,
               overflow:"hidden", ...theme.shadow.card },
  header:    { backgroundColor: theme.colors.primary, padding:32,
               alignItems:"center" },
  title:     { color:"#fff", fontSize:26, fontWeight:"700", marginBottom:4 },
  subtitle:  { color:"rgba(255,255,255,0.75)", fontSize:14 },
  form:      { padding:28, gap:16 },
  link:      { color: theme.colors.accent, fontSize:14 },
  linkMuted: { color: theme.colors.textMuted, fontSize:14 },
  divider: { flexDirection: "row", alignItems: "center", gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: { color: theme.colors.textMuted, fontSize: 13 },
  googleBtn: {
    borderWidth: 1.5,
    borderColor: "#4285F4",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  googleBtnText: { color: "#4285F4", fontWeight: "700", fontSize: 15 },
  loadingContainer: { alignItems:"center", paddingVertical:8 },
  loadingText: { color: theme.colors.textMuted, fontSize:13, marginTop:4 },
});
