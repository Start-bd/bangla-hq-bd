import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import { CheckCircle, Star, MapPin, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Business } from "@/lib/mock-data";

export default function BusinessCard({ business }: { business: Business }) {
  const { t } = useLanguage();
  const initials = business.name_en.slice(0, 2).toUpperCase();

  return (
    <Link
      to={`/${business.slug}`}
      className="block bg-card rounded-lg border border-border p-5 transition-all duration-300 hover:shadow-card-hover group"
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-heading font-bold text-lg">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {t(business.name_en, business.name_bn)}
              </h3>
              <p className="text-xs text-muted-foreground font-bengali truncate">
                {t(business.name_bn, business.name_en)}
              </p>
            </div>
            {business.is_verified && (
              <span className="flex items-center gap-1 text-xs text-secondary font-ui font-medium bg-secondary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                <CheckCircle size={12} /> {t("Verified", "যাচাইকৃত")}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-ui px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {t(business.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()), business.category_bn)}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} /> {business.district}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users size={12} /> {business.employee_range}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 font-body">
            {t(business.description_en, business.description_bn)}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-primary text-primary" />
              <span className="text-sm font-data font-medium">{business.rating_avg}</span>
              <span className="text-xs text-muted-foreground">({business.rating_count})</span>
            </div>
            <span className="text-xs text-primary font-ui font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {t("View Profile", "প্রোফাইল দেখুন")} <ExternalLink size={12} />
            </span>
          </div>
        </div>
      </div>
      {business.is_featured && (
        <div className="mt-3 pt-3 border-t border-primary/20">
          <span className="text-xs font-ui font-medium text-primary">⭐ {t("Featured Business", "ফিচার্ড ব্যবসা")}</span>
        </div>
      )}
    </Link>
  );
}
