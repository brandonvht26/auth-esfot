import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { SESSION_QUERY_KEY } from "@/features/session/model/useSession";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      new Promise<void>(async (resolve, reject) => {
        const redirectTo = "authesfot://auth/callback";

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo, skipBrowserRedirect: true },
        });
        if (error) return reject(error);

        // Escuchar el deep link de retorno
        const subscription = Linking.addEventListener("url", async ({ url }) => {
          if (!url.includes("authesfot://")) return;
          subscription.remove();
          await WebBrowser.dismissBrowser();

          // Intentar extraer tokens del URL
          const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(url);

          if (sessionError) {
            // Si falla el exchange, esperar onAuthStateChange
            const { data: { subscription: authSub } } =
              supabase.auth.onAuthStateChange((_, session) => {
                if (session) {
                  authSub.unsubscribe();
                  queryClient.setQueryData(SESSION_QUERY_KEY, session);
                  resolve();
                }
              });
            setTimeout(() => {
              authSub.unsubscribe();
              reject(new Error("Timeout de sesión"));
            }, 8000);
            return;
          }

          if (sessionData?.session) {
            queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
          }
          resolve();
        });

        // Timeout por si el usuario cierra sin elegir cuenta
        setTimeout(() => {
          subscription.remove();
          reject(new Error("Login cancelado"));
        }, 120000);

        // Abrir browser
        await WebBrowser.openBrowserAsync(data.url);
      }),
  });
};