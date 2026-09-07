import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";

import { useAuth } from "../features/auth/AuthContext.jsx";

const neighborhoods = ["Baneshwor", "Patan", "Boudha", "Jhamsikhel", "Kalanki"];

const support = [
  { label: "Help center", to: "/help" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
];

export default function Footer() {
  const { isAuthenticated, role } = useAuth();

  const listPropertyTo =
    isAuthenticated && role === "owner" ? "/owner/listings/new" : "/register";

  const company = [
    { label: "About", to: "/about" },
    { label: "How it works", to: "/how-it-works" },
    { label: "List your property", to: listPropertyTo },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* =====================================================
          UPPER TRANSITION
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          border-t border-stone/70
          bg-gradient-to-b
          from-[#f3f2ee]
          via-[#e8e7e3]
          to-[#c8c8c6]
          dark:from-[#1c1f26]
          dark:via-[#181b20]
          dark:to-[#121419]
        "
      >
        <div className="app-shell px-6 pb-8 pt-10 md:pt-12">
          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border border-white/40
              bg-white/45
              px-6
              py-7
              shadow-[0_20px_60px_rgba(20,23,31,0.07)]
              backdrop-blur-xl
              sm:px-8
              md:flex
              md:items-center
              md:justify-between
              md:gap-10
              dark:border-white/5
              dark:bg-white/[0.035]
              dark:shadow-none
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-20
                h-52
                w-52
                rounded-full
                bg-white/40
                blur-3xl
                dark:bg-white/[0.03]
              "
            />

            <div className="relative max-w-2xl">
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-text/40
                "
              >
                Find your next place
              </p>

              <h2
                className="
                  mt-2
                  font-display
                  text-2xl
                  font-bold
                  tracking-[-0.04em]
                  text-text
                  sm:text-3xl
                "
              >
                A better way to rent in Kathmandu.
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-text/55
                  sm:text-[15px]
                "
              >
                Browse homes around the valley with location, pricing and
                property details in one place.
              </p>
            </div>

            <Link
              to="/"
              className="
                relative
                mt-6
                inline-flex
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-ink
                px-5
                py-3
                text-sm
                font-semibold
                text-ivory
                no-underline
                transition-colors
                md:mt-0
              "
            >
              Explore rentals
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-b
          from-[#c8c8c6]
          via-[#55575c]
          to-[#14161a]
          dark:from-[#121419]
          dark:via-[#0f1115]
          dark:to-[#090a0d]
        "
      >
        {/* ATMOSPHERE */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[260px]
            w-[80%]
            -translate-x-1/2
            rounded-full
            bg-white/10
            blur-[110px]
            dark:bg-white/[0.03]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-24
            top-20
            h-72
            w-72
            rounded-full
            bg-black/10
            blur-3xl
          "
        />

        {/* LARGE BACKGROUND WORD */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-18px]
            left-1/2
            w-full
            -translate-x-1/2
            select-none
            whitespace-nowrap
            text-center
            font-display
            text-[20vw]
            font-extrabold
            leading-none
            tracking-[-0.085em]
            text-white/[0.035]
            sm:bottom-[-32px]
            lg:text-[15vw]
          "
        >
          RENTORA
        </div>

        <div className="app-shell relative z-10 px-6 pb-48 pt-12 md:pt-14">
          <div
            className="
              grid
              gap-x-10
              gap-y-12
              sm:grid-cols-2
              lg:grid-cols-4
              lg:gap-x-12
            "
          >
            {/* =================================================
                BRAND
            ================================================= */}

            <div className="flex h-full max-w-sm flex-col">
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-black/10
                      bg-white/30
                      text-[#1f2125]
                      backdrop-blur
                      dark:border-white/15
                      dark:bg-white/10
                      dark:text-white
                    "
                  >
                    <MapPin size={18} strokeWidth={1.8} />
                  </div>

                  <div>
                    <p
                      className="
                        font-display
                        text-xl
                        font-bold
                        tracking-[-0.035em]
                        text-[#1f2125]
                        dark:text-white
                      "
                    >
                      Rentora
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        font-semibold
                        capitalize
                        tracking-[0.15em]
                        text-[#2b2d31]/45
                        dark:text-white/40
                      "
                    >
                      Kathmandu Valley
                    </p>
                  </div>
                </div>

                <p
                  className="
                    mt-5
                    max-w-sm
                    text-[14px]
                    leading-6
                    text-[#2b2d31]/65
                    dark:text-white/55
                  "
                >
                  Rental search for the Kathmandu valley, built around the map —
                  find a place, not just a listing.
                </p>
              </div>

              {/* COPYRIGHT DIRECTLY UNDER DESCRIPTION */}

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-1
                  text-xs
                  text-white/40
                "
              >
                <span>© {new Date().getFullYear()} Rentora</span>

                <span
                  className="
                    hidden
                    h-1
                    w-1
                    rounded-full
                    bg-white/25
                    sm:block
                  "
                />

                <span>Built in Kathmandu.</span>
              </div>
            </div>

            {/* =================================================
                POPULAR AREAS
            ================================================= */}

            <div className="lg:justify-self-center">
              <p
                className="
                  mb-5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#2b2d31]/55
                  dark:text-white/45
                "
              >
                Popular areas
              </p>

              <div className="flex flex-col items-start gap-3">
                {neighborhoods.map((area) => (
                  <span
                    key={area}
                    className="
                      cursor-default
                      text-sm
                      font-medium
                      text-[#2b2d31]/65
                      dark:text-white/65
                    "
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* =================================================
                COMPANY
            ================================================= */}

            <div className="lg:justify-self-center">
              <p
                className="
                  mb-5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#2b2d31]/55
                  dark:text-white/45
                "
              >
                Company
              </p>

              <div className="flex flex-col items-start gap-3">
                {company.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      font-medium
                      text-[#2b2d31]/75
                      no-underline
                      transition-colors
                      hover:text-[#14161a]
                      dark:text-white/65
                      dark:hover:text-white
                    "
                  >
                    {item.label}

                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.8}
                      className="
                        opacity-0
                        transition-opacity
                        duration-200
                        group-hover:opacity-100
                      "
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* =================================================
                SUPPORT
            ================================================= */}

            <div className="flex h-full flex-col lg:justify-self-end">
              <div>
                <p
                  className="
                    mb-5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[#2b2d31]/55
                    dark:text-white/45
                  "
                >
                  Support
                </p>

                <div className="flex flex-col items-start gap-3">
                  {support.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="
                        group
                        inline-flex
                        items-center
                        gap-1.5
                        text-sm
                        font-medium
                        text-[#2b2d31]/75
                        no-underline
                        transition-colors
                        hover:text-[#14161a]
                        dark:text-white/65
                        dark:hover:text-white
                      "
                    >
                      {item.label}

                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.8}
                        className="
                          opacity-0
                          transition-opacity
                          duration-200
                          group-hover:opacity-100
                        "
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* SOURCE DIRECTLY UNDER SUPPORT */}

              <a
                href="https://github.com/imArpanGhimire/rental"
                target="_blank"
                rel="noreferrer"
                className="
                  mt-8
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.06]
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-white/65
                  no-underline
                  backdrop-blur
                  transition-colors
                  hover:border-white/20
                  hover:bg-white/10
                  hover:text-white
                "
              >
                View source
                <ArrowUpRight size={13} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
