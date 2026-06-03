import { cn } from "@/lib/utils";
import type { BadgeVariant } from "./nav-config";

const badgeStyles: Record<BadgeVariant, string> = {
  primary: "bg-sidebar-primary text-white",
  warning: "bg-[rgba(245,127,23,0.25)] text-[#ffd54f]",
  info: "bg-[rgba(30,136,229,0.18)] text-[#64b5f6]",
};

interface NavBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function NavBadge({ children, variant = "primary" }: NavBadgeProps) {
  return (
    <div className={cn("text-[10px] flex items-center justify-center w-5 h-5 font-semibold px-1.5 py-px rounded-sm", badgeStyles[variant])}>
      <span>{children}</span>
    </div>
  );
}
