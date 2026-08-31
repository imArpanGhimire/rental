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

    // MOBILE
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

    // DESKTOP
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

    // Guests must log in before saving.
    if (user?.role !== "renter") {
      navigate("/login");
      return;
    }

    toggle(selected._id, isSaved);
  }

  return (
    <div className="p-1">
      {selected && (
        <div className="relative rounded-2xl bg-bg border border-stone shadow-[0_1px_2px_rgba(20,20,26,0.04),0_8px_24px_rgba(20,20,26,0.05)] overflow-visible">
          {/* TOPBAR */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone/70">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brass shrink-0" />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Featured listing
                </span>
              </div>

              <p className="text-sm font-semibold text-ink mt-1 truncate">
                {selected.title}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShare(selected);
              }}
              className={`shrink-0 ml-4 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                copied
                  ? "bg-brass-light text-brass"
                  : "text-neutral-500 hover:text-ink hover:bg-ivory"
              }`}
            >
              <Icon name="share" size={14} />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>

          {/* IMAGE + TITLE */}
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/listings/${selected._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/listings/${selected._id}`);
              }
            }}
          >
            <div className="px-5 pt-5">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-ivory border border-stone">
                {selected.images?.[0]?.url ? (
                  <img
                    src={selected.images[0].url}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    No photo yet
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pt-4">
              <h2 className="text-xl font-bold tracking-tight leading-snug">
                {selected.title}
              </h2>

              <p className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1.5">
                <Icon
                  name="pin"
                  size={13}
                  className="text-neutral-400 shrink-0"
                />

                <span className="truncate">
                  {selected.location?.address || "Location unavailable"}
                </span>
              </p>
            </div>
          </div>

          {/* PROPERTY DETAILS */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-6 text-sm text-neutral-500 my-4">
              <span className="flex items-center gap-1.5">
                <Icon name="bed" size={15} className="text-neutral-400" />
                {selected.rooms ?? "—"}
                <span className="text-xs text-neutral-400">rooms</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Icon name="bath" size={15} className="text-neutral-400" />
                {selected.bathrooms ?? 1}
                <span className="text-xs text-neutral-400">bath</span>
              </span>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {selected.description}
            </p>

            <p className="mt-4 text-sm">
              Rental price:{" "}
              <strong className="text-base">
                Rs {selected.price?.toLocaleString("en-IN")} / month
              </strong>
            </p>

            {/* ACTIONS */}
            <div className="relative flex gap-2 mt-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 bg-ink text-ivory rounded-full py-3 font-semibold text-sm honey-lift hover:shadow-lg hover:-translate-y-px active:translate-y-0 active:shadow-sm active:duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/listings/${selected._id}`);
                }}
              >
                Show contacts
                <Icon name="arrowRight" size={16} />
              </button>

              <div className="relative z-50 shrink-0">
                <DropdownMenu
                  trigger={
                    <button
                      type="button"
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-stone bg-bg text-neutral-500 hover:text-ink hover:bg-ivory hover:border-neutral-300 transition-all duration-200"
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
          <div className="flex items-end justify-between mb-3 px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                Explore
              </p>

              <h3 className="text-lg font-bold tracking-tight">More nearby</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listings
              .filter((listing) => listing._id !== selected?._id)
              .slice(0, 4)
              .map((listing) => (
                <button
                  key={listing._id}
                  type="button"
                  onClick={() => navigate(`/listings/${listing._id}`)}
                  className="text-left rounded-2xl bg-bg border border-stone overflow-hidden honey-lift hover:shadow-[0_8px_24px_rgba(20,20,26,0.08)] hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ivory border-b border-stone">
                    {listing.images?.[0]?.url ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                        No photo yet
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">
                      {listing.title}
                    </p>

                    <p className="text-xs text-neutral-500 mt-1">
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
