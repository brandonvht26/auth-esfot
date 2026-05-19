import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import type { Task } from "@/entities/task/model/types";

export const TASKS_QUERY_KEY = ["tasks"];

export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
