import {
  FileText,
  KeyRound,
  ListChecks,
  Scale,
  ShieldAlert,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const sections = [
  {
    id: "using-thegana",
    number: "01",
    icon: ListChecks,
    title: "Using Thegana",
    body: "Thegana is a place for renters and property owners to find and contact each other. When you create an account or post a property, please make sure the information you provide is accurate.",
  },
  {
    id: "listings",
    number: "02",
    icon: ShieldAlert,
    title: "Property listings",
    body: "Owners are responsible for the information in their listings, including the rent, photos, location and availability. Please don't list a property you don't own or don't have permission to advertise.",
  },
  {
    id: "account-responsibility",
    number: "03",
    icon: KeyRound,
    title: "Your account",
    body: "Keep your login details private and let us know if you think someone else has gained access to your account. Activity carried out through your account is your responsibility.",
  },
  {
    id: "rental-agreements",
    number: "04",
    icon: Scale,
    title: "Renting a property",
    body: "Thegana helps renters and owners find and contact each other, but we're not part of the rental agreement between them. Rent, deposits, payments and other arrangements should be confirmed directly between the renter and the owner.",
  },
];

export default function Terms() {
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
              <FileText size={18} strokeWidth={1.8} />
            </span>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
              Terms
            </p>

            <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[38px] dark:text-white">
              Terms of service
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
              A few basic rules to keep Thegana useful and safe for both renters
              and property owners.
            </p>

            <p className="mt-4 text-[10px] font-medium text-[#2b2d31]/36 dark:text-white/32">
              Last updated: August 2026
            </p>
          </div>
        </section>

        {/* DOCUMENT */}
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div
              className="
                sticky top-24
                rounded-[22px]
                border border-black/[0.07]
                bg-white/[0.48]
                p-4
                dark:border-white/[0.07]
                dark:bg-white/[0.025]
              "
            >
              <p className="px-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/34 dark:text-white/30">
                On this page
              </p>

              <nav className="mt-3 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="
                      flex items-center gap-2
                      rounded-xl
                      px-2 py-2.5
                      text-[10px] font-medium
                      text-[#2b2d31]/48
                      no-underline
                      transition-colors
                      hover:bg-black/[0.035]
                      hover:text-[#202226]
                      dark:text-white/42
                      dark:hover:bg-white/[0.04]
                      dark:hover:text-white
                    "
                  >
                    <span className="font-display text-[9px] font-bold text-[#2b2d31]/24 dark:text-white/20">
                      {section.number}
                    </span>

                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="
                    scroll-mt-24
                    rounded-[24px]
                    border border-black/[0.07]
                    bg-white/[0.52]
                    p-5
                    shadow-[0_14px_38px_rgba(20,23,31,0.035)]
                    sm:p-6
                    dark:border-white/[0.07]
                    dark:bg-white/[0.025]
                    dark:shadow-none
                  "
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <span
                        className="
                          flex h-9 w-9 shrink-0 items-center justify-center
                          rounded-[13px]
                          border border-black/[0.06]
                          bg-white/55
                          text-[#2b2d31]/55
                          dark:border-white/[0.07]
                          dark:bg-white/[0.04]
                          dark:text-white/48
                        "
                      >
                        <Icon size={15} strokeWidth={1.8} />
                      </span>

                      <div>
                        <h2 className="text-[14px] font-semibold text-[#202226] dark:text-white">
                          {section.title}
                        </h2>

                        <p className="mt-3 text-[12px] leading-6 text-[#2b2d31]/52 dark:text-white/44">
                          {section.body}
                        </p>
                      </div>
                    </div>

                    <span className="hidden font-display text-[10px] font-bold text-[#2b2d31]/22 sm:block dark:text-white/18">
                      {section.number}
                    </span>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
