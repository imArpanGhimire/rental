import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Home,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

import Logo from "../ui/Logo.jsx";

const SLIDES = [
  {
    icon: Home,
    eyebrow: "For renters",
    heading: "Find a place,\nnot just a listing.",
    body: "Browse homes across Kathmandu Valley with clear pricing, useful photos and the location information you actually need.",
  },
  {
    icon: Building2,
    eyebrow: "For owners",
    heading: "List once.\nReach real renters.",
    body: "Publish a property in minutes and manage renter interest directly from one simple workspace.",
  },
  {
    icon: CheckCircle2,
    eyebrow: "Built for clarity",
    heading: "Less guesswork.\nMore confidence.",
    body: "See the details that matter before you visit — pricing, amenities, photos and property information in one place.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    label: "Verified listings",
    helper: "Clear property details",
  },
  {
    icon: Search,
    label: "Map-first search",
    helper: "Explore by neighborhood",
  },
  {
    icon: Building2,
    label: "Direct renting",
    helper: "Connect without middlemen",
  },
];

function RegisterArtPanel() {
  return (
    <section
      className="
        relative h-full min-h-[720px] overflow-hidden rounded-[30px]
        border border-white/[0.08]
        bg-[linear-gradient(145deg,#20242a_0%,#171a1f_52%,#101216_100%)]
        p-7 shadow-[0_30px_90px_rgba(0,0,0,0.22)]
        xl:p-9
      "
    >
      {/* ambient shapes */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/[0.035] blur-3xl" />

      {/* subtle architectural grid */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-[0.12]
          [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
          [background-size:54px_54px]
        "
      />

      {/* decorative house/city line art */}
      <svg
        viewBox="0 0 700 760"
        className="pointer-events-none absolute bottom-0 right-0 h-[76%] w-[72%] opacity-55"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rentoraGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.13)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>

        <path
          d="M128 694V340L350 172L575 340V694"
          fill="url(#rentoraGlow)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="2"
        />
        <path
          d="M78 352L350 124L624 352"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="3"
        />
        <rect
          x="278"
          y="482"
          width="144"
          height="212"
          rx="8"
          fill="rgba(255,255,255,0.035)"
          stroke="rgba(255,255,255,0.08)"
        />
        <rect
          x="174"
          y="382"
          width="84"
          height="72"
          rx="8"
          fill="rgba(255,255,255,0.045)"
        />
        <rect
          x="444"
          y="382"
          width="84"
          height="72"
          rx="8"
          fill="rgba(255,255,255,0.045)"
        />
        <circle cx="350" cy="262" r="30" fill="rgba(255,255,255,0.045)" />
      </svg>

      <div className="relative z-10 flex h-full flex-col">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.045] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/45">
            <MapPin size={11} strokeWidth={1.8} />
            Kathmandu Valley
          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">
            Same city. New beginnings.
          </p>

          <h2 className="mt-3 max-w-[470px] font-display text-[42px] font-bold leading-[1.04] tracking-[-0.055em] text-white xl:text-[50px]">
            Find a place that feels like home.
          </h2>

          <p className="mt-5 max-w-[470px] text-[14px] leading-7 text-white/48">
            Create one account to search verified homes, save favourites and
            manage your rental journey without the usual clutter.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {FEATURES.map(({ icon: Icon, label, helper }) => (
            <div
              key={label}
              className="
                flex max-w-[420px] items-center gap-4 rounded-[18px]
                border border-white/[0.07] bg-white/[0.028]
                px-4 py-3.5 backdrop-blur
              "
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.08] bg-white/[0.045] text-white/65">
                <Icon size={15} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-white/78">
                  {label}
                </p>
                <p className="mt-0.5 text-[9px] text-white/30">{helper}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="max-w-[430px] border-t border-white/[0.07] pt-5">
            <p className="font-display text-[22px] font-bold tracking-[-0.04em] text-white/82">
              Better rooms. Brighter days.
            </p>
            <p className="mt-2 text-[10px] leading-5 text-white/30">
              A calmer way to rent in Kathmandu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoginShowcase({ active, setActive }) {
  const slide = SLIDES[active];
  const SlideIcon = slide.icon;

  return (
    <aside className="relative hidden min-h-screen overflow-hidden border-r border-white/[0.07] lg:flex lg:flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#262a31_0%,#1a1d22_46%,#111318_100%)]" />
      <div className="pointer-events-none absolute -left-28 -top-20 h-[420px] w-[420px] rounded-full bg-white/[0.07] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 right-[-80px] h-[460px] w-[460px] rounded-full bg-white/[0.045] blur-[120px]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:56px_56px]" />

      <svg
        viewBox="0 0 900 700"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[14%] h-[64%] w-full opacity-70"
        aria-hidden="true"
      >
        <path
          d="M-30 500 C120 400 250 520 380 360 S650 170 930 260"
          fill="none"
          stroke="rgba(255,255,255,0.20)"
          strokeWidth="2"
          strokeDasharray="8 10"
        />
        <path
          d="M30 170 C190 220 280 80 430 170 S680 420 930 330"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1.3"
        />
      </svg>

      <div className="relative z-10 flex min-h-screen flex-col px-10 py-9 xl:px-14 xl:py-11">
        <div className="flex items-center justify-between">
          <Logo variant="light" />

          <div className="inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.045] px-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50 backdrop-blur">
            <MapPin size={12} strokeWidth={1.8} />
            Kathmandu Valley
          </div>
        </div>

        <div className="flex flex-1 items-center py-12">
          <div className="w-full max-w-[520px]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.055] text-white/80 shadow-[0_14px_40px_rgba(0,0,0,0.16)]">
              <SlideIcon size={18} strokeWidth={1.8} />
            </div>

            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
              {slide.eyebrow}
            </p>

            <h2 className="mt-3 whitespace-pre-line font-display text-[42px] font-bold leading-[1.06] tracking-[-0.055em] text-white xl:text-[50px]">
              {slide.heading}
            </h2>

            <p className="mt-5 max-w-[470px] text-[14px] leading-7 text-white/50 xl:text-[15px]">
              {slide.body}
            </p>

            <div className="mt-8 grid gap-2.5 xl:grid-cols-3">
              {FEATURES.map(({ icon: Icon, label, helper }) => (
                <div
                  key={label}
                  className="rounded-[18px] border border-white/[0.08] bg-white/[0.035] p-3.5 backdrop-blur"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/68">
                    <Icon size={14} strokeWidth={1.8} />
                  </div>
                  <p className="mt-3 text-[11px] font-semibold text-white/82">
                    {label}
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-white/34">
                    {helper}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-2">
              {SLIDES.map((item, index) => (
                <button
                  key={item.eyebrow}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${item.eyebrow}`}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                    index === active
                      ? "w-8 bg-white/85"
                      : "w-3 bg-white/16 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  topLinkLabel,
  topLinkText,
  topLinkTo,
  wide = false,
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (wide) return undefined;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [wide]);

  /* =========================================================
     REGISTER
     Left design and form are siblings in the SAME grid,
     so they always finish at the same height.
  ========================================================= */
  if (wide) {
    return (
      <div className="min-h-screen bg-[linear-gradient(145deg,#181b20_0%,#121419_58%,#0d0f13_100%)] px-5 py-6 text-white sm:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1380px] flex-col">
          <header className="flex min-h-11 items-center justify-between gap-5">
            <Logo variant="light" />

            {topLinkTo && (
              <div className="flex items-center gap-3">
                <span className="hidden text-[12px] text-white/42 sm:inline">
                  {topLinkLabel}
                </span>

                <Link
                  to={topLinkTo}
                  className="
                    inline-flex h-10 items-center justify-center gap-1.5
                    rounded-full border border-white/[0.10] bg-white/[0.065]
                    px-4 text-[12px] font-semibold text-white no-underline
                    transition-colors hover:bg-white/[0.11]
                  "
                >
                  {topLinkText}
                  <ArrowUpRight size={12} strokeWidth={2} />
                </Link>
              </div>
            )}
          </header>

          <div className="flex flex-1 items-center py-8 lg:py-10">
            <div className="grid w-full items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr] xl:gap-8">
              <RegisterArtPanel />

              <section
                className="
                  flex h-full min-h-[720px] flex-col overflow-hidden rounded-[30px]
                  border border-white/[0.09] bg-white/[0.04]
                  shadow-[0_28px_90px_rgba(0,0,0,0.22)]
                  backdrop-blur-xl
                "
              >
                <div className="border-b border-white/[0.07] px-6 pb-4 pt-5 sm:px-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">
                    Rentora account
                  </p>

                  <h1 className="mt-2 font-display text-[31px] font-bold tracking-[-0.045em] text-white sm:text-[36px]">
                    {title}
                  </h1>

                  {subtitle && (
                    <p className="mt-2 text-[13px] leading-6 text-white/43">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="flex-1 px-6 py-5 sm:px-7">{children}</div>

                <div className="border-t border-white/[0.06] px-6 py-3.5 text-center text-[9px] leading-4 text-white/25 sm:px-7">
                  By continuing, you agree to use Rentora responsibly and keep
                  your account information secure.
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     LOGIN
  ========================================================= */
  return (
    <div className="min-h-screen bg-[#111318] text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <LoginShowcase active={active} setActive={setActive} />

        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(145deg,#181b20_0%,#121419_58%,#0d0f13_100%)] px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <div className="pointer-events-none absolute right-[-130px] top-[-120px] h-[360px] w-[360px] rounded-full bg-white/[0.035] blur-[110px]" />

          <div className="relative flex min-h-11 items-center justify-between">
            <div className="lg:hidden">
              <Logo variant="light" />
            </div>

            {topLinkTo && (
              <div className="ml-auto flex items-center gap-3">
                <span className="hidden text-[12px] text-white/42 sm:inline">
                  {topLinkLabel}
                </span>

                <Link
                  to={topLinkTo}
                  className="
                    inline-flex h-10 items-center justify-center gap-1.5
                    rounded-full border border-white/[0.10] bg-white/[0.065]
                    px-4 text-[12px] font-semibold text-white no-underline
                    transition-colors hover:bg-white/[0.11]
                  "
                >
                  {topLinkText}
                  <ArrowUpRight size={12} strokeWidth={2} />
                </Link>
              </div>
            )}
          </div>

          <div className="relative flex flex-1 items-center justify-center py-8 sm:py-10">
            <div className="w-full max-w-[480px]">
              <div className="overflow-hidden rounded-[30px] border border-white/[0.09] bg-white/[0.04] shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="border-b border-white/[0.07] px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">
                    Rentora account
                  </p>

                  <h1 className="mt-2 font-display text-[31px] font-bold tracking-[-0.045em] text-white sm:text-[36px]">
                    {title}
                  </h1>

                  {subtitle && (
                    <p className="mt-2 text-[13px] leading-6 text-white/43">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="px-6 py-6 sm:px-7 sm:py-7">{children}</div>
              </div>

              <p className="mt-4 text-center text-[10px] leading-5 text-white/27">
                By continuing, you agree to use Rentora responsibly and keep
                your account information secure.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
