import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Home, MapPin, Search } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <section className="relative flex min-h-[68vh] items-center justify-center overflow-hidden py-10 sm:py-14">
        {/* Background atmosphere */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2 top-1/2
            h-[420px] w-[420px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-[#426c64]/[0.045]
            blur-[100px]

            dark:bg-[#8db4aa]/[0.04]
          "
        />

        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          {/* Error code */}
          <p
            className="
              mt-7
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#426c64]

              dark:text-[#8db4aa]
            "
          >
            Error 404
          </p>

          {/* Heading */}
          <h1
            className="
              mx-auto mt-3
              max-w-2xl
              font-display
              text-[42px]
              font-bold
              leading-[1]
              tracking-[-0.055em]
              text-[#202226]

              sm:text-[54px]
              lg:text-[62px]

              dark:text-white
            "
          >
            This place isn't on the map.
          </h1>

          {/* Description */}
          <p
            className="
              mx-auto mt-5
              max-w-lg
              text-[14px]
              leading-7
              text-[#2b2d31]/50

              sm:text-[15px]

              dark:text-white/45
            "
          >
            The page you're looking for may have moved, been removed, or the
            address might be incorrect.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/browse"
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
                shadow-[0_12px_30px_rgba(20,23,31,0.10)]
                transition-colors

                hover:bg-[#303238]

                dark:bg-white
                dark:text-[#17191d]
                dark:hover:bg-white/90
              "
            >
              <Search size={14} strokeWidth={1.9} />
              Explore rentals
              <ArrowRight size={13} strokeWidth={1.9} />
            </Link>

            <Link
              to="/"
              className="
                inline-flex
                items-center gap-2
                rounded-full
                border border-black/[0.08]
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
              <Home size={14} strokeWidth={1.8} />
              Go home
            </Link>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mt-7
              inline-flex
              items-center gap-1.5
              border-0
              bg-transparent
              p-0
              text-[12px]
              font-medium
              text-[#2b2d31]/40
              transition-colors

              hover:text-[#202226]

              dark:text-white/35
              dark:hover:text-white/70
            "
          >
            <ArrowLeft size={13} strokeWidth={1.8} />
            Go back
          </button>

          {/* Decorative map route */}
          <svg
            aria-hidden="true"
            viewBox="0 0 700 110"
            fill="none"
            className="
              mx-auto mt-10
              h-[90px]
              w-full
              max-w-[620px]
              text-[#426c64]/15

              dark:text-[#8db4aa]/10
            "
          >
            <path
              d="M15 78C93 29 150 72 220 48C283 26 318 18 375 47C432 76 477 75 529 43C577 13 622 26 685 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 9"
            />

            <circle cx="15" cy="78" r="4" fill="currentColor" />
            <circle cx="685" cy="11" r="4" fill="currentColor" />
          </svg>
        </div>
      </section>
    </AppShell>
  );
}
