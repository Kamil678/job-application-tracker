import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const FREE_FEATURES = ["Up to 20 applications", "Basic status tracking", "Manual entry", "CSV export"];

const PRO_FEATURES = [
  "Unlimited applications",
  "Kanban board view",
  "Interview notes & reminders",
  "Analytics dashboard",
  "Salary insights",
  "Priority support",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">Simple, transparent pricing.</h2>
        <p className="text-lg text-muted-foreground">Start free. Upgrade when you're ready.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-white p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Free</h3>
            <p className="text-sm text-muted-foreground mb-5">For individuals getting started.</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground mb-1">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Check size={14} className="text-emerald-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <Button size="lg" variant="outline" className="w-full border-border">
            Get started free
          </Button>
        </div>

        {/* Pro */}
        <div className="rounded-2xl bg-primary p-8 flex flex-col relative shadow-2xl shadow-blue-300/40">
          <div className="absolute top-5 right-5 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Most popular
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
            <p className="text-sm text-white/70 mb-5">For serious job seekers.</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-white">$6</span>
              <span className="text-white/70 mb-1">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
                <Check size={14} className="text-white shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 font-semibold cursor-pointer">
            Start Pro trial <ArrowRight className="ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
