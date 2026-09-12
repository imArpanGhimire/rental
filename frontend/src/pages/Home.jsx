import { Check, MapPin, ShieldCheck } from "lucide-react";

import AppShell from "../components/layout/AppShell.jsx";

import HeroSearch from "../features/home/components/HeroSearch.jsx";
import PropertyTypeStrip from "../features/home/components/PropertyTypeStrip.jsx";
import FeaturedHomes from "../features/home/components/FeaturedHomes.jsx";
import MapSearchShowcase from "../features/home/components/MapSearchShowcase.jsx";

export default function Home() {
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
          {/* ===================================================
              DECORATION

              Everything decorative stays BEHIND the content.
          =================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
              overflow-hidden
            "
          >
            {/* BASE SURFACE */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-bg
                via-bg
                to-[#f1f3f0]

                dark:to-[#191c1e]
              "
            />

            {/* VERY SUBTLE ACCENT */}

            <div
              className="
                absolute
                -right-28
                -top-32
                h-[420px]
                w-[420px]
                rounded-full
                bg-[#54736c]/[0.055]
                blur-[90px]

                dark:bg-[#78978f]/[0.045]
              "
            />

            {/* MAP LINES */}

            <svg
              viewBox="0 0 1000 500"
              className="
                absolute
                bottom-[-15%]
                right-[-7%]
                h-[105%]
                w-[72%]
                text-[#25282a]
                opacity-[0.045]

                dark:text-white
                dark:opacity-[0.04]
              "
            >
              <path
                d="M40 370 C150 285 210 340 310 242 C405 150 495 204 580 122 C660 44 750 87 930 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />

              <path
                d="M145 500 C190 372 320 362 410 294 C510 218 650 242 1020 292"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M350 -30 C400 96 490 128 520 238 C545 332 538 395 590 540"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* ===================================================
              HERO CONTENT
          =================================================== */}

          <div
            className="
              relative
              z-10
              px-5
              pb-8
              pt-12

              sm:px-8
              sm:pb-10
              sm:pt-16

              lg:px-12
              lg:pt-20
            "
          >
            <div className="mx-auto max-w-[880px] text-center">
              {/* EYEBROW */}

              <div
                className="
                  mx-auto
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-stone
                  bg-bg
                  px-3.5
                  py-2
                  shadow-sm
                "
              >
                <MapPin
                  size={12}
                  strokeWidth={1.9}
                  className="text-[#3f7068] dark:text-[#8eb8ae]"
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-ink/55
                  "
                >
                  Rental discovery, made simpler
                </span>
              </div>

              {/* TITLE */}

              <h1
                className="
                  mx-auto
                  mt-6
                  max-w-[760px]
                  font-display
                  text-[39px]
                  font-bold
                  leading-[1.02]
                  tracking-[-0.055em]
                  text-ink

                  sm:text-[52px]
                  lg:text-[64px]
                "
              >
                Find your next place
                <span className="block text-ink/45">without the noise.</span>
              </h1>

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-[590px]
                  text-[14px]
                  leading-6
                  text-ink/55

                  sm:text-[15px]
                "
              >
                Browse rentals, compare locations and search directly on the map
                — all in one place.
              </p>

              {/* SEARCH */}

              <div className="relative z-20 mt-8 sm:mt-10">
                <HeroSearch />
              </div>

              {/* TRUST POINTS */}

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-5
                  gap-y-2
                  text-[10px]
                  font-medium
                  text-ink/45
                "
              >
                <span className="flex items-center gap-1.5">
                  <Check
                    size={11}
                    strokeWidth={2}
                    className="text-[#3f7068] dark:text-[#8eb8ae]"
                  />
                  Real property listings
                </span>

                <span className="flex items-center gap-1.5">
                  <ShieldCheck
                    size={11}
                    strokeWidth={1.9}
                    className="text-[#3f7068] dark:text-[#8eb8ae]"
                  />
                  Direct owner contact
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin
                    size={11}
                    strokeWidth={1.9}
                    className="text-[#3f7068] dark:text-[#8eb8ae]"
                  />
                  Map-based discovery
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================
              PROPERTY TYPES

              z-20 is intentional. Nothing from the hero
              decoration is allowed to cover this section.
          =================================================== */}

          <div className="relative z-20">
            <PropertyTypeStrip />
          </div>
        </section>

        {/* =====================================================
            FEATURED LISTINGS
        ===================================================== */}

        <FeaturedHomes />

        {/* =====================================================
            MAP SEARCH
        ===================================================== */}

        <MapSearchShowcase />
      </div>
    </AppShell>
  );
}
