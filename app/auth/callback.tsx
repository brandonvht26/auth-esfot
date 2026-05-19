import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "@/shared/api/supabase";

export default function AuthCallback() {
  const params = useLocalSearchParams();

  useEffect(() => {
    const url = `authesfot://auth/callback?${new URLSearchParams(params as any).toString()}`;
    supabase.auth.exchangeCodeForSession(url).then(async ({ data, error }) => {
      if (data?.session) {
        router.replace("/home");
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        router.replace("/home");
      } else {
        router.replace("/(auth)/login");
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
