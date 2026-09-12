import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Eye,
  MapPin,
  MessageCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import AppShell from "../components/layout/AppShell.jsx";

export default function ForOwners() {
  return (
    <AppShell>
      <div className="space-y-8 sm:space-y-10">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            relative
            isolate
            overflow-hidden
            rounded-[28px]
            border
            border-stone
            bg-bg
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-bg
                via-bg
                to-[#edf1ef]

                dark:to-[#191d1c]
              "
            />

            <div
              className="
                absolute
                -right-32
                -top-36
                h-[460px]
                w-[460px]
                rounded-full
                bg-[#426c64]/[0.07]
                blur-[100px]

                dark:bg-[#8db4aa]/[0.05]
              "
            />
          </div>

          <div
            className="
              relative
              z-10
              grid
              gap-10
              px-5
              py-10

              sm:px-8
              sm:py-14

              lg:grid-cols-[1fr_0.82fr]
              lg:items-center
              lg:px-12
              lg:py-16
            "
          >
            <div>
              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-stone
                  bg-bg/75
                  px-3.5
                  py-2
                  shadow-sm
                  backdrop-blur
                "
              >
                <Building2
                  size={13}
                  strokeWidth={1.8}
                  className="text-[#426c64] dark:text-[#8db4aa]"
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.13em]
                    text-ink/50
                  "
                >
                  Rentora for property owners
                </span>
              </div>

              <h1
                className="
                  mt-6
                  max-w-[720px]
                  font-display
                  text-[42px]
                  font-bold
                  leading-[1.02]
                  tracking-[-0.055em]
                  text-ink

                  sm:text-[54px]
                  lg:text-[64px]
                "
              >
                Your property.
                <span className="block text-ink/42">The right renters.</span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-[560px]
                  text-[14px]
                  leading-7
                  text-ink/52

                  sm:text-[15px]
                "
              >
                List your property, showcase its location and details, and
                connect directly with renters looking for a place.
              </p>

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-3
                "
              >
                <Link
                  to="/owner/listings/new"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-ink
                    px-5
                    py-3
                    text-[12px]
                    font-semibold
                    text-ivory
                    no-underline
                    transition-opacity
                    hover:opacity-90
                  "
                >
                  <Plus size={14} strokeWidth={1.9} />
                  Add a property
                </Link>

                <Link
                  to="/owner/listings"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-stone
                    bg-bg
                    px-5
                    py-3
                    text-[12px]
                    font-semibold
                    text-ink
                    no-underline
                    transition-colors
                    hover:bg-ivory
                  "
                >
                  My listings
                  <ArrowRight size={13} strokeWidth={1.8} />
                </Link>
              </div>

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-x-5
                  gap-y-2
                  text-[10px]
                  font-medium
                  text-ink/42
                "
              >
                <span className="flex items-center gap-1.5">
                  <Check
                    size={11}
                    strokeWidth={2}
                    className="text-[#426c64] dark:text-[#8db4aa]"
                  />
                  Direct renter interest
                </span>

                <span className="flex items-center gap-1.5">
                  <ShieldCheck
                    size={11}
                    strokeWidth={1.9}
                    className="text-[#426c64] dark:text-[#8db4aa]"
                  />
                  Manage your own listings
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin
                    size={11}
                    strokeWidth={1.9}
                    className="text-[#426c64] dark:text-[#8db4aa]"
                  />
                  Location-first discovery
                </span>
              </div>
            </div>

            {/* PROPERTY PREVIEW */}

            <div
              className="
                overflow-hidden
                rounded-[26px]
                border
                border-black/[0.07]
                bg-white/55
                p-3
                shadow-[0_22px_70px_rgba(20,23,31,0.08)]
                backdrop-blur

                dark:border-white/[0.07]
                dark:bg-white/[0.035]
                dark:shadow-none
              "
            >
              <div
                className="
                  relative
                  min-h-[250px]
                  overflow-hidden
                  rounded-[20px]
                  bg-gradient-to-br
                  from-[#cdd7d2]
                  via-[#e6e9e5]
                  to-[#b7c7c0]

                  dark:from-[#29302e]
                  dark:via-[#222826]
                  dark:to-[#32403c]
                "
              >
                <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/60 px-3 py-1.5 text-[9px] font-semibold text-[#22272a] backdrop-blur dark:border-white/[0.08] dark:bg-black/20 dark:text-white/70">
                  Your listing
                </div>

                <div
                  className="
                    absolute
                    bottom-4
                    left-4
                    right-4
                    rounded-[18px]
                    border
                    border-white/45
                    bg-white/70
                    p-4
                    backdrop-blur-xl

                    dark:border-white/[0.08]
                    dark:bg-black/25
                  "
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2b2d31]/40 dark:text-white/35">
                    Apartment
                  </p>

                  <div className="mt-1 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[#202226] dark:text-white">
                        A better way to present your property.
                      </h3>

                      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#2b2d31]/45 dark:text-white/40">
                        <MapPin size={11} strokeWidth={1.8} />
                        Kathmandu
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#426c64] text-white dark:bg-[#8db4aa] dark:text-[#17201e]">
                      <ArrowRight size={15} strokeWidth={1.8} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            BENEFITS
        ===================================================== */}

        <section>
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/35">
              Built for owners
            </p>

            <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.04em] text-ink sm:text-[32px]">
              Everything needed to put your property in front of renters.
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Get your property seen",
                text: "Present your property with photos, pricing, details and availability in one clear listing.",
              },

              {
                icon: MessageCircle,
                title: "Talk directly to renters",
                text: "Receive visit interest from renters without adding unnecessary layers between you.",
              },

              {
                icon: MapPin,
                title: "Show the exact location",
                text: "Place your property directly on the map so renters can understand the area before contacting you.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="
                    rounded-[22px]
                    border
                    border-stone
                    bg-bg
                    p-5

                    sm:p-6
                  "
              >
                <div
                  className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-stone
                      bg-ivory
                      text-[#426c64]

                      dark:text-[#8db4aa]
                    "
                >
                  <Icon size={17} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 font-display text-[18px] font-bold tracking-[-0.03em] text-ink">
                  {title}
                </h3>

                <p className="mt-2 text-[12px] leading-6 text-ink/45">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          className="
            overflow-hidden
            rounded-[26px]
            border
            border-stone
            bg-ivory/55
            p-5

            sm:p-7
            lg:p-8
          "
        >
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/35">
                Simple workflow
              </p>

              <h2 className="mt-2 font-display text-[28px] font-bold tracking-[-0.045em] text-ink">
                From property to published listing.
              </h2>

              <p className="mt-3 max-w-md text-[12px] leading-6 text-ink/45">
                Rentora keeps the owner workflow focused on what matters:
                accurate property details, useful photos and a location renters
                can understand.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  number: "01",
                  title: "Create your listing",
                  text: "Add the property type, rent, description and important details.",
                },

                {
                  number: "02",
                  title: "Add photos and location",
                  text: "Upload property photos and mark the location using the map.",
                },

                {
                  number: "03",
                  title: "Receive renter interest",
                  text: "Manage listings and respond to visit requests from your owner dashboard.",
                },
              ].map(({ number, title, text }) => (
                <div
                  key={number}
                  className="
                      flex
                      gap-4
                      rounded-[18px]
                      border
                      border-stone
                      bg-bg
                      p-4
                    "
                >
                  <span
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-stone
                        bg-ivory
                        text-[10px]
                        font-bold
                        text-ink/40
                      "
                  >
                    {number}
                  </span>

                  <div>
                    <h3 className="text-[13px] font-semibold text-ink">
                      {title}
                    </h3>

                    <p className="mt-1 text-[11px] leading-5 text-ink/42">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            DASHBOARD CTA
        ===================================================== */}

        <section
          className="
            grid
            gap-5
            rounded-[26px]
            border
            border-stone
            bg-bg
            p-5

            sm:p-7

            lg:grid-cols-[1fr_auto]
            lg:items-center
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <BarChart3
                size={14}
                strokeWidth={1.8}
                className="text-[#426c64] dark:text-[#8db4aa]"
              />

              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">
                Owner workspace
              </p>
            </div>

            <h2 className="mt-3 font-display text-[25px] font-bold tracking-[-0.04em] text-ink">
              Manage everything from your dashboard.
            </h2>

            <p className="mt-2 max-w-[620px] text-[12px] leading-6 text-ink/45">
              Your dashboard remains separate from this landing page. Use it
              when you want to manage listings, visit requests and account
              activity.
            </p>
          </div>

          <Link
            to="/owner"
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-stone
              bg-ivory
              px-5
              py-3
              text-[12px]
              font-semibold
              text-ink
              no-underline
              transition-colors
              hover:bg-bg
            "
          >
            Open dashboard
            <ArrowRight size={13} strokeWidth={1.8} />
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
