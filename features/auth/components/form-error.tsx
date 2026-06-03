import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFormErrorProps {
  message?: string;
  className?: string;
}

export function AuthFormError({ message, className }: AuthFormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn("flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm bg-status-rejected-bg text-status-rejected-fg", className)}
    >
      <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
