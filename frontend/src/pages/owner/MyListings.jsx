import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Heart,
  Settings,
  MessageSquare,
  Compass,
  Building2,
  LayoutGrid,
  RefreshCw,
  CheckCircle2,
  CircleOff,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import { StaggerGrid, StaggerItem } from "../../components/ui/StaggerGrid.jsx";
import { useMyListings } from "../../features/listings/hooks/useMyListings.js";
import Button from "../../components/ui/Button.jsx";
import { updateListingAvailability } from "../../api/listings.api.js";

const links = [
  {
    to: "/owner",
    label: "Overview",
    icon: Home,
    end: true,
  },
  {
    to: "/owner/listings",
    label: "My Listings",
    icon: Compass,
  },
  {
    to: "/owner/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    to: "/owner/favorites",
    label: "Favorites",
    icon: Heart,
  },
  {
    to: "/owner/settings",
    label: "Settings",
    icon: Settings,
  },
];

function AvailabilityControl({ listing, onUpdated }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // Old listings without the field should still count as available.
  const isAvailable = listing.isAvailable !== false;

  async function handleToggle() {
    if (isUpdating) return;

    const nextValue = !isAvailable;

    setError("");
    setIsUpdating(true);

    try {
      await updateListingAvailability(listing._id, nextValue);

      await onUpdated();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't update availability. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div
      className="
        mt-3 rounded-[18px]
        border border-black/[0.07]
        bg-white/45
        px-4 py-3.5
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-xl
              ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "bg-black/[0.04] text-[#2b2d31]/45 dark:bg-white/[0.05] dark:text-white/45"
              }
            `}
          >
            {isAvailable ? (
              <CheckCircle2 size={15} strokeWidth={1.9} />
            ) : (
              <CircleOff size={15} strokeWidth={1.9} />
            )}
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#202226] dark:text-white">
              {isAvailable ? "Available" : "Rented / filled"}
            </p>

            <p className="mt-0.5 text-[9px] leading-4 text-[#2b2d31]/42 dark:text-white/36">
              {isAvailable
                ? "Renters can request a visit."
                : "Visit requests are disabled."}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isAvailable}
          aria-label={`Mark ${listing.title} as ${
            isAvailable ? "rented" : "available"
          }`}
          disabled={isUpdating}
          onClick={handleToggle}
          className={`
            relative h-[26px] w-[46px] shrink-0
            rounded-full
            transition-colors duration-200
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${isAvailable ? "bg-emerald-500" : "bg-black/15 dark:bg-white/15"}
          `}
        >
          <span
            className={`
              absolute top-[3px]
              h-5 w-5 rounded-full bg-white
              shadow-sm
              transition-[left] duration-200
              ${isAvailable ? "left-[23px]" : "left-[3px]"}
            `}
          />
        </button>
      </div>

      {isUpdating && (
        <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[#2b2d31]/40 dark:text-white/35">
          <RefreshCw size={9} className="animate-spin" />
          Updating availability...
        </div>
      )}

      {error && (
        <p className="mt-2 text-[9px] leading-4 text-rose-600 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default function MyListings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch, isFetching } = useMyListings();

  const listings = data?.myproperties ?? data?.listings ?? [];

  return (
    <AppShell sidebar={<Sidebar links={links} />} centeredContent>
      <div className="space-y-6">
        {/* HERO */}

        <section
          className="
            relative overflow-hidden rounded-[30px]
            border border-black/[0.06]
            bg-gradient-to-br
            from-[#f3f2ee] via-[#e9e8e4] to-[#d8d7d3]
            px-6 py-7
            shadow-[0_20px_60px_rgba(20,23,31,0.055)]
            sm:px-8 sm:py-8
            dark:border-white/[0.06]
            dark:from-[#1c1f26]
            dark:via-[#181b20]
            dark:to-[#121419]
            dark:shadow-none
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/50 blur-3xl dark:bg-white/[0.03]" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex max-w-2xl items-start gap-4">
              <div
                className="
                  mt-1 flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-2xl
                  border border-black/[0.07]
                  bg-white/55
                  text-[#202226]
                  shadow-[0_10px_28px_rgba(20,23,31,0.055)]
                  dark:border-white/[0.08]
                  dark:bg-white/[0.05]
                  dark:text-white
                "
              >
                <Building2 size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
                  Property management
                </p>

                <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[36px] dark:text-white">
                  {t("dashboard.owner.myListingsTitle", "My Listings")}
                </h1>

                <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
                  Manage your properties and keep their availability up to date.
                </p>
              </div>
            </div>

            <Link to="/owner/listings/new" className="shrink-0 no-underline">
              <Button
                pill
                className="
                  flex items-center gap-2
                  border-0
                  bg-[#202226]
                  text-white
                  hover:bg-[#303238]
                  dark:bg-white
                  dark:text-[#17191d]
                  dark:hover:bg-white/90
                "
              >
                <PlusCircle size={15} strokeWidth={1.9} />

                <span>Add listing</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* LISTINGS */}

        <section
          className="
            overflow-hidden rounded-[26px]
            border border-black/[0.07]
            bg-white/52
            shadow-[0_18px_52px_rgba(20,23,31,0.045)]
            backdrop-blur
            dark:border-white/[0.07]
            dark:bg-white/[0.025]
            dark:shadow-none
          "
        >
          <div className="border-b border-black/[0.06] px-5 py-5 sm:px-6 dark:border-white/[0.07]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-black/[0.06]
                    bg-white/60
                    text-[#2a2c30]
                    dark:border-white/[0.08]
                    dark:bg-white/[0.05]
                    dark:text-white/80
                  "
                >
                  <LayoutGrid size={16} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
                    Portfolio
                  </p>

                  <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                    Published properties
                  </h2>

                  <p className="mt-1 text-[12px] text-[#2b2d31]/48 dark:text-white/43">
                    {isLoading
                      ? "Loading your listings..."
                      : `${listings.length} ${
                          listings.length === 1 ? "listing" : "listings"
                        } in your portfolio`}
                  </p>
                </div>
              </div>

              {isFetching && !isLoading && (
                <div
                  className="
                    inline-flex w-fit items-center gap-1.5
                    rounded-full
                    border border-black/[0.07]
                    bg-white/45
                    px-3 py-2
                    text-[10px] font-semibold
                    text-[#2b2d31]/48
                    dark:border-white/[0.08]
                    dark:bg-white/[0.035]
                    dark:text-white/45
                  "
                >
                  <RefreshCw
                    size={11}
                    strokeWidth={1.8}
                    className="animate-spin"
                  />
                  Updating
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {/* LOADING */}

            {isLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      h-80 animate-pulse
                      rounded-[22px]
                      border border-black/[0.06]
                      bg-black/[0.025]
                      dark:border-white/[0.06]
                      dark:bg-white/[0.035]
                    "
                  />
                ))}
              </div>
            )}

            {/* ERROR */}

            {isError && (
              <div
                className="
                  rounded-[22px]
                  border border-rose-200/70
                  bg-rose-50/70
                  px-6 py-10
                  text-center
                  dark:border-rose-400/15
                  dark:bg-rose-400/10
                "
              >
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                  {t("dashboard.error", "Couldn't load your listings.")}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="
                    mt-4 inline-flex items-center gap-1.5
                    rounded-full
                    border border-rose-200
                    bg-white/65
                    px-4 py-2
                    text-[11px] font-semibold
                    text-rose-700
                    transition-colors
                    hover:bg-white
                    dark:border-rose-400/15
                    dark:bg-white/[0.04]
                    dark:text-rose-300
                  "
                >
                  <RefreshCw size={12} />

                  {t("dashboard.retry", "Retry")}
                </button>
              </div>
            )}

            {/* EMPTY */}

            {!isLoading && !isError && listings.length === 0 && (
              <div
                className="
                    rounded-[24px]
                    border border-dashed border-black/10
                    bg-white/30
                    px-6 py-14
                    text-center
                    dark:border-white/10
                    dark:bg-white/[0.018]
                  "
              >
                <div
                  className="
                      mx-auto flex h-12 w-12
                      items-center justify-center
                      rounded-2xl
                      border border-black/[0.07]
                      bg-white/55
                      text-[#202226]
                      dark:border-white/[0.08]
                      dark:bg-white/[0.05]
                      dark:text-white
                    "
                >
                  <PlusCircle size={19} />
                </div>

                <h2 className="mt-4 font-display text-xl font-bold text-[#202226] dark:text-white">
                  No listings yet
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-[#2b2d31]/48 dark:text-white/43">
                  Create your first listing and it will appear here.
                </p>

                <Link
                  to="/owner/listings/new"
                  className="mt-5 inline-block no-underline"
                >
                  <Button
                    pill
                    className="
                        border-0
                        bg-[#202226]
                        text-white
                        hover:bg-[#303238]
                        dark:bg-white
                        dark:text-[#17191d]
                      "
                  >
                    Create your first listing
                  </Button>
                </Link>
              </div>
            )}

            {/* LISTING GRID */}

            {!isLoading && !isError && listings.length > 0 && (
              <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <StaggerItem key={listing._id}>
                    <div>
                      <ListingCard
                        listing={listing}
                        onClick={() => navigate(`/listings/${listing._id}`)}
                      />

                      <AvailabilityControl
                        listing={listing}
                        onUpdated={refetch}
                      />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
