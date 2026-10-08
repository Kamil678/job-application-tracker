import { Label } from "@/components/ui/label";

export const INPUT_CLASS = "h-10 bg-card border-border focus-visible:ring-ring";

export const TEXTAREA_CLASS =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring transition-colors resize-none";

export function FormField({
  label,
  id,
  error,
  suffix,
  children,
}: {
  label: string;
  id?: string;
  error?: string;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {suffix ? (
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </Label>
          {suffix}
        </div>
      ) : (
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
