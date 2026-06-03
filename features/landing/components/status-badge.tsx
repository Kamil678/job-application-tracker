type Status = "applied" | "interview" | "offer" | "rejected" | "ghost";

const CONFIG: Record<Status, { label: string; bg: string; color: string; dot: string }> = {
  applied: { label: "Applied", bg: "#EFF6FF", color: "#2563EB", dot: "#2563EB" },
  interview: { label: "Interview", bg: "#FFF8EC", color: "#D97706", dot: "#D97706" },
  offer: { label: "Offer", bg: "#ECFDF5", color: "#059669", dot: "#059669" },
  rejected: { label: "Rejected", bg: "#FFF1F2", color: "#E11D48", dot: "#E11D48" },
  ghost: { label: "No reply", bg: "#F4F5F8", color: "#6B7280", dot: "#9CA3AF" },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
      style={{ background: c.bg, color: c.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}
