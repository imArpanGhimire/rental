import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.jsx";

import {
  useFavorites,
  useToggleFavorite,
} from "../../favorites/hooks/useFavorites.js";

import Icon from "../../../components/ui/Icon";
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

  const navigate = useNavigate();

  const { user } = useAuth();

  const { favoriteIds } = useFavorites({
    enabled: user?.role === "renter",
  });

  const { toggle, add, remove } = useToggleFavorite();

  /* =========================================================
     INITIAL / FILTERED LISTING
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
     AUTO ROTATE FEATURED PROPERTY
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
  }, [listings]);

  /* =========================================================
     LOADING / EMPTY
  ========================================================= */

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-stone bg-ivory p-6 text-sm text-neutral-500">
        Loading listings…
      </div>
    );
  }

  if (!listings.length || !selected) {
    return (
      <div className="rounded-2xl border border-stone bg-ivory p-6 text-sm text-neutral-500">
        No listings match your search yet.
      </div>
    );
  }

  /* =========================================================
     FAVORITES
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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="p-1">
      <div
        key={selected._id}
        className="
          relative
          overflow-visible
          rounded-2xl
          border border-stone
          bg-bg
          shadow-[0_1px_2px_rgba(20,20,26,0.04),0_8px_24px_rgba(20,20,26,0.05)]
          animate-[panel-fade-in_350ms_ease-out]
        "
      >
        {/* IMAGE */}

        <div
          className="cursor-pointer px-5 pt-5"
          onClick={() => navigate(`/listings/${selected._id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              navigate(`/listings/${selected._id}`);
            }
          }}
        >
          <div className="aspect-[16/10] overflow-hidden rounded-xl bg-ivory">
            {selected.images?.[0]?.url ? (
              <img
                src={selected.images[0].url}
                alt={selected.title}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-[1.015]
                "
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                No photo yet
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}

        <div className="px-5 pb-5 pt-4">
          {/* TITLE + SAVE */}

          <div className="flex items-start justify-between gap-4">
            <div
              className="min-w-0 cursor-pointer"
              onClick={() => navigate(`/listings/${selected._id}`)}
            >
              <h2 className="text-[21px] font-bold leading-tight tracking-tight text-ink">
                {selected.title}
              </h2>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500">
                <Icon
                  name="pin"
                  size={14}
                  className="shrink-0 text-neutral-400"
                />

                <span className="truncate">
                  {selected.location?.address || "Location unavailable"}
                </span>
              </p>
            </div>

            {/* SAVE */}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleSave();
              }}
              disabled={isSaving}
              aria-pressed={isSaved}
              className={`
                shrink-0
                flex
                items-center
                gap-1.5
                rounded-full
                px-3
                py-2
                text-xs
                font-medium
                transition-all
                duration-200
                disabled:opacity-60
                ${
                  isSaved
                    ? "bg-brass-light text-brass"
                    : "text-neutral-500 hover:bg-ivory hover:text-ink"
                }
              `}
            >
              <Icon
                name={isSaved ? "heartFill" : "heart"}
                size={15}
                filled={isSaved}
              />

              {isSaved ? "Saved" : "Save"}
            </button>
          </div>

          {/* DESCRIPTION */}

          {selected.description && (
            <p className="mt-5 line-clamp-3 text-[15px] leading-7 text-neutral-600">
              {selected.description}
            </p>
          )}

          {/* PRICE */}

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-400">
              Monthly rent
            </p>

            <p className="mt-1 text-[20px] font-bold tracking-tight text-ink">
              Rs {selected.price?.toLocaleString("en-IN")}
              <span className="ml-1 text-sm font-normal text-neutral-500">
                / month
              </span>
            </p>
          </div>

          {/* ACTIONS */}

          <div className="relative mt-6 flex gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                navigate(`/listings/${selected._id}`);
              }}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                bg-ink
                py-3
                text-sm
                font-semibold
                text-ivory
                transition-all
                duration-200
                hover:-translate-y-px
                hover:shadow-md
                active:translate-y-0
              "
            >
              View property
              <Icon name="arrowRight" size={16} />
            </button>

            {/* MORE */}

            <div className="relative z-50 shrink-0">
              <DropdownMenu
                trigger={
                  <button
                    type="button"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-stone
                      bg-bg
                      text-neutral-500
                      transition-all
                      duration-200
                      hover:border-neutral-300
                      hover:bg-ivory
                      hover:text-ink
                    "
                    aria-label="More actions"
                  >
                    <Icon name="dots" size={16} />
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
        </div>
      </div>

      {/* MORE NEARBY */}

      {listings.length > 1 && (
        <div className="mt-7">
          <div className="mb-3 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                Explore
              </p>

              <h3 className="text-lg font-bold tracking-tight">More nearby</h3>
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
                    overflow-hidden
                    rounded-2xl
                    border
                    border-stone
                    bg-bg
                    text-left
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_8px_24px_rgba(20,20,26,0.08)]
                  "
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ivory">
                    {listing.images?.[0]?.url ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                          hover:scale-[1.02]
                        "
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        No photo yet
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">
                      {listing.title}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Rs {listing.price?.toLocaleString("en-IN")} /mo
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
