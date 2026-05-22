import type { ProfileUser } from "./types";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-lg bg-background border border-border">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export function ProfileStats({
  applicationsCount,
  interviewsCount,
  offersCount,
}: Pick<ProfileUser, "applicationsCount" | "interviewsCount" | "offersCount">) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Applications sent" value={applicationsCount} color="text-foreground" />
      <StatCard label="Interviews" value={interviewsCount} color="text-status-interview-fg" />
      <StatCard label="Offers received" value={offersCount} color="text-status-offer-fg" />
    </div>
  );
}
