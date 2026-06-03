import Link from "next/link";
import { Logo } from "@/components/logo";

const STATS = [
  { value: "12k+", label: "users" },
  { value: "94%", label: "satisfaction" },
  { value: "3×", label: "faster" },
] as const;

export function AuthBrandHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-5 max-w-120">
      <Logo variant="light" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight leading-tight text-sidebar-foreground">
          Take control of your <span className="text-sidebar-primary">job search.</span>
        </h1>
        <p className="text-sm text-sidebar-foreground leading-relaxed opacity-60">
          Join thousands of professionals who stopped losing track and started landing their dream roles.
        </p>
      </div>

      <div className="flex items-center gap-8 pt-1">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold text-sidebar-foreground">{value}</p>
            <p className="text-sm mt-0.5 opacity-40 text-sidebar-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
