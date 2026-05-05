import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is Hirely really free?",
    a: "Yes — the Free plan is free forever with no hidden costs. You get up to 20 active applications, basic status tracking, and CSV export without a credit card.",
  },
  {
    q: "Can I import from a spreadsheet?",
    a: "Absolutely. You can import a CSV file with your existing applications from the Settings → Import panel. We support standard column names like company, role, status, and date.",
  },
  {
    q: "Is my data private?",
    a: "100%. We use AES-256 encryption at rest and in transit. Your career data is never shared with or sold to any third parties — ever.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Of course. There are no lock-in contracts. Cancel your Pro subscription at any time and your data stays intact on the Free plan.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes — Hirely is fully responsive and works great on any screen size. A dedicated iOS and Android app is on the roadmap for later this year.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-28 bg-secondary">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight text-foreground text-center mb-14">Frequently asked questions</h2>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-white rounded-xl border border-border px-5 data-[state=open]:border-blue-200 "
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4 cursor-pointer">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
