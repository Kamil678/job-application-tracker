import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/landing/status-badge";
import { ArrowRight, MapPin, CalendarDays } from "lucide-react";
import Link from "next/link";

const JOBS = [
  { company: "Spotify", role: "Frontend Developer", location: "Remote", date: "Apr 28", initial: "S", color: "#1DB954", status: "applied" },
  {
    company: "Figma",
    role: "Senior React Dev",
    location: "San Francisco",
    date: "May 5",
    initial: "F",
    color: "#F24E1E",
    status: "interview",
  },
  { company: "Linear", role: "Staff Engineer", location: "New York", date: "May 10", initial: "L", color: "#5E6AD2", status: "offer" },
  { company: "Notion", role: "Lead Developer", location: "Remote", date: "Apr 20", initial: "N", color: "#000000", status: "rejected" },
] as const;

export function Hero() {
  return (
    <section className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <div className="space-y-7">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-xs font-semibold text-primary tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Now in public beta
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
            Track every <span className="text-primary">application.</span>
            <br />
            Land the job.
          </h1>

          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Stop losing track of where you applied. Hirely keeps your entire job search organized — applications, interviews, offers, all in
            one place.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2 shadow-lg shadow-blue-200 px-7">
                Start for free
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border text-foreground px-7">
              See how it works
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">No credit card required · Free forever plan · 2 min setup</p>
        </div>

        {/* Right — floating UI card */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Glow */}
          <div className="absolute inset-0 bg-blue-400/10 blur-[80px] rounded-full scale-75 translate-y-8" />

          <div
            className="relative w-full max-w-md rounded-2xl border border-border bg-white shadow-2xl shadow-blue-100/60 p-5 animate-float"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">My applications</span>
              <span className="text-xs text-muted-foreground">4 active</span>
            </div>

            {/* Rows */}
            <div className="space-y-2.5">
              {JOBS.map((job) => (
                <div
                  key={job.company}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border hover:border-blue-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: job.color }}
                    >
                      {job.initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{job.role}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{job.company}</span>
                        <span className="text-xs text-muted-foreground/50">·</span>
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <MapPin size={9} />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={job.status} />
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <CalendarDays size={9} />
                      {job.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Response rate</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
                <span className="text-xs font-semibold text-foreground">75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
