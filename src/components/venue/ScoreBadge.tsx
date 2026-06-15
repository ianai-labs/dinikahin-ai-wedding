import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const colorClass =
    score >= 80
      ? "bg-green-100 text-green-700 border-green-200"
      : score >= 50
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-red-100 text-red-700 border-red-200";

  const sizeClass =
    size === "lg"
      ? "text-base px-3 py-1.5"
      : size === "sm"
        ? "text-xs px-2 py-0.5"
        : "text-sm px-2.5 py-1";

  return (
    <span className={cn("inline-flex items-center gap-1 font-semibold rounded-full border", colorClass, sizeClass)}>
      <Star className={cn("fill-current", size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
      {score}%
    </span>
  );
}
