import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-28 max-w-7xl mx-auto px-6">
      <div className="relative rounded-3xl overflow-hidden bg-sidebar px-8 py-24 text-center">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,136,229,0.25)_0%,_transparent_70%)]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-5xl font-bold tracking-tight text-white mb-5 leading-tight">Your next job starts here.</h2>
          <p className="text-lg text-slate-400 mb-10">Join thousands of developers and designers who stopped losing track.</p>
          <Button size="lg" className="gap-2 px-10 shadow-2xl shadow-blue-500/30">
            Create free account
            <ArrowRight size={16} />
          </Button>
          <p className="mt-5 text-sm text-slate-500">No credit card required</p>
        </div>
      </div>
    </section>
  );
}
