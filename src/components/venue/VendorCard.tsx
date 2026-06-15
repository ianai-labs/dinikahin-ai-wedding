import type { Vendor } from "@/types";
import { formatCurrency } from "@/lib/utils/formatters";

interface VendorCardProps {
  vendor: Vendor;
}

const categoryEmoji: Record<string, string> = {
  Decoration: "💐",
  "Makeup Artist": "💄",
  Entertainment: "🎵",
  Photography: "📸",
  Catering: "🍽️",
};

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 hover:border-[#E8D5B7] transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{categoryEmoji[vendor.category] || "📦"}</span>
        <div>
          <p className="font-semibold text-sm">{vendor.vendorName}</p>
          <p className="text-xs text-muted-foreground">{vendor.category}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatCurrency(vendor.priceRange.min, vendor.priceRange.currency)} –{" "}
            {formatCurrency(vendor.priceRange.max, vendor.priceRange.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
