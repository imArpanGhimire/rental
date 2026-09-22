import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Home, Info, X } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext.jsx";

const STORAGE_PREFIX = "thegana-demo-listing-notice-seen";

export default function DemoListingNotice() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const [open, setOpen] = useState(false);

  /*
   * Create a unique identifier for the currently logged-in account.
   *
   * MongoDB normally gives us user._id.
   * user.id is kept as a fallback in case the API transforms _id.
   * Email is the final fallback.
   */
  const userIdentifier = useMemo(() => {
    if (!user) return null;

    return user._id || user.id || user.email || null;
  }, [user]);

  /*
   * Each account gets its own localStorage entry.
   *
   * Example:
   *
   * thegana-demo-listing-notice-seen_68fa123...
   * thegana-demo-listing-notice-seen_68fb456...
   */
  const storageKey = useMemo(() => {
    if (!userIdentifier) return null;

    return `${STORAGE_PREFIX}_${userIdentifier}`;
  }, [userIdentifier]);

  /*
   * Check whether THIS specific account has already
   * acknowledged the demo listing notice.
   */
  useEffect(() => {
    // Wait until AuthContext finishes checking the session.
    if (isLoading) {
      return;
    }

    // Never show the modal to logged-out visitors.
    if (!isAuthenticated || !userIdentifier || !storageKey) {
      setOpen(false);
      return;
    }

    const hasSeenNotice = localStorage.getItem(storageKey);

    if (hasSeenNotice === "true") {
      setOpen(false);
      return;
    }

    setOpen(true);
  }, [isLoading, isAuthenticated, userIdentifier, storageKey]);

  function handleClose() {
    if (storageKey) {
      localStorage.setItem(storageKey, "true");
    }

    setOpen(false);
  }

  if (isLoading || !isAuthenticated || !userIdentifier || !open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close notice"
        onClick={handleClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
      />

      {/* MODAL */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-notice-title"
        className="
          relative z-10 w-full max-w-[480px] overflow-hidden
          rounded-[24px]
          border border-black/[0.08]
          bg-white
          shadow-[0_30px_100px_rgba(0,0,0,0.25)]
          dark:border-white/[0.08]
          dark:bg-[#17181b]
        "
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="
            absolute right-4 top-4
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-black/[0.08]
            bg-black/[0.03]
            text-black/60
            transition-colors
            hover:bg-black/[0.07]
            hover:text-black
            dark:border-white/[0.1]
            dark:bg-white/[0.05]
            dark:text-white/60
            dark:hover:bg-white/[0.1]
            dark:hover:text-white
          "
        >
          <X size={17} strokeWidth={1.8} />
        </button>

        <div className="p-6 sm:p-7">
          {/* ICON */}
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-full bg-black text-white
              dark:bg-white dark:text-black
            "
          >
            <Info size={20} strokeWidth={1.8} />
          </div>

          {/* INTRO */}
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
              Before you browse
            </p>

            <h2
              id="demo-notice-title"
              className="
                mt-2 font-display text-[24px] font-bold
                leading-[1.15] tracking-[-0.04em]
                text-black dark:text-white
              "
            >
              Some listings are for demonstration
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/55 dark:text-white/55">
              Thegana is currently in its initial phase, so some properties have
              been added to demonstrate how the platform works.
            </p>
          </div>

          {/* LISTING EXPLANATION */}
          <div
            className="
              mt-6 divide-y divide-black/[0.07]
              border-y border-black/[0.07]
              dark:divide-white/[0.08]
              dark:border-white/[0.08]
            "
          >
            {/* DEMO LISTINGS */}
            <div className="py-4">
              <div className="flex items-start gap-3">
                <span
                  className="
                    mt-0.5 shrink-0 rounded-md
                    bg-black px-2 py-1
                    text-[9px] font-bold uppercase tracking-[0.08em] text-white
                    dark:bg-white dark:text-black
                  "
                >
                  Demo
                </span>

                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    Listings marked "Demo"
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/50 dark:text-white/50">
                    These are sample properties used to demonstrate Thegana.
                    They are not available for rent.
                  </p>
                </div>
              </div>
            </div>

            {/* REAL LISTINGS */}
            <div className="py-4">
              <div className="flex items-start gap-3">
                <span
                  className="
                    mt-[7px]
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                    bg-black
                    dark:bg-white
                  "
                />

                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    Listings without "Demo"
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/50 dark:text-white/50">
                    These are properties added by owners through Thegana.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTRIBUTION SECTION */}
          <div
            className="
              mt-5 rounded-[18px]
              border border-black/[0.07]
              bg-black/[0.025]
              p-4
              dark:border-white/[0.08]
              dark:bg-white/[0.035]
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-xl
                  border border-black/[0.08]
                  bg-white
                  text-black
                  dark:border-white/[0.08]
                  dark:bg-white/[0.06]
                  dark:text-white
                "
              >
                <Home size={16} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-black dark:text-white">
                  Help us add more real properties
                </p>

                <p className="mt-1 text-xs leading-5 text-black/50 dark:text-white/50">
                  Thegana is still growing. If you're a property owner, we
                  encourage you to list your property and help renters find more
                  real places to live.
                </p>

                <Link
                  to="/owner/listings/new"
                  onClick={handleClose}
                  className="
      mt-3 inline-flex items-center gap-1.5
      text-xs font-semibold
      text-black no-underline
      transition-opacity
      hover:opacity-60
      dark:text-white
    "
                >
                  List your property
                  <ArrowRight size={13} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>

          {/* SAFETY NOTE */}
          <p className="mt-5 text-xs leading-5 text-black/40 dark:text-white/40">
            Always confirm the property's details, availability and rental terms
            directly with the owner before making any decision.
          </p>

          {/* CONTINUE */}
          <button
            type="button"
            onClick={handleClose}
            className="
              mt-6 w-full rounded-xl
              bg-black px-5 py-3
              text-sm font-semibold text-white
              transition-opacity
              hover:opacity-85
              dark:bg-white dark:text-black
            "
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
}
