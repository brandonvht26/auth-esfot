import { useState } from "react";
import { SafeAreaView, TouchableOpacity, Alert, StyleSheet, View, Text, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { useChangePassword } from "@/features/auth/model/useChangePassword";

export const ChangePasswordPage = () => {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<"new" | "confirm" | null>(null);
  const changePassword = useChangePassword();

  const handleChange = async () => {
    if (!newPass || !confirmPass) {
      Alert.alert("Campos requeridos", "Completa ambos campos.");
      return;
    }
    try {
      await changePassword.mutateAsync({
        newPassword: newPass,
        confirmPassword: confirmPass,
      });
      Alert.alert("Éxito", "Contraseña actualizada correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "No se pudo cambiar la contraseña.");
    }
  };

  const focusedStyle = (field: "new" | "confirm") => ({
    borderColor: focusedField === field ? "#1B3A6B" : "#e0e0e0",
    transform: [{ scale: focusedField === field ? 1.02 : 1 }],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.header}>
          <LottieView
            source={{ uri: "https://assets2.lottiefiles.com/packages/lf20_l3q3xz9q.json" }}
            autoPlay
            loop
            style={{ width: 140, height: 140 }}
          />
          <Text style={styles.title}>Cambiar contraseña</Text>
          <Text style={styles.subtitle}>Ingresa tu nueva contraseña</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputRow, focusedStyle("new")]}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry={!showNew}
              onFocus={() => setFocusedField("new")}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowNew((p) => !p)} style={styles.toggle}>
              <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputRow, focusedStyle("confirm")]}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry={!showConfirm}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowConfirm((p) => !p)} style={styles.toggle}>
              <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleChange}
            disabled={changePassword.isPending}
            activeOpacity={0.8}
            style={styles.changeBtn}
          >
            <Text style={styles.changeBtnText}>
              {changePassword.isPending ? "Cambiando..." : "Cambiar contraseña"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { padding: 16, gap: 16 },
  back: { alignSelf: "flex-start", marginBottom: 4 },
  header: { alignItems: "center", gap: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#666" },
  form: { gap: 12 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingRight: 8,
  },
  input: { flex: 1, padding: 12, fontSize: 16 },
  toggle: { padding: 8 },
  changeBtn: {
    backgroundColor: "#1B3A6B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  changeBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
