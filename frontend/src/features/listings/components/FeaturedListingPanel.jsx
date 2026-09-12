import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Heart,
  MapPin,
  ArrowUpRight,
  MoreHorizontal,
  Copy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext.jsx";
import {
  useFavorites,
  useToggleFavorite,
} from "../../favorites/hooks/useFavorites.js";

import DropdownMenu from "../../../components/ui/DropdownMenu";

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-999999px";
  textarea.style.top = "0";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  let successful = false;

  try {
    successful = document.execCommand("copy");
  } catch {
    successful = false;
  }

  document.body.removeChild(textarea);

  return successful;
}

export default function FeaturedListingPanel({ listings = [], isLoading }) {
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [rotationKey, setRotationKey] = useState(0);

  const navigate = useNavigate();

  const { user } = useAuth();

  const { favoriteIds } = useFavorites({
    enabled: user?.role === "renter",
  });

  const { toggle, add, remove } = useToggleFavorite();

  /* =========================================================
     INITIAL PROPERTY
  ========================================================= */

  useEffect(() => {
    if (!listings.length) {
      setSelected(null);
      return;
    }

    setSelected((current) => {
      if (!current) {
        return listings[0];
      }

      const stillExists = listings.some(
        (listing) => String(listing._id) === String(current._id),
      );

      return stillExists ? current : listings[0];
    });
  }, [listings]);

  /* =========================================================
     AUTO ROTATION
  ========================================================= */

  useEffect(() => {
    if (listings.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setSelected((current) => {
        if (!current) {
          return listings[0];
        }

        const currentIndex = listings.findIndex(
          (listing) => String(listing._id) === String(current._id),
        );

        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % listings.length;

        return listings[nextIndex];
      });
    }, 7000);

    return () => {
      window.clearInterval(interval);
    };
  }, [listings, rotationKey]);

  /* =========================================================
     MANUAL PROPERTY NAVIGATION
  ========================================================= */

  function showPreviousListing(event) {
    event.stopPropagation();

    if (listings.length <= 1) {
      return;
    }

    setSelected((current) => {
      const currentIndex = listings.findIndex(
        (listing) => String(listing._id) === String(current?._id),
      );

      const previousIndex =
        currentIndex <= 0 ? listings.length - 1 : currentIndex - 1;

      return listings[previousIndex];
    });

    // Restart the 7-second auto-rotation timer after a manual change.
    setRotationKey((key) => key + 1);
  }

  function showNextListing(event) {
    event.stopPropagation();

    if (listings.length <= 1) {
      return;
    }

    setSelected((current) => {
      const currentIndex = listings.findIndex(
        (listing) => String(listing._id) === String(current?._id),
      );

      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % listings.length;

      return listings[nextIndex];
    });

    // Restart the 7-second auto-rotation timer after a manual change.
    setRotationKey((key) => key + 1);
  }

  /* =========================================================
     LOADING / EMPTY
  ========================================================= */

  if (isLoading) {
    return (
      <div
        className="
          rounded-[28px]
          border border-stone/70
          bg-bg/80
          p-6
          text-sm
          text-text/50
          shadow-[0_20px_60px_rgba(20,23,31,0.06)]
          backdrop-blur
        "
      >
        Loading listings…
      </div>
    );
  }

  if (!listings.length || !selected) {
    return (
      <div
        className="
          rounded-[28px]
          border border-stone/70
          bg-bg/80
          p-6
          text-sm
          text-text/50
          shadow-[0_20px_60px_rgba(20,23,31,0.06)]
          backdrop-blur
        "
      >
        No listings match your search yet.
      </div>
    );
  }

  /* =========================================================
     SAVE
  ========================================================= */

  const isSaved =
    favoriteIds?.some(
      (favoriteId) => String(favoriteId) === String(selected._id),
    ) ?? false;

  const isSaving = add?.isPending || remove?.isPending;

  function handleSave() {
    if (!selected?._id) {
      return;
    }

    if (user?.role !== "renter") {
      navigate("/login");
      return;
    }

    toggle(selected._id, isSaved);
  }

  /* =========================================================
     COPY LINK
  ========================================================= */

  async function handleCopyLink() {
    if (!selected?._id) {
      return;
    }

    const url = `${window.location.origin}/listings/${selected._id}`;

    try {
      const success = await copyToClipboard(url);

      if (success) {
        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 1800);
      }
    } catch {
      window.prompt("Copy this listing link:", url);
    }
  }

  const imageUrl = selected.images?.[0]?.url;

  return (
    <div className="p-1">
      <div
        key={selected._id}
        className="
          group
          relative
          overflow-visible
          rounded-[30px]
          border border-stone/70
          bg-bg
          shadow-[0_1px_2px_rgba(20,23,31,0.04),0_20px_55px_rgba(20,23,31,0.08)]
          transition-all
          duration-300
           
          hover:shadow-[0_8px_24px_rgba(20,23,31,0.08),0_28px_70px_rgba(20,23,31,0.10)]
        "
      >
        {/* =====================================================
            IMAGE
        ===================================================== */}

        <div
          className="
            relative
            cursor-pointer
            overflow-hidden
            rounded-t-[29px]
          "
          onClick={() => navigate(`/listings/${selected._id}`)}
        >
          <div className="aspect-[16/10] bg-ivory">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={selected.title}
                className="
  h-full
  w-full
  object-cover
"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-text/40">
                No photo yet
              </div>
            )}
          </div>

          {/* cinematic bottom gradient */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-32
              bg-gradient-to-t
              from-black/45
              via-black/10
              to-transparent
            "
          />

          {/* previous / next property controls */}

          {listings.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousListing}
                aria-label="Previous property"
                className="
                  absolute
                  left-3
                  top-1/2
                  z-20
                  flex
                  h-10
                  w-10
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-black/25
                  text-white
                  shadow-[0_8px_24px_rgba(0,0,0,0.16)]
                  backdrop-blur-md
                  transition-colors
                  duration-200
                  hover:bg-black/45
                "
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={showNextListing}
                aria-label="Next property"
                className="
                  absolute
                  right-3
                  top-1/2
                  z-20
                  flex
                  h-10
                  w-10
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-black/25
                  text-white
                  shadow-[0_8px_24px_rgba(0,0,0,0.16)]
                  backdrop-blur-md
                  transition-colors
                  duration-200
                  hover:bg-black/45
                "
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </>
          )}

          {/* top controls */}

          <div
            className="
              absolute
              left-4
              right-4
              top-4
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div
              className="
                rounded-full
                border border-white/20
                bg-black/25
                px-3
                py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.13em]
                text-white/85
                backdrop-blur-md
              "
            >
              {selected.type || "Rental"}
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleSave();
              }}
              disabled={isSaving}
              aria-pressed={isSaved}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                backdrop-blur-md
                transition-all
                duration-200
                disabled:opacity-60
                ${
                  isSaved
                    ? "border-white/25 bg-white text-ink"
                    : "border-white/20 bg-black/25 text-white hover:bg-white hover:text-ink"
                }
              `}
            >
              <Heart
                size={17}
                strokeWidth={1.8}
                className={isSaved ? "fill-current" : ""}
              />
            </button>
          </div>

          {/* location overlay */}

          <div
            className="
              absolute
              bottom-4
              left-4
              right-4
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div
              className="
                inline-flex
                min-w-0
                items-center
                gap-2
                rounded-full
                border border-white/15
                bg-black/25
                px-3
                py-2
                text-xs
                text-white/85
                backdrop-blur-md
              "
            >
              <MapPin size={13} strokeWidth={1.8} className="shrink-0" />

              <span className="truncate">
                {selected.location?.address || "Location unavailable"}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="relative px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          {/* subtle decorative glow */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-32
              w-32
              rounded-full
              bg-text/[0.025]
              blur-3xl
            "
          />

          <div className="relative">
            {/* EYEBROW */}

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-text/35
              "
            >
              Selected rental
            </p>

            {/* TITLE */}

            <div className="mt-2 flex items-start justify-between gap-4">
              <h2
                className="
                  min-w-0
                  font-display
                  text-[23px]
                  font-bold
                  leading-tight
                  tracking-[-0.04em]
                  text-text
                  sm:text-[25px]
                "
              >
                {selected.title}
              </h2>

              <div className="relative z-30 shrink-0">
                <DropdownMenu
                  trigger={
                    <button
                      type="button"
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border border-stone
                        bg-bg
                        text-text/45
                        transition-all
                        duration-200
                        hover:border-text/15
                        hover:bg-ivory
                        hover:text-text
                      "
                      aria-label="More actions"
                    >
                      <MoreHorizontal size={17} strokeWidth={1.8} />
                    </button>
                  }
                  items={[
                    {
                      label: copied ? "Link copied" : "Copy link",

                      onSelect: handleCopyLink,
                    },

                    {
                      label: "Open property",

                      onSelect: () => navigate(`/listings/${selected._id}`),
                    },
                  ]}
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            {selected.description && (
              <p
                className="
                  mt-4
                  line-clamp-3
                  max-w-[95%]
                  text-[15px]
                  leading-6
                  text-text/60
                "
              >
                {selected.description}
              </p>
            )}

            {/* PRICE / META */}

            <div
              className="
                mt-6
                flex
                items-end
                justify-between
                gap-4
                border-t
                border-stone/70
                pt-5
              "
            >
              <div>
                <p
                  className="
                    mt-1
                    font-display
                    text-[24px]
                    font-bold
                    tracking-[-0.045em]
                    text-text
                  "
                >
                  Rs {selected.price?.toLocaleString("en-IN")}
                  <span
                    className="
                      ml-1
                      font-sans
                      text-sm
                      font-normal
                      tracking-normal
                      text-text/45
                    "
                  >
                    / month
                  </span>
                </p>
              </div>

              <div
                className="
                  hidden
                  rounded-full
                  border border-stone
                  bg-ivory/50
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  text-text/50
                  sm:block
                "
              >
                {listings.length} nearby
              </div>
            </div>

            {/* ACTION */}

            <button
              type="button"
              onClick={() => navigate(`/listings/${selected._id}`)}
              className="
                group/button
                mt-6
                flex
                w-full
                items-center
                justify-between
                rounded-full
                bg-gradient-to-r
                from-[#22252a]
                via-[#191c20]
                to-[#111318]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_8px_20px_rgba(17,19,24,0.18)]
                transition-all
                duration-200
                 
                hover:shadow-[0_12px_28px_rgba(17,19,24,0.22)]
                dark:from-[#f1f0ec]
                dark:via-[#e3e2de]
                dark:to-[#d7d6d2]
                dark:text-[#14161a]
              "
            >
              <span>View property</span>

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition-transform
                  duration-200
                  group-hover/button:translate-x-0.5
                  dark:bg-black/5
                "
              >
                <ArrowUpRight size={15} strokeWidth={1.8} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MORE NEARBY
      ===================================================== */}

      {listings.length > 1 && (
        <div className="mt-7">
          <div
            className="
              mb-3
              flex
              items-end
              justify-between
              px-1
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-text/35
                "
              >
                Explore
              </p>

              <h3
                className="
                  mt-1
                  font-display
                  text-lg
                  font-bold
                  tracking-[-0.035em]
                  text-text
                "
              >
                More nearby
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {listings
              .filter((listing) => listing._id !== selected?._id)
              .slice(0, 4)
              .map((listing) => (
                <button
                  key={listing._id}
                  type="button"
                  onClick={() => navigate(`/listings/${listing._id}`)}
                  className="
                    group/nearby
                    overflow-hidden
                    rounded-[20px]
                    border border-stone/70
                    bg-bg
                    text-left
                    shadow-[0_6px_18px_rgba(20,23,31,0.04)]
                    transition-all
                    duration-200
                     
                    hover:shadow-[0_12px_28px_rgba(20,23,31,0.08)]
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[4/3]
                      overflow-hidden
                      bg-ivory
                    "
                  >
                    {listing.images?.[0]?.url ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="
  h-full
  w-full
  object-cover
"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-text/35">
                        No photo yet
                      </div>
                    )}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-16
                        bg-gradient-to-t
                        from-black/35
                        to-transparent
                      "
                    />
                  </div>

                  <div className="p-3.5">
                    <p
                      className="
                        truncate
                        font-display
                        text-sm
                        font-semibold
                        tracking-[-0.02em]
                        text-text
                      "
                    >
                      {listing.title}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-text/45
                      "
                    >
                      Rs {listing.price?.toLocaleString("en-IN")} / month
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
