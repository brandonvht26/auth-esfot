import { useState } from "react";
import { SafeAreaView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { YStack, XStack, Text, Button, Input } from "tamagui";
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
      <YStack flex={1} padding="$4" gap="$4">
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text fontSize={24}>←</Text>
        </TouchableOpacity>

        <YStack alignItems="center" gap="$2" marginBottom="$4">
          <LottieView
            source={{ uri: "https://assets2.lottiefiles.com/packages/lf20_l3q3xz9q.json" }}
            autoPlay
            loop
            style={{ width: 140, height: 140 }}
          />
          <Text fontSize={22} fontWeight="700">Cambiar contraseña</Text>
          <Text fontSize={14} color="$color11">Ingresa tu nueva contraseña</Text>
        </YStack>

        <YStack gap="$3">
          <XStack alignItems="center" backgroundColor="$background" borderRadius="$4" borderWidth={1} borderColor="$borderColor" paddingRight="$2">
            <Input
              flex={1}
              placeholder="Nueva contraseña"
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry={!showNew}
              borderWidth={0}
              backgroundColor="transparent"
              size="$4"
            />
            <TouchableOpacity onPress={() => setShowNew((p) => !p)} style={styles.toggle}>
              <Text fontSize={18}>{showNew ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </XStack>

          <XStack alignItems="center" backgroundColor="$background" borderRadius="$4" borderWidth={1} borderColor="$borderColor" paddingRight="$2">
            <Input
              flex={1}
              placeholder="Confirmar contraseña"
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry={!showConfirm}
              borderWidth={0}
              backgroundColor="transparent"
              size="$4"
            />
            <TouchableOpacity onPress={() => setShowConfirm((p) => !p)} style={styles.toggle}>
              <Text fontSize={18}>{showConfirm ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </XStack>

          <Button
            onPress={handleChange}
            backgroundColor="$blue9"
            color="white"
            size="$4"
            marginTop="$2"
            disabled={changePassword.isPending}
          >
            {changePassword.isPending ? "Cambiando..." : "Cambiar contraseña"}
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  back: { alignSelf: "flex-start" },
  toggle: { paddingHorizontal: 12, paddingVertical: 13 },
});
