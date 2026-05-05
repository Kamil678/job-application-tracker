const COMPANIES = ["Google", "Meta", "Stripe", "Vercel", "Figma", "Linear", "Shopify"];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-secondary py-7">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-6">
          Trusted by job seekers at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {COMPANIES.map((name) => (
            <span
              key={name}
              className="text-base font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default select-none tracking-tight"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
