import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import * as WebBrowser from "expo-web-browser";
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
        // 1. Extractor manual a prueba de fallos (lee tanto '?' como '#')
        const extractParams = (url: string) => {
          const paramString = url.split('#')[1] || url.split('?')[1] || '';
          const params: Record<string, string> = {};
          paramString.split('&').forEach(part => {
            const [key, value] = part.split('=');
            if (key) params[key] = decodeURIComponent(value || '');
          });
          return params;
        };

        const params = extractParams(result.url);

        // 2. Procesamos el "cheque" (PKCE) o el "efectivo" directo (Implicit)
        if (params.code) {
          const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(params.code);
          if (sessionError) throw sessionError;

          if (sessionData?.session) {
            queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
          }
        } else if (params.access_token && params.refresh_token) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (sessionError) throw sessionError;

          if (sessionData?.session) {
            queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
          }
        } else {
          // Si llegamos aquí, mostramos exactamente qué nos devolvió Google para no estar ciegos
          throw new Error("No se encontraron tokens. URL devuelta: " + result.url);
        }
      }
    },
  });
};