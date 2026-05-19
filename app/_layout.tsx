import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { TamaguiProvider } from "tamagui";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { QueryProvider } from "@/core/providers/QueryProvider";
import { useSession } from "@/features/session/model/useSession";
import tamaguiConfig from "../tamagui.config";

function AuthGuard() {
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace("/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, isLoading]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (url.includes("authesfot://")) {
        WebBrowser.dismissBrowser();
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="auth/callback" />
          <Stack.Screen name="home" />
          <Stack.Screen name="index" />
        </Stack>
        <AuthGuard />
      </QueryProvider>
    </TamaguiProvider>
  );
}