import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      newPassword,
      confirmPassword,
    }: {
      newPassword: string;
      confirmPassword: string;
    }) => {
      if (newPassword !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
  });
};
