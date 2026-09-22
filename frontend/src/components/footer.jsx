import { Link, useLocation } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";

import { useAuth } from "../features/auth/AuthContext.jsx";
import Logo from "./ui/Logo.jsx";

/* =========================================================
   DATA
========================================================= */

const browse = [
  {
    label: "Browse rentals",
    to: "/browse",
  },
  {
    label: "Saved listings",
    to: "/renter/saved",
  },
];

const support = [
  {
    label: "Support & feedback",
    to: "/support",
    reportLink: true,
  },
  {
    label: "Help center",
    to: "/help",
  },
  {
    label: "Privacy policy",
    to: "/privacy",
  },
  {
    label: "Terms of service",
    to: "/terms",
  },
];

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const { isAuthenticated, role } = useAuth();

  const location = useLocation();

  const listPropertyTo =
    isAuthenticated && role === "owner" ? "/owner/listings/new" : "/register";

  const savedListingsTo =
    isAuthenticated && role === "renter" ? "/renter/saved" : "/login";

  const browseLinks = browse.map((item) =>
    item.label === "Saved listings"
      ? {
          ...item,
          to: savedListingsTo,
        }
      : item,
  );

  const company = [
    {
      label: "About",
      to: "/about",
    },
    {
      label: "How it works",
      to: "/how-it-works",
    },
    {
      label: "List your property",
      to: listPropertyTo,
    },
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
            {/* ATMOSPHERE */}

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

            {/* TEXT */}

            <div className="relative max-w-2xl">
              <p
                className="
                  text-[11px]
                  font-medium
                  tracking-[-0.01em]
                  text-text/45
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
                Find a place that feels right.
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
                Browse rentals, check the location and property details, then
                contact the owner directly.
              </p>
            </div>

            {/* CTA */}

            <Link
              to="/browse"
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

                hover:opacity-90

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
          from-[#77797d]
          via-[#414348]
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

        {/* ===================================================
            LARGE BACKGROUND WORD
        =================================================== */}

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
          THEGANA
        </div>

        {/* ===================================================
            FOOTER CONTENT
        =================================================== */}

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
                <div>
                  <Logo variant="light" className="text-white" />

                  <p
                    className="
                      ml-[37px]
                      mt-0.5
                      text-[10px]
                      font-semibold
                      capitalize
                      tracking-[0.08em]
                      text-white/60
                    "
                  >
                    Find your place
                  </p>
                </div>

                <p
                  className="
                    mt-5
                    max-w-sm
                    text-[14px]
                    leading-6
                    text-white/70
                  "
                >
                  Find rooms, flats, apartments and homes for rent. Check the
                  location, see the details and contact the owner directly.
                </p>
              </div>

              {/* COPYRIGHT */}

              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-1
                  text-xs
                  text-white/50
                "
              >
                <span>© {new Date().getFullYear()} Thegana</span>
              </div>
            </div>

            {/* =================================================
                BROWSE
            ================================================= */}

            <div className="lg:justify-self-center">
              <p
                className="
                  mb-5
                  text-[11px]
                  font-medium
                  tracking-[-0.01em]
                  text-white/55
                "
              >
                Browse
              </p>

              <div className="flex flex-col items-start gap-3">
                {browseLinks.map((item) => (
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
                      text-white/75
                      no-underline
                      transition-colors

                      hover:text-white
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

                <Link
                  to={listPropertyTo}
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-medium
                    text-white/75
                    no-underline
                    transition-colors

                    hover:text-white
                  "
                >
                  List your property
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
              </div>
            </div>

            {/* =================================================
                COMPANY
            ================================================= */}

            <div className="lg:justify-self-center">
              <p
                className="
                  mb-5
                  text-[11px]
                  font-medium
                  tracking-[-0.01em]
                  text-white/55
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
                      text-white/75
                      no-underline
                      transition-colors

                      hover:text-white
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
                    text-[11px]
                    font-medium
                    tracking-[-0.01em]
                    text-white/55
                  "
                >
                  Support
                </p>

                <div className="flex flex-col items-start gap-3">
                  {support.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      state={
                        item.reportLink
                          ? {
                              from: location.pathname,
                            }
                          : undefined
                      }
                      className="
                        group
                        inline-flex
                        items-center
                        gap-1.5
                        text-sm
                        font-medium
                        text-white/75
                        no-underline
                        transition-colors

                        hover:text-white
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

              {/* SOURCE */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
