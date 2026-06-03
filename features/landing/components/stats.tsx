const STATS = [
  { value: "12,000+", label: "Job seekers organized" },
  { value: "94%", label: "Say they miss fewer follow-ups" },
  { value: "3×", label: "Faster job search on average" },
];

export function Stats() {
  return (
    <section className="py-24 bg-sidebar text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-5xl font-bold tracking-tight text-blue-600 mb-2">{value}</p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
