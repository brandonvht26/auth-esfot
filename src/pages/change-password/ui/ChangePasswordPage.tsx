import { useState } from "react";
import { SafeAreaView, TouchableOpacity, Alert, StyleSheet, View, Text, TextInput } from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { useChangePassword } from "@/features/auth/model/useChangePassword";

export const ChangePasswordPage = () => {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backArrow}>←</Text>
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
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry={!showNew}
            />
            <TouchableOpacity onPress={() => setShowNew((p) => !p)} style={styles.toggle}>
              <Text style={styles.toggleText}>{showNew ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm((p) => !p)} style={styles.toggle}>
              <Text style={styles.toggleText}>{showConfirm ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleChange}
            disabled={changePassword.isPending}
            style={styles.changeBtn}
          >
            <Text style={styles.changeBtnText}>
              {changePassword.isPending ? "Cambiando..." : "Cambiar contraseña"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1, padding: 16, gap: 16 },
  back: { alignSelf: "flex-start" },
  backArrow: { fontSize: 24 },
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
  toggle: { paddingHorizontal: 12, paddingVertical: 13 },
  toggleText: { fontSize: 18 },
  changeBtn: {
    backgroundColor: "#1B3A6B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  changeBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
