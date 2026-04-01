import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/lib/mock-data";

// Map DB row to the Business interface used by components
function mapRow(row: any): Business {
  return {
    id: row.id,
    slug: row.slug,
    name_en: row.name_en,
    name_bn: row.name_bn,
    tagline_en: row.tagline_en ?? "",
    tagline_bn: row.tagline_bn ?? "",
    description_en: row.description_en ?? "",
    description_bn: row.description_bn ?? "",
    category: row.category,
    category_bn: row.category_bn ?? "",
    division: row.division ?? "",
    district: row.district ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    website_url: row.website_url ?? "",
    facebook_url: row.facebook_url ?? "",
    logo_url: row.logo_url ?? "",
    founded_year: row.founded_year ?? 0,
    employee_range: row.employee_range ?? "",
    is_verified: row.is_verified ?? false,
    is_claimed: row.is_claimed ?? false,
    is_featured: row.is_featured ?? false,
    is_startup: row.is_startup ?? false,
    rating_avg: Number(row.rating_avg) || 0,
    rating_count: row.rating_count ?? 0,
    view_count: row.view_count ?? 0,
    services: Array.isArray(row.services) ? row.services : [],
    tags: row.tags ?? [],
  };
}

export function useBusinesses(filters?: {
  category?: string | null;
  division?: string | null;
  search?: string;
  featured?: boolean;
  startup?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["businesses", filters],
    queryFn: async () => {
      let query = supabase.from("businesses").select("*").eq("status", "active");

      if (filters?.category) query = query.eq("category", filters.category);
      if (filters?.division) query = query.eq("division", filters.division);
      if (filters?.featured) query = query.eq("is_featured", true);
      if (filters?.startup) query = query.eq("is_startup", true);
      if (filters?.search) {
        const sanitized = filters.search.replace(/[%_\\,()]/g, "");
        if (sanitized.length > 0 && sanitized.length <= 100) {
          query = query.or(`name_en.ilike.%${sanitized}%,name_bn.ilike.%${sanitized}%`);
        }
      }
      if (filters?.limit) query = query.limit(filters.limit);

      query = query.order("is_featured", { ascending: false }).order("rating_avg", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function useBusinessBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["business", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    },
    enabled: !!slug,
  });
}

export function useBusinessStats() {
  return useQuery({
    queryKey: ["business-stats"],
    queryFn: async () => {
      const { count: totalCount } = await supabase
        .from("businesses")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      const { count: verifiedCount } = await supabase
        .from("businesses")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true);

      return {
        total: totalCount ?? 0,
        verified: verifiedCount ?? 0,
        districts: 64,
        connections: 3800,
      };
    },
  });
}
