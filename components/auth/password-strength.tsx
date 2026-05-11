import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number or special character", test: (p: string) => /[0-9!@#$%^&*]/.test(p) },
] as const;

const STRENGTH_CONFIG = [
  { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Medium", bar: "bg-chart-4", text: "text-chart-4" },
  { label: "Strong", bar: "bg-chart-3", text: "text-chart-3" },
] as const;

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password.length) return null;

  const strength = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const config = STRENGTH_CONFIG[strength - 1];

  return (
    <div className="space-y-2 pt-1">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i < strength ? config.bar : "bg-border")} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex flex-col gap-x-3 gap-y-1">
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(password);

            return (
              <span
                key={rule.label}
                className={cn("flex items-center gap-1 text-[11px] transition-colors", passed ? "text-chart-3" : "text-muted-foreground")}
              >
                {passed ? <Check size={9} className="shrink-0" /> : <X size={9} className="shrink-0 opacity-70" />}

                {rule.label}
              </span>
            );
          })}
        </div>

        {strength > 0 && <span className={cn("text-[10px] font-semibold shrink-0", config.text)}>{config.label}</span>}
      </div>
    </div>
  );
}
