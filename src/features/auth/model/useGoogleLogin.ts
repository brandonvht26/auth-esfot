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

      if (result.type !== "success" || !result.url) {
        throw new Error("Login cancelado");
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(result.url);

      if (sessionError) throw sessionError;

      if (sessionData?.session) {
        queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
      }
    },
  });
};
