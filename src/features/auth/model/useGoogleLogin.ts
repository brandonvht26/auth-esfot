import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { SESSION_QUERY_KEY } from "@/features/session/model/useSession";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = "authesfot://auth/callback";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === "success") {
        // 1. "Abrimos el sobre" usando expo-linking
        const parsedUrl = Linking.parse(result.url);

        // 2. Extraemos el "cheque"
        const code = parsedUrl.queryParams?.code;

        if (code) {
          // 3. Flujo PKCE (Por defecto en Supabase)
          const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(String(code));

          if (sessionError) throw sessionError;
          if (sessionData?.session) {
            queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
          }
        } else if (parsedUrl.queryParams?.access_token) {
          // Fallback: Flujo Implícito (Si Google devuelve los tokens directo en la URL)
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: String(parsedUrl.queryParams.access_token),
            refresh_token: String(parsedUrl.queryParams.refresh_token),
          });

          if (sessionError) throw sessionError;
          if (sessionData?.session) {
            queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
          }
        } else {
          throw new Error("No se encontró un código de autorización en la URL de retorno.");
        }
      }
    },
  });
};