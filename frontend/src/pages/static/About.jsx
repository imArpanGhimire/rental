import { Building2, Landmark, MapPinned, MessagesSquare } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const pillars = [
  {
    icon: MapPinned,
    number: "01",
    title: "Know where the property is",
    body: "Owners mark the property on the map, so you can check the location and rent before opening the full listing.",
  },
  {
    icon: MessagesSquare,
    number: "02",
    title: "Talk to the owner",
    body: "Interested in a place? Contact the property owner directly instead of going through a middleman.",
  },
  {
    icon: Landmark,
    number: "03",
    title: "Search where you want",
    body: "You're not limited to a fixed list of areas. Search the map around the place where you actually want to live.",
  },
];

export default function About() {
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

          <div className="pointer-events-none absolute -bottom-28 left-[30%] h-64 w-64 rounded-full bg-white/30 blur-3xl dark:bg-white/[0.02]" />

          <div className="relative max-w-3xl">
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
              <Building2 size={18} strokeWidth={1.8} />
            </span>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
              About Thegana
            </p>

            <h1 className="mt-2 max-w-2xl font-display text-[30px] font-bold leading-tight tracking-[-0.045em] text-[#202226] sm:text-[38px] dark:text-white">
              Finding a place to rent shouldn't be this difficult.
            </h1>

            <p className="mt-4 max-w-2xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
              Thegana is a place to find rooms, flats, apartments and homes for
              rent, with the location, photos and property details available
              before you decide whether it's worth visiting.
            </p>
          </div>
        </section>

        {/* STORY */}
        <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div
            className="
              rounded-[26px]
              border border-black/[0.07]
              bg-white/[0.52]
              p-6
              shadow-[0_18px_52px_rgba(20,23,31,0.045)]
              backdrop-blur
              sm:p-7
              dark:border-white/[0.07]
              dark:bg-white/[0.025]
              dark:shadow-none
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/38 dark:text-white/35">
              Why we built it
            </p>

            <h2 className="mt-2 font-display text-[22px] font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
              Finding the right rental can take a lot of work.
            </h2>

            <div className="mt-5 space-y-5">
              <p className="text-[13px] leading-6 text-[#2b2d31]/56 dark:text-white/47">
                Finding a place to rent often means checking scattered posts,
                asking around, calling different owners and visiting properties
                without knowing much about them beforehand. Sometimes even
                figuring out exactly where a property is can be difficult.
              </p>

              <p className="text-[13px] leading-6 text-[#2b2d31]/56 dark:text-white/47">
                Thegana puts the useful information in one place. Owners can
                mark the actual location of their property when they create a
                listing, and renters can search around the area where they want
                to live. You can check the rent, photos, location and property
                details before contacting the owner.
              </p>
            </div>
          </div>

          {/* DARK STATEMENT CARD */}
          <div
            className="
              relative overflow-hidden
              rounded-[26px]
              border border-black/[0.07]
              bg-[#202226]
              p-6
              text-white
              shadow-[0_18px_52px_rgba(20,23,31,0.08)]
              sm:p-7
              dark:border-white/[0.07]
              dark:bg-[#111318]
              dark:shadow-none
            "
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/[0.05] blur-3xl" />

            <div className="relative flex h-full min-h-[250px] flex-col">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                Before you visit
              </p>

              <p className="mt-8 font-display text-[27px] font-bold leading-[1.2] tracking-[-0.045em]">
                Check the photos.
                <br />
                Check the rent.
                <br />
                Check the location.
              </p>

              <p className="mt-auto pt-8 text-[11px] leading-5 text-white/42">
                Then talk to the owner and decide if the place is worth seeing
                in person.
              </p>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className="
                  rounded-[22px]
                  border border-black/[0.07]
                  bg-white/[0.48]
                  p-5
                  shadow-[0_14px_38px_rgba(20,23,31,0.035)]
                  transition-colors
                  hover:bg-white/[0.65]
                  dark:border-white/[0.07]
                  dark:bg-white/[0.025]
                  dark:shadow-none
                  dark:hover:bg-white/[0.04]
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                      flex h-9 w-9 items-center justify-center
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

                  <span className="font-display text-[10px] font-bold text-[#2b2d31]/24 dark:text-white/18">
                    {pillar.number}
                  </span>
                </div>

                <h3 className="mt-5 text-[14px] font-semibold text-[#202226] dark:text-white">
                  {pillar.title}
                </h3>

                <p className="mt-2 text-[11px] leading-5 text-[#2b2d31]/50 dark:text-white/42">
                  {pillar.body}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
