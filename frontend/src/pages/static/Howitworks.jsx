import { BookmarkPlus, PhoneCall, Route, SearchCheck } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const steps = [
  {
    icon: SearchCheck,
    number: "01",
    title: "Search the map, not just a list",
    body: "Filter by price, location, and property type. Every listing shows up as a pin, so you see exactly where it sits in the valley before you click in.",
  },
  {
    icon: BookmarkPlus,
    number: "02",
    title: "Compare and save",
    body: "Open a listing to see photos, price, and details. Save the ones you like so you can come back and compare later.",
  },
  {
    icon: PhoneCall,
    number: "03",
    title: "Contact the owner directly",
    body: "Reach out to the property owner straight from the listing page — no middleman, no waiting on a broker to call back.",
  },
];

export default function HowItWorks() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1080px] space-y-6">
        {/* HERO */}
        <section
          className="
            relative overflow-hidden rounded-[30px]
            border border-black/[0.06]
            bg-gradient-to-br
            from-[#f3f2ee] via-[#e9e8e4] to-[#d8d7d3]
            px-6 py-8
            shadow-[0_20px_60px_rgba(20,23,31,0.055)]
            sm:px-8 sm:py-10
            dark:border-white/[0.06]
            dark:from-[#1c1f26]
            dark:via-[#181b20]
            dark:to-[#121419]
            dark:shadow-none
          "
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50 blur-3xl dark:bg-white/[0.03]" />

          <div className="relative max-w-2xl">
            <span
              className="
                flex h-11 w-11 items-center justify-center
                rounded-2xl
                border border-black/[0.07]
                bg-white/55
                text-[#202226]
                shadow-[0_10px_28px_rgba(20,23,31,0.055)]
                dark:border-white/[0.08]
                dark:bg-white/[0.05]
                dark:text-white
              "
            >
              <Route size={18} strokeWidth={1.8} />
            </span>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
              How Rentora works
            </p>

            <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[38px] dark:text-white">
              From search to visit in three steps.
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
              Discover the right area, save the places worth considering and
              contact the property owner directly.
            </p>
          </div>
        </section>

        {/* STEPS */}
        <section
          className="
            rounded-[26px]
            border border-black/[0.07]
            bg-white/[0.52]
            p-5
            shadow-[0_18px_52px_rgba(20,23,31,0.045)]
            backdrop-blur
            sm:p-7
            dark:border-white/[0.07]
            dark:bg-white/[0.025]
            dark:shadow-none
          "
        >
          <div className="relative">
            <div
              className="
                absolute bottom-8 left-[19px] top-8
                hidden w-px
                bg-black/[0.08]
                sm:block
                dark:bg-white/[0.08]
              "
              aria-hidden="true"
            />

            <div className="space-y-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="
                      relative grid gap-4
                      rounded-[22px]
                      px-1 py-5
                      sm:grid-cols-[40px_minmax(0,1fr)_70px]
                      sm:gap-5
                    "
                  >
                    <span
                      className="
                        relative z-10
                        flex h-10 w-10 items-center justify-center
                        rounded-[14px]
                        border border-black/[0.07]
                        bg-[#f8f7f4]
                        text-[#2b2d31]/58
                        dark:border-white/[0.08]
                        dark:bg-[#1c1f25]
                        dark:text-white/50
                      "
                    >
                      <Icon size={16} strokeWidth={1.8} />
                    </span>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/34 dark:text-white/30">
                        Step {step.number}
                      </p>

                      <h2 className="mt-1.5 font-display text-[18px] font-bold tracking-[-0.03em] text-[#202226] dark:text-white">
                        {step.title}
                      </h2>

                      <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#2b2d31]/52 dark:text-white/44">
                        {step.body}
                      </p>
                    </div>

                    <span className="hidden justify-self-end font-display text-[30px] font-bold tracking-[-0.05em] text-[#202226]/10 sm:block dark:text-white/10">
                      {step.number}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* END STATEMENT */}
        <section
          className="
            relative overflow-hidden
            rounded-[24px]
            border border-black/[0.07]
            bg-[#202226]
            px-6 py-7
            text-white
            dark:border-white/[0.07]
            dark:bg-[#111318]
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/[0.05] blur-3xl" />

          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
              The idea
            </p>

            <p className="mt-3 max-w-2xl font-display text-[21px] font-bold leading-8 tracking-[-0.035em]">
              Spend less time figuring out where a property is and more time
              deciding whether it actually works for you.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
