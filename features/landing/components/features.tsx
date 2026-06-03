import { LayoutGrid, BarChart2, Bell, BookOpen, TrendingUp, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Kanban pipeline",
    desc: "Visualize your entire search as a drag-and-drop board. Move cards as you progress from applied to offer.",
    color: "bg-blue-50 text-[var(--primary)]",
  },
  {
    icon: BarChart2,
    title: "Analytics dashboard",
    desc: "Data-driven insight into response rates, interview conversion, and average time-to-offer.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Bell,
    title: "Smart reminders",
    desc: "Automatic nudges for follow-ups so you never let a warm lead go cold before an interview.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BookOpen,
    title: "Interview notes",
    desc: "Log questions asked, your answers, and impressions right after each interview while it's fresh.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Market insights",
    desc: "Benchmark your salary expectations against real-time industry data and see where you stand.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    desc: "Your job search is nobody else's business. All data is AES-256 encrypted and never sold.",
    color: "bg-slate-50 text-slate-600",
  },
];

export function Features() {
  return (
    <section id="features" className="py-28 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">Everything you need to level up.</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Focus on the interview — Hirely handles the logistics of the hunt.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
          <div
            key={title}
            className="group p-7 rounded-2xl border border-border bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${color} group-hover:scale-110 transition-transform`}
            >
              <Icon size={20} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
