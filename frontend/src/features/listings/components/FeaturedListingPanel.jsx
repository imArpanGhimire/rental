import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.jsx";
import {
  useFavorites,
  useToggleFavorite,
} from "../../favorites/hooks/useFavorites.js";

import Icon from "../../../components/ui/Icon";
import DropdownMenu from "../../../components/ui/DropdownMenu";

function isMobileDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

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

  const { toggle } = useToggleFavorite();

  useEffect(() => {
    if (!selected && listings.length > 0) {
      setSelected(listings[0]);
    }

    if (selected && !listings.find((listing) => listing._id === selected._id)) {
      setSelected(listings[0] || null);
    }
  }, [listings, selected]);

  async function handleShare(listing) {
    if (!listing?._id) {
      return;
    }

    const url = `${window.location.origin}/listings/${listing._id}`;

    if (isMobileDevice() && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: listing.title || "Rentora listing",
          text: `Check out ${listing.title || "this property"} on Rentora.`,
          url,
        });

        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }
    }

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

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-ivory border border-stone p-6 text-sm text-neutral-500">
        Loading listings…
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="rounded-2xl bg-ivory border border-stone p-6 text-sm text-neutral-500">
        No listings match your search yet.
      </div>
    );
  }

  const isSaved =
    favoriteIds?.some(
      (favoriteId) => String(favoriteId) === String(selected?._id),
    ) ?? false;

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

  return (
    <div className="p-1">
      {selected && (
        <div className="relative overflow-visible rounded-2xl border border-stone bg-bg shadow-[0_1px_2px_rgba(20,20,26,0.04),0_8px_24px_rgba(20,20,26,0.05)]">
          {/* IMAGE */}

          <div
            className="cursor-pointer px-5 pt-5"
            onClick={() => navigate(`/listings/${selected._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/listings/${selected._id}`);
              }
            }}
          >
            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-ivory">
              {selected.images?.[0]?.url ? (
                <img
                  src={selected.images[0].url}
                  alt={selected.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.015]"
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

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(selected);
                }}
                className={`shrink-0 rounded-full px-2.5 py-2 text-xs font-medium transition-colors ${
                  copied
                    ? "bg-brass-light text-brass"
                    : "text-neutral-500 hover:bg-ivory hover:text-ink"
                }`}
                aria-label="Share listing"
              >
                <span className="flex items-center gap-1.5">
                  <Icon name="share" size={14} />
                  {copied ? "Copied" : "Share"}
                </span>
              </button>
            </div>

            {/* DESCRIPTION */}

            {selected.description && (
              <p className="mt-4 line-clamp-3 text-[14px] leading-6 text-neutral-600">
                {selected.description}
              </p>
            )}

            {/* PRICE */}

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-400">
                  Monthly rent
                </p>

                <p className="mt-1 text-[19px] font-bold tracking-tight text-ink">
                  Rs {selected.price?.toLocaleString("en-IN")}
                  <span className="ml-1 text-sm font-normal text-neutral-500">
                    / month
                  </span>
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="relative mt-5 flex gap-2">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-ivory transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/listings/${selected._id}`);
                }}
              >
                View property
                <Icon name="arrowRight" size={16} />
              </button>

              <div className="relative z-50 shrink-0">
                <DropdownMenu
                  trigger={
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-stone bg-bg text-neutral-500 transition-all duration-200 hover:border-neutral-300 hover:bg-ivory hover:text-ink"
                      aria-label="More actions"
                    >
                      <Icon name="dots" size={16} />
                    </button>
                  }
                  items={[
                    {
                      label: isSaved ? "Remove from saved" : "Save listing",
                      onSelect: handleSave,
                    },
                    {
                      label: "Copy link",
                      onSelect: () => handleShare(selected),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
                  className="overflow-hidden rounded-2xl border border-stone bg-bg text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(20,20,26,0.08)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ivory">
                    {listing.images?.[0]?.url ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
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
