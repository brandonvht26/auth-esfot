import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import { TASKS_QUERY_KEY } from "./useTasks";
import type { Task } from "@/entities/task/model/types";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert({ title, description })
        .select()
        .single();
      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};
