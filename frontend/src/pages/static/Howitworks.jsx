import { Route, SearchCheck, BookmarkPlus, PhoneCall } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const steps = [
  {
    icon: SearchCheck,
    title: "Search the map, not just a list",
    body: "Filter by price, location, and property type. Every listing shows up as a pin, so you see exactly where it sits in the valley before you click in.",
  },
  {
    icon: BookmarkPlus,
    title: "Compare and save",
    body: "Open a listing to see photos, price, and details. Save the ones you like so you can come back and compare later.",
  },
  {
    icon: PhoneCall,
    title: "Contact the owner directly",
    body: "Reach out to the property owner straight from the listing page — no middleman, no waiting on a broker to call back.",
  },
];

export default function HowItWorks() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 sm:py-12">
        {/* HERO */}
        <div className="flex flex-col items-start gap-4 mb-12">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brass-light to-brass flex items-center justify-center shadow-[0_8px_20px_rgba(15,122,108,0.18)]">
            <Route size={22} className="text-ivory" strokeWidth={1.75} />
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            How it works
          </h1>
        </div>

        {/* STEPS */}
        <div className="relative flex flex-col gap-8">
          {/* connecting line */}
          <div
            className="absolute left-[23px] top-4 bottom-4 w-px bg-stone"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div key={step.title} className="relative flex gap-5">
              <span className="relative z-10 shrink-0 w-12 h-12 rounded-2xl border border-stone bg-bg flex items-center justify-center shadow-[0_1px_2px_rgba(20,20,26,0.04)]">
                <step.icon
                  size={19}
                  className="text-brass"
                  strokeWidth={1.75}
                />
              </span>

              <div className="pt-1.5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-display text-xs font-bold text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[17px] font-semibold text-text">
                    {step.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-text/65 max-w-md">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
