import { Building2, MapPinned, MessagesSquare, Landmark } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const pillars = [
  {
    icon: MapPinned,
    title: "Map-first search",
    body: "Every listing shows up as a pin, so you see price, location, and distance together before clicking in.",
  },
  {
    icon: MessagesSquare,
    title: "Direct contact",
    body: "Reach out to owners straight from a listing — no middleman, no broker in between.",
  },
  {
    icon: Landmark,
    title: "Built for the valley",
    body: "Designed around how people actually search for housing in Kathmandu — by neighborhood, not zip code.",
  },
];

export default function About() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-8 sm:py-12">
        {/* HERO */}
        <div className="flex flex-col items-start gap-4 mb-10">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brass-light to-brass flex items-center justify-center shadow-[0_8px_20px_rgba(15,122,108,0.18)]">
            <Building2 size={22} className="text-ivory" strokeWidth={1.75} />
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            About Rentora
          </h1>
        </div>

        {/* INTRO */}
        <div className="max-w-2xl">
          <p className="text-[15px] sm:text-base leading-7 text-text/70">
            Rentora is a rental search platform built around the Kathmandu
            valley housing market. Instead of scrolling endless listings with no
            sense of where they actually are, Rentora puts the map first — so
            you can see price, location, and commute distance together before
            you ever click into a listing.
          </p>

          <p className="text-[15px] sm:text-base leading-7 text-text/70 mt-5">
            We're just getting started, and we're building this with renters and
            property owners in the valley in mind — from students looking for a
            shared room near Koteshwor to families searching for a flat in
            Boudha.
          </p>
        </div>

        {/* PILLARS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-stone bg-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(20,20,26,0.06)]"
            >
              <span className="w-10 h-10 rounded-xl bg-brass-light flex items-center justify-center mb-4">
                <pillar.icon
                  size={18}
                  className="text-brass"
                  strokeWidth={1.75}
                />
              </span>

              <h3 className="font-semibold text-sm text-text mb-1.5">
                {pillar.title}
              </h3>

              <p className="text-[13px] leading-relaxed text-text/60">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
