import {
  ArrowDown,
  Check,
  Cog,
  Database,
  Eye,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const privacySections = [
  {
    number: "01",
    icon: Database,
    title: "Information we collect",
    body: "When you create an account, we collect your name, email address, and role (renter or owner). If you list a property, we also store the listing details and photos you provide.",
  },
  {
    number: "02",
    icon: Cog,
    title: "How we use your information",
    body: "We use your information to run your account, show your listings or saved properties, and let renters and owners contact each other.",
  },
  {
    number: "03",
    icon: LockKeyhole,
    title: "Account and listing data",
    body: "Information connected to your account is used to provide Rentora features such as authentication, saved listings, property management and interaction between renters and owners.",
  },
];

const principles = [
  "We don't sell your personal data.",
  "Your data is used to provide Rentora features.",
  "Listing information is shown only where the platform requires it.",
];

export default function Privacy() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1080px] space-y-5">
        {/* HERO */}
        <section
          className="
            relative overflow-hidden rounded-[30px]
            border border-black/[0.06]
            bg-[#202226]
            px-6 py-8
            text-white
            shadow-[0_20px_60px_rgba(20,23,31,0.09)]
            sm:px-8 sm:py-10
            dark:border-white/[0.07]
            dark:bg-[#111318]
            dark:shadow-none
          "
        >
          {/* decorative circles */}
          <div
            className="
              pointer-events-none absolute
              -right-20 -top-24
              h-72 w-72 rounded-full
              border border-white/[0.04]
            "
          />

          <div
            className="
              pointer-events-none absolute
              -right-8 -top-10
              h-52 w-52 rounded-full
              border border-white/[0.04]
            "
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div className="max-w-2xl">
              <span
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  border border-white/[0.09]
                  bg-white/[0.06]
                  text-white
                "
              >
                <ShieldCheck size={18} strokeWidth={1.8} />
              </span>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/35">
                Privacy at Rentora
              </p>

              <h1
                className="
                  mt-2 max-w-xl
                  font-display text-[31px] font-bold
                  leading-[1.12] tracking-[-0.045em]
                  sm:text-[39px]
                "
              >
                Your information should have a clear purpose.
              </h1>

              <p className="mt-4 max-w-xl text-[13px] leading-6 text-white/48">
                This page explains what Rentora collects, why we use it, and how
                that information supports your experience on the platform.
              </p>
            </div>

            {/* privacy status */}
            <div
              className="
                rounded-[22px]
                border border-white/[0.08]
                bg-white/[0.045]
                p-5
                backdrop-blur-sm
              "
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07]">
                  <LockKeyhole size={13} strokeWidth={1.8} />
                </span>

                <span className="text-[11px] font-semibold text-white/70">
                  Privacy summary
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {principles.map((principle) => (
                  <div key={principle} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/[0.07]">
                      <Check size={9} strokeWidth={2} />
                    </span>

                    <p className="text-[10px] leading-4 text-white/42">
                      {principle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="relative mt-7 text-[9px] font-medium text-white/25">
            Last updated: August 2026
          </p>
        </section>

        {/* DATA JOURNEY */}
        <section
          className="
            rounded-[26px]
            border border-black/[0.07]
            bg-white/[0.5]
            p-6
            shadow-[0_16px_46px_rgba(20,23,31,0.04)]
            sm:p-7
            dark:border-white/[0.07]
            dark:bg-white/[0.025]
            dark:shadow-none
          "
        >
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/35 dark:text-white/32">
              Your data at Rentora
            </p>

            <h2 className="mt-2 font-display text-[21px] font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
              What happens to the information you provide?
            </h2>

            <p className="mt-2 text-[11px] leading-5 text-[#2b2d31]/45 dark:text-white/39">
              The basic flow is intentionally simple.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-[1fr_34px_1fr_34px_1fr] md:items-center">
            {/* YOU PROVIDE */}
            <div
              className="
                rounded-[20px]
                border border-black/[0.06]
                bg-[#f5f4f1]
                p-5
                dark:border-white/[0.06]
                dark:bg-white/[0.025]
              "
            >
              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-[13px]
                  bg-white
                  text-[#2b2d31]/55
                  shadow-[0_5px_18px_rgba(20,23,31,0.05)]
                  dark:bg-white/[0.05]
                  dark:text-white/50
                  dark:shadow-none
                "
              >
                <UserRound size={15} strokeWidth={1.8} />
              </span>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/30 dark:text-white/28">
                Step 01
              </p>

              <h3 className="mt-1 text-[13px] font-semibold text-[#202226] dark:text-white">
                You provide it
              </h3>

              <p className="mt-1.5 text-[10px] leading-5 text-[#2b2d31]/45 dark:text-white/38">
                Account information, property details and photos.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowDown
                size={15}
                strokeWidth={1.6}
                className="text-[#2b2d31]/20 md:-rotate-90 dark:text-white/18"
              />
            </div>

            {/* RENTORA USES */}
            <div
              className="
                rounded-[20px]
                border border-black/[0.06]
                bg-[#f5f4f1]
                p-5
                dark:border-white/[0.06]
                dark:bg-white/[0.025]
              "
            >
              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-[13px]
                  bg-white
                  text-[#2b2d31]/55
                  shadow-[0_5px_18px_rgba(20,23,31,0.05)]
                  dark:bg-white/[0.05]
                  dark:text-white/50
                  dark:shadow-none
                "
              >
                <Cog size={15} strokeWidth={1.8} />
              </span>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/30 dark:text-white/28">
                Step 02
              </p>

              <h3 className="mt-1 text-[13px] font-semibold text-[#202226] dark:text-white">
                Rentora uses it
              </h3>

              <p className="mt-1.5 text-[10px] leading-5 text-[#2b2d31]/45 dark:text-white/38">
                To provide accounts, listings, saves and platform features.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowDown
                size={15}
                strokeWidth={1.6}
                className="text-[#2b2d31]/20 md:-rotate-90 dark:text-white/18"
              />
            </div>

            {/* EXPERIENCE */}
            <div
              className="
                rounded-[20px]
                border border-black/[0.06]
                bg-[#f5f4f1]
                p-5
                dark:border-white/[0.06]
                dark:bg-white/[0.025]
              "
            >
              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-[13px]
                  bg-white
                  text-[#2b2d31]/55
                  shadow-[0_5px_18px_rgba(20,23,31,0.05)]
                  dark:bg-white/[0.05]
                  dark:text-white/50
                  dark:shadow-none
                "
              >
                <Eye size={15} strokeWidth={1.8} />
              </span>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/30 dark:text-white/28">
                Step 03
              </p>

              <h3 className="mt-1 text-[13px] font-semibold text-[#202226] dark:text-white">
                You get the experience
              </h3>

              <p className="mt-1.5 text-[10px] leading-5 text-[#2b2d31]/45 dark:text-white/38">
                Relevant listings, saved properties and account management.
              </p>
            </div>
          </div>
        </section>

        {/* PRIVACY DETAILS */}
        <section className="grid gap-4 lg:grid-cols-3">
          {privacySections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.number}
                className="
                  rounded-[22px]
                  border border-black/[0.07]
                  bg-white/[0.48]
                  p-5
                  shadow-[0_14px_38px_rgba(20,23,31,0.035)]
                  dark:border-white/[0.07]
                  dark:bg-white/[0.025]
                  dark:shadow-none
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

                  <span className="font-display text-[10px] font-bold text-[#2b2d31]/20 dark:text-white/18">
                    {section.number}
                  </span>
                </div>

                <h2 className="mt-5 text-[14px] font-semibold text-[#202226] dark:text-white">
                  {section.title}
                </h2>

                <p className="mt-2 text-[11px] leading-5 text-[#2b2d31]/48 dark:text-white/42">
                  {section.body}
                </p>
              </article>
            );
          })}
        </section>

        {/* CONTACT */}
        <section
          className="
            flex flex-col gap-5
            rounded-[24px]
            border border-black/[0.07]
            bg-[#f0efeb]
            px-6 py-6
            sm:flex-row sm:items-center sm:justify-between
            dark:border-white/[0.07]
            dark:bg-white/[0.025]
          "
        >
          <div className="flex items-start gap-4">
            <span
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-[14px]
                border border-black/[0.06]
                bg-white/60
                text-[#2b2d31]/55
                dark:border-white/[0.07]
                dark:bg-white/[0.04]
                dark:text-white/48
              "
            >
              <Mail size={16} strokeWidth={1.8} />
            </span>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/35 dark:text-white/32">
                Questions about privacy?
              </p>

              <h2 className="mt-1 text-[14px] font-semibold text-[#202226] dark:text-white">
                Visit the Help center.
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-[#2b2d31]/43 dark:text-white/38">
                Questions about this policy can be sent through the Help center.
              </p>
            </div>
          </div>

          <a
            href="/help"
            className="
              inline-flex h-10 shrink-0 items-center justify-center
              rounded-full
              bg-[#202226]
              px-5
              text-[10px] font-semibold text-white
              no-underline
              transition-colors
              hover:bg-[#2b2e33]
              dark:bg-white
              dark:text-[#15171b]
              dark:hover:bg-white/90
            "
          >
            Help center
          </a>
        </section>
      </div>
    </AppShell>
  );
}
