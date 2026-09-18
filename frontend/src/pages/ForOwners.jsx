import { Link } from "react-router-dom";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AppShell from "../components/layout/AppShell.jsx";

/* =========================================================
   SMALL FEATURE
========================================================= */

function MiniFeature({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-medium text-[#2b2d31]/46 dark:text-white/42">
      <Icon
        size={13}
        strokeWidth={1.9}
        className="shrink-0 text-[#426c64] dark:text-[#8db4aa]"
      />

      <span>{children}</span>
    </div>
  );
}

/* =========================================================
   BENEFIT CARD
========================================================= */

function BenefitCard({ icon: Icon, eyebrow, title, description }) {
  return (
    <div
      className="
        rounded-[24px]
        border border-black/[0.065]
        bg-white/48
        p-5
        shadow-[0_16px_46px_rgba(20,23,31,0.035)]
        backdrop-blur
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
        dark:shadow-none
      "
    >
      <div
        className="
          flex h-10 w-10
          items-center justify-center
          rounded-[14px]
          border border-[#426c64]/10
          bg-[#426c64]/[0.065]
          text-[#426c64]
          dark:border-[#8db4aa]/15
          dark:bg-[#8db4aa]/[0.08]
          dark:text-[#8db4aa]
        "
      >
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <p className="mt-5 text-[11px] font-medium tracking-[-0.01em] text-[#2b2d31]/45 dark:text-white/40">
        {eyebrow}
      </p>

      <h3 className="mt-1.5 font-display text-[19px] font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-[12px] leading-5 text-[#2b2d31]/50 dark:text-white/44">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   WORKFLOW STEP
========================================================= */

function WorkflowStep({ number, title, description, last = false }) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className="
            absolute left-[18px] top-10
            h-[calc(100%+6px)] w-px
            bg-black/[0.075]
            dark:bg-white/[0.08]
          "
        />
      )}

      <div
        className="
          relative z-10
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-full
          border border-[#426c64]/15
          bg-[#eef2ef]
          text-[10px]
          font-bold
          text-[#426c64]
          dark:border-[#8db4aa]/15
          dark:bg-[#8db4aa]/[0.08]
          dark:text-[#8db4aa]
        "
      >
        {number}
      </div>

      <div className="pb-7">
        <h3 className="text-[13px] font-semibold text-[#202226] dark:text-white">
          {title}
        </h3>

        <p className="mt-1.5 max-w-lg text-[12px] leading-5 text-[#2b2d31]/48 dark:text-white/42">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   OWNER JOURNEY ILLUSTRATION
========================================================= */

function OwnerJourneyIllustration() {
  return (
    <div
      aria-hidden="true"
      className="
        relative
        mx-auto
        h-full
        min-h-[390px]
        w-full
        max-w-[720px]
      "
    >
      {/* SOFT ATMOSPHERE */}

      <div
        className="
          absolute
          right-[4%] top-[3%]
          h-[330px] w-[330px]
          rounded-full
          bg-[#426c64]/[0.035]
          blur-[80px]
          dark:bg-[#8db4aa]/[0.04]
        "
      />

      <div
        className="
          absolute
          bottom-[-20%] right-[-8%]
          h-[330px] w-[420px]
          rounded-[50%]
          bg-[#426c64]/[0.035]
          dark:bg-[#8db4aa]/[0.025]
        "
      />

      <svg
        viewBox="0 0 720 500"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* VERY LIGHT TERRAIN */}

        <path
          d="M37 356C128 292 197 301 264 331C334 362 411 367 497 333C576 302 635 277 732 291"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#426c64]/[0.11] dark:text-white/[0.08]"
        />

        <path
          d="M94 461C171 392 230 376 303 395C379 414 454 434 527 405C600 376 650 346 739 359"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#426c64]/[0.08] dark:text-white/[0.06]"
        />

        <path
          d="M160 129C235 88 316 77 405 102C493 127 551 137 619 105C653 89 682 75 720 69"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#426c64]/[0.10] dark:text-white/[0.07]"
        />

        {/* ROUTE */}

        <path
          d="M341 263C382 250 414 252 444 236C477 218 495 192 523 173C548 157 571 149 607 143"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="7 9"
          className="text-[#426c64]/35 dark:text-[#8db4aa]/35"
        />

        {/* SMALL HOUSE - FAR LEFT */}

        <g opacity="0.52">
          <path
            d="M171 156L204 132L237 156V199H171V156Z"
            className="fill-[#f4f5f1] dark:fill-white/[0.055]"
          />

          <path
            d="M164 158L204 126L245 158"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinejoin="round"
            className="text-[#759086]/60 dark:text-[#8db4aa]/35"
          />

          <rect
            x="196"
            y="170"
            width="16"
            height="29"
            rx="2"
            className="fill-[#80998f]/30 dark:fill-[#8db4aa]/20"
          />

          <rect
            x="178"
            y="163"
            width="11"
            height="11"
            rx="1.5"
            className="fill-[#80998f]/25 dark:fill-[#8db4aa]/15"
          />

          <rect
            x="219"
            y="163"
            width="11"
            height="11"
            rx="1.5"
            className="fill-[#80998f]/25 dark:fill-[#8db4aa]/15"
          />
        </g>

        {/* TREE 1 */}

        <g opacity="0.5">
          <rect
            x="132"
            y="195"
            width="4"
            height="33"
            rx="2"
            className="fill-[#738b82]/45"
          />

          <ellipse
            cx="134"
            cy="185"
            rx="13"
            ry="25"
            className="fill-[#aebcb6]/55 dark:fill-[#8db4aa]/15"
          />
        </g>

        {/* TREE 2 */}

        <g opacity="0.45">
          <rect
            x="274"
            y="137"
            width="4"
            height="36"
            rx="2"
            className="fill-[#738b82]/45"
          />

          <ellipse
            cx="276"
            cy="127"
            rx="14"
            ry="27"
            className="fill-[#aebcb6]/55 dark:fill-[#8db4aa]/15"
          />
        </g>

        {/* DESTINATION HOUSE */}

        <g>
          <ellipse
            cx="615"
            cy="196"
            rx="74"
            ry="17"
            className="fill-[#202226]/[0.035] dark:fill-black/10"
          />

          <path
            d="M571 142L615 107L659 142V199H571V142Z"
            className="fill-white/80 dark:fill-white/[0.075]"
          />

          <path
            d="M561 145L615 100L670 145"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinejoin="round"
            className="text-[#426c64]/75 dark:text-[#8db4aa]/55"
          />

          <rect
            x="605"
            y="165"
            width="20"
            height="34"
            rx="2"
            className="fill-[#426c64]/25 dark:fill-[#8db4aa]/25"
          />

          <rect
            x="581"
            y="151"
            width="13"
            height="13"
            rx="2"
            className="fill-[#426c64]/20 dark:fill-[#8db4aa]/20"
          />

          <rect
            x="637"
            y="151"
            width="13"
            height="13"
            rx="2"
            className="fill-[#426c64]/20 dark:fill-[#8db4aa]/20"
          />

          {/* PIN */}

          <path
            d="M615 59C598 59 585 72 585 89C585 111 615 138 615 138C615 138 645 111 645 89C645 72 632 59 615 59Z"
            className="fill-[#426c64] dark:fill-[#8db4aa]"
          />

          <circle
            cx="615"
            cy="88"
            r="9"
            className="fill-[#f8f7f3] dark:fill-[#17191d]"
          />
        </g>

        {/* DESTINATION TREES */}

        <g opacity="0.62">
          <rect
            x="680"
            y="154"
            width="4"
            height="45"
            rx="2"
            className="fill-[#738b82]/45"
          />

          <ellipse
            cx="682"
            cy="141"
            rx="17"
            ry="33"
            className="fill-[#aebcb6]/65 dark:fill-[#8db4aa]/18"
          />

          <rect
            x="546"
            y="166"
            width="4"
            height="34"
            rx="2"
            className="fill-[#738b82]/45"
          />

          <ellipse
            cx="548"
            cy="156"
            rx="13"
            ry="25"
            className="fill-[#aebcb6]/55 dark:fill-[#8db4aa]/16"
          />
        </g>

        {/* PERSON WALKING TOWARD HOUSE */}

        <g transform="translate(365 190)">
          {/* HEAD */}

          <circle
            cx="25"
            cy="8"
            r="8"
            className="fill-[#4a5551] dark:fill-[#b8c3bf]"
          />

          {/* BODY */}

          <path
            d="M22 18C32 18 38 26 39 41L39 63H18L15 38C15 25 17 18 22 18Z"
            className="fill-[#789087]"
          />

          {/* BACKPACK */}

          <path
            d="M14 25C8 29 7 39 8 49L11 58H20V26L14 25Z"
            className="fill-[#566961] dark:fill-[#60766d]"
          />

          {/* ARM */}

          <path
            d="M36 30L48 48"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="text-[#4f5e59] dark:text-[#9daaa5]"
          />

          {/* LEG 1 */}

          <path
            d="M23 62L19 86"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-[#4f5e59] dark:text-[#a7b2ae]"
          />

          {/* LEG 2 */}

          <path
            d="M35 62L43 82"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-[#4f5e59] dark:text-[#a7b2ae]"
          />

          {/* SUITCASE HANDLE */}

          <path
            d="M5 45L-1 61"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#566961] dark:text-[#91a09a]"
          />

          {/* SUITCASE */}

          <rect
            x="-13"
            y="59"
            width="18"
            height="27"
            rx="3"
            transform="rotate(10 -13 59)"
            className="fill-[#61786f] dark:fill-[#789087]"
          />

          <circle cx="-9" cy="89" r="2" className="fill-[#4f5e59]" />
          <circle cx="3" cy="91" r="2" className="fill-[#4f5e59]" />

          {/* BAG */}

          <path
            d="M47 47H60L63 61H45L47 47Z"
            className="fill-[#55655f] dark:fill-[#738980]"
          />

          <path
            d="M50 47C50 40 58 40 58 47"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#55655f] dark:text-[#8da098]"
          />
        </g>

        {/* FOOTSTEPS */}

        <path
          d="M386 294C405 294 423 289 440 281"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 9"
          className="text-[#426c64]/20 dark:text-[#8db4aa]/20"
        />
      </svg>
    </div>
  );
}

/* =========================================================
   OWNER LANDING
========================================================= */

export default function ForOwners() {
  return (
    <AppShell>
      <div className="space-y-8 sm:space-y-10">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            relative isolate
            overflow-hidden
            rounded-[30px]
            border border-black/[0.06]
            bg-[#f8f7f3]
            shadow-[0_22px_70px_rgba(20,23,31,0.04)]

            dark:border-white/[0.06]
            dark:bg-[#15171b]
            dark:shadow-none
          "
        >
          {/* BASE */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-0
              bg-gradient-to-br
              from-[#f8f7f3]
              via-[#f7f6f2]
              to-[#edf1ee]

              dark:from-[#17191d]
              dark:via-[#15171b]
              dark:to-[#19201e]
            "
          />

          {/* SUBTLE ROUTE BACKGROUND */}

          <svg
            aria-hidden="true"
            viewBox="0 0 1200 550"
            preserveAspectRatio="none"
            className="
              pointer-events-none
              absolute inset-0
              h-full w-full
              text-[#25282a]
              opacity-[0.035]

              dark:text-white
              dark:opacity-[0.035]
            "
          >
            <path
              d="M22 437C174 331 286 403 411 284C537 166 660 221 773 128C867 50 986 100 1184 23"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M262 570C330 415 497 421 603 334C723 237 874 276 1235 332"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M596 -44C646 92 746 142 778 258C804 357 795 424 846 584"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <div
            className="
              relative z-10
              grid min-h-[535px]
              grid-cols-1

              lg:grid-cols-[1.02fr_0.98fr]
            "
          >
            {/* LEFT */}

            <div
              className="
                flex flex-col
                justify-center
                px-6 py-11

                sm:px-8
                lg:px-11
                lg:py-14
                xl:px-12
              "
            >
              <h1
                className="
                  max-w-[650px]
                  font-display
                  text-[44px]
                  font-bold
                  leading-[0.98]
                  tracking-[-0.06em]
                  text-[#17191d]

                  sm:text-[58px]
                  lg:text-[62px]
                  xl:text-[67px]

                  dark:text-white
                "
              >
                Your property.
                <span
                  className="
                    mt-1 block
                    text-[#2b2d31]/42
                    dark:text-white/38
                  "
                >
                  The right renters.
                </span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-[610px]
                  text-[14px]
                  leading-7
                  text-[#2b2d31]/54

                  sm:text-[15px]

                  dark:text-white/48
                "
              >
                List your property, showcase its location and details, and
                connect directly with renters looking for a place.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/owner/listings/new"
                  className="
                    inline-flex
                    items-center gap-2
                    rounded-full
                    bg-[#202226]
                    px-5 py-3
                    text-[12px]
                    font-semibold
                    text-white
                    no-underline
                    shadow-[0_12px_30px_rgba(20,23,31,0.12)]
                    transition-colors
                    hover:bg-[#303238]

                    dark:bg-white
                    dark:text-[#17191d]
                    dark:hover:bg-white/90
                  "
                >
                  <Plus size={14} strokeWidth={2} />
                  Add a property
                </Link>

                <Link
                  to="/owner/listings"
                  className="
                    inline-flex
                    items-center gap-2
                    rounded-full
                    border border-black/[0.09]
                    bg-white/45
                    px-5 py-3
                    text-[12px]
                    font-semibold
                    text-[#202226]
                    no-underline
                    transition-colors
                    hover:bg-white/80

                    dark:border-white/[0.09]
                    dark:bg-white/[0.035]
                    dark:text-white/75
                    dark:hover:bg-white/[0.07]
                    dark:hover:text-white
                  "
                >
                  My listings
                  <ArrowRight size={13} strokeWidth={1.9} />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
                <MiniFeature icon={Check}>Direct renter interest</MiniFeature>

                <MiniFeature icon={ShieldCheck}>
                  Manage your own listings
                </MiniFeature>

                <MiniFeature icon={MapPin}>
                  Location-first discovery
                </MiniFeature>
              </div>
            </div>

            {/* RIGHT */}

            <div
              className="
                relative
                min-h-[410px]
                overflow-hidden
                border-t border-black/[0.045]

                lg:min-h-0
                lg:border-l
                lg:border-t-0

                dark:border-white/[0.05]
              "
            >
              <OwnerJourneyIllustration />
            </div>
          </div>
        </section>

        {/* =====================================================
            BENEFITS
        ===================================================== */}

        <section>
          <div className="mb-5">
            <p className="text-[11px] font-medium tracking-[-0.01em] text-[#426c64] dark:text-[#8db4aa]">
              Built for owners
            </p>

            <h2 className="mt-2 font-display text-[28px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[34px] dark:text-white">
              A simpler way to manage your rental.
            </h2>

            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#2b2d31]/50 dark:text-white/44">
              Keep your property visible, organised and easy for renters to
              understand.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <BenefitCard
              icon={Sparkles}
              eyebrow="Presentation"
              title="Show the property properly."
              description="Add useful details, photos and amenities so renters know what they are looking at before contacting you."
            />

            <BenefitCard
              icon={MapPin}
              eyebrow="Discovery"
              title="Put location first."
              description="Pin the property's real location and make it easier for renters to discover places that actually fit their area."
            />

            <BenefitCard
              icon={MessageSquare}
              eyebrow="Interest"
              title="Hear directly from renters."
              description="Receive visit requests from interested renters and decide whether to accept or decline them from your workspace."
            />
          </div>
        </section>

        {/* =====================================================
            WORKFLOW
        ===================================================== */}

        <section
          className="
            grid grid-cols-1 gap-8
            rounded-[28px]
            border border-black/[0.065]
            bg-white/45
            p-6
            shadow-[0_18px_55px_rgba(20,23,31,0.035)]

            sm:p-8

            lg:grid-cols-[0.85fr_1.15fr]
            lg:gap-12

            dark:border-white/[0.07]
            dark:bg-white/[0.025]
            dark:shadow-none
          "
        >
          <div>
            <p className="text-[11px] font-medium tracking-[-0.01em] text-[#426c64] dark:text-[#8db4aa]">
              How it works
            </p>

            <h2 className="mt-2 max-w-sm font-display text-[29px] font-bold leading-[1.08] tracking-[-0.045em] text-[#202226] dark:text-white">
              List once. Manage everything from Rentora.
            </h2>

            <p className="mt-4 max-w-md text-[13px] leading-6 text-[#2b2d31]/50 dark:text-white/44">
              The owner workflow stays focused on the things that matter:
              presenting the property, receiving renter interest and keeping the
              listing accurate.
            </p>

            <Link
              to="/owner"
              className="
                mt-6
                inline-flex
                items-center gap-2
                rounded-full
                border border-black/[0.08]
                bg-white/55
                px-4 py-2.5
                text-[11px]
                font-semibold
                text-[#202226]
                no-underline
                transition-colors
                hover:bg-white

                dark:border-white/[0.08]
                dark:bg-white/[0.04]
                dark:text-white/70
                dark:hover:bg-white/[0.07]
                dark:hover:text-white
              "
            >
              Open owner dashboard
              <ArrowRight size={12} strokeWidth={1.9} />
            </Link>
          </div>

          <div className="lg:pt-1">
            <WorkflowStep
              number="01"
              title="Create your property listing"
              description="Add the property's information, price, location, amenities, contact details and photos."
            />

            <WorkflowStep
              number="02"
              title="Let renters discover it"
              description="Your listing becomes available through Rentora's browsing and map-based property discovery."
            />

            <WorkflowStep
              number="03"
              title="Manage renter interest"
              description="Review visit requests, read the renter's message and respond directly from your owner workspace."
              last
            />
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border border-black/[0.06]
            bg-[#202226]
            px-6 py-8

            sm:px-8

            lg:flex
            lg:items-center
            lg:justify-between
            lg:gap-10

            dark:border-white/[0.07]
            dark:bg-[#0f1114]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-20 -top-28
              h-72 w-72
              rounded-full
              bg-[#8db4aa]/[0.12]
              blur-[80px]
            "
          />

          <div className="relative">
            <div className="flex items-center gap-2 text-[#8db4aa]">
              <CheckCircle2 size={14} strokeWidth={1.9} />

              <span className="text-[11px] font-medium tracking-[-0.01em]">
                Your owner workspace
              </span>
            </div>

            <h2 className="mt-3 font-display text-[27px] font-bold tracking-[-0.04em] text-white sm:text-[31px]">
              Ready to put your property on Rentora?
            </h2>

            <p className="mt-2 max-w-xl text-[13px] leading-6 text-white/52">
              Create the listing, keep the information updated and manage renter
              requests from one place.
            </p>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3 lg:mt-0">
            <Link
              to="/owner/listings/new"
              className="
                inline-flex
                items-center gap-2
                rounded-full
                bg-white
                px-5 py-3
                text-[12px]
                font-semibold
                text-[#17191d]
                no-underline
                transition-colors
                hover:bg-white/90
              "
            >
              <Plus size={13} strokeWidth={2} />
              Add property
            </Link>

            <Link
              to="/owner"
              className="
                inline-flex
                items-center gap-2
                rounded-full
                border border-white/15
                bg-white/[0.06]
                px-5 py-3
                text-[12px]
                font-semibold
                text-white/75
                no-underline
                transition-colors
                hover:bg-white/[0.10]
                hover:text-white
              "
            >
              Dashboard
              <ArrowRight size={13} strokeWidth={1.9} />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
