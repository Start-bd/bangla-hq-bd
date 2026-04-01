import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

type Business = Tables<"businesses">;

export function useMyBusinesses(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-businesses", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Business[];
    },
    enabled: !!userId,
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"businesses"> }) => {
      const { data, error } = await supabase
        .from("businesses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useBusinessViews(businessId: string | undefined) {
  return useQuery({
    queryKey: ["business-views", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data, error } = await supabase
        .from("business_views")
        .select("*")
        .eq("business_id", businessId)
        .order("viewed_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
    enabled: !!businessId,
  });
}
