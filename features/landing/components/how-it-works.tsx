const STEPS = [
  {
    n: "1",
    title: "Add an application",
    desc: "Paste the job URL or fill in company + role. Takes 10 seconds — no browser extension required.",
  },
  {
    n: "2",
    title: "Track your status",
    desc: "Move applications through stages: Applied → Interview → Offer or Rejected. Always know where you stand.",
  },
  {
    n: "3",
    title: "Land the job",
    desc: "Use notes and reminders to stay sharp before every interview. Hirely handles the rest.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground">Up and running in under two minutes.</p>
        </div>

        <div className="relative flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Dashed connector — desktop only */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] border-t-2 border-dashed border-blue-200 z-0" />

          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="flex-1 text-center relative z-10">
              <div className="w-16 h-16 rounded-2xl border-2 border-blue-200 bg-white flex items-center justify-center text-primary font-bold text-xl mx-auto mb-5 shadow-sm shadow-blue-100">
                {n}
              </div>
              <h4 className="text-base font-semibold text-foreground mb-2">{title}</h4>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
