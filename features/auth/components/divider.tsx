interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label = "or continue with email" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={label}>
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
