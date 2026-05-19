import { useState } from "react";
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, Alert, TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { router }            from "expo-router";
import { useForgotPassword } from "@/features/auth/model/useForgotPassword";
import { Input }             from "@/shared/ui/Input";
import { Button }            from "@/shared/ui/Button";
import { theme }             from "@/core/styles/theme";

export const ForgotPasswordPage = () => {
  const [email,   setEmail]   = useState("");
  const [success, setSuccess] = useState(false);
  const forgotPassword = useForgotPassword();

  const handleSend = async () => {
    if (!email) {
      Alert.alert("Campo requerido", "Ingresa tu correo electrónico.");
      return;
    }
    try {
      await forgotPassword.mutateAsync(email);
      setSuccess(true);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="mail-outline" size={72} color={theme.colors.primary} style={{ marginBottom: 24 }} />
        <Text style={styles.successTitle}>¡Email enviado!</Text>
        <Text style={styles.successText}>
          Revisa tu bandeja de entrada en{" "}
          <Text style={{ fontWeight:"700" }}>{email}</Text>.
          {"  "}Haz clic en el link del email para
          establecer tu nueva contraseña.
          {"  "}Una vez cambiada, regresa aquí e inicia sesión.
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.link}>
            <Ionicons name="arrow-back" size={15} color={theme.colors.accent} /> Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
    >
      <View style={styles.inner}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.accent} style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.header}>
            <LottieView
              source={{ uri: "https://assets2.lottiefiles.com/packages/lf20_l3q3xz9q.json" }}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              Te enviaremos un email para restablecerla
            </Text>
          </View>
          <View style={styles.form}>
            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="tu@correo.com"
            />
            <Button
              onPress={handleSend}
              isLoading={forgotPassword.isPending}
              label="Enviar instrucciones"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:        { flex:1, backgroundColor: theme.colors.bg },
  inner:            { flex:1, justifyContent:"center", padding:24 },
  backBtn:          { flexDirection:"row", alignItems:"center", marginBottom:16 },
  backText:         { color: theme.colors.accent, fontSize:16 },
  card:             { backgroundColor: theme.colors.card, borderRadius:20,
                      overflow:"hidden", ...theme.shadow.card },
  header:           { backgroundColor: theme.colors.primary, padding:32,
                      alignItems:"center" },
  title:            { color:"#fff", fontSize:22, fontWeight:"700",
                      textAlign:"center", marginBottom:8 },
  subtitle:         { color:"rgba(255,255,255,0.75)", fontSize:13,
                      textAlign:"center" },
  form:             { padding:28, gap:16 },
  successContainer: { flex:1, backgroundColor: theme.colors.bg,
                      justifyContent:"center", alignItems:"center", padding:32 },
  successTitle:     { fontSize:26, fontWeight:"700",
                      color: theme.colors.primary, marginBottom:16 },
  successText:      { fontSize:16, color: theme.colors.textMid,
                      textAlign:"center", lineHeight:24, marginBottom:32 },
  link:             { color: theme.colors.accent, fontSize:15, fontWeight:"600" },
});
