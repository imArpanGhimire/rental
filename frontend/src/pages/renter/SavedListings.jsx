import { useTranslation } from "react-i18next";
import { Compass, Heart, Home, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import { StaggerGrid, StaggerItem } from "../../components/ui/StaggerGrid.jsx";
import {
  useFavorites,
  useToggleFavorite,
} from "../../features/favorites/hooks/useFavorites.js";

const links = [
  { to: "/renter", label: "Overview", icon: Home, end: true },
  { to: "/renter/saved", label: "Favorites", icon: Heart },
  { to: "/", label: "Discover", icon: Compass },
  { to: "/renter/settings", label: "Settings", icon: Settings },
];

export default function SavedListings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { listings, isLoading, isError, refetch } = useFavorites();
  const { toggle } = useToggleFavorite();

  return (
    <AppShell sidebar={<Sidebar links={links} />} centeredContent>
      <div className="space-y-6">
        {/* =========================================
            HERO
        ========================================= */}
        <section
          className="
            relative overflow-hidden rounded-[30px] border border-black/[0.06]
            bg-gradient-to-br from-[#f3f2ee] via-[#e9e8e4] to-[#d8d7d3]
            px-6 py-7 shadow-[0_20px_60px_rgba(20,23,31,0.055)]
            sm:px-8 sm:py-8
            dark:border-white/[0.06]
            dark:from-[#1c1f26] dark:via-[#181b20] dark:to-[#121419]
            dark:shadow-none
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/50 blur-3xl dark:bg-white/[0.03]" />
          <div className="pointer-events-none absolute -bottom-24 left-[30%] h-56 w-56 rounded-full bg-white/25 blur-3xl dark:bg-white/[0.02]" />

          <div className="relative flex max-w-2xl items-start gap-4">
            <div
              className="
                mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
                border border-black/[0.07] bg-white/55 text-[#202226]
                shadow-[0_10px_28px_rgba(20,23,31,0.055)]
                dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white
              "
            >
              <Heart size={18} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
                Your collection
              </p>

              <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[36px] dark:text-white">
                {t("dashboard.renter.savedTitle", "Saved Listings")}
              </h1>

              <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
                Keep the places you like in one spot and come back when you're
                ready to compare, contact the owner, or arrange a visit.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            SAVED LISTINGS PANEL
        ========================================= */}
        <section
          className="
            overflow-hidden rounded-[26px] border border-black/[0.07]
            bg-white/[0.52]
            shadow-[0_18px_52px_rgba(20,23,31,0.045)]
            backdrop-blur
            dark:border-white/[0.07]
            dark:bg-white/[0.025]
            dark:shadow-none
          "
        >
          <div className="border-b border-black/[0.06] px-5 py-5 sm:px-6 dark:border-white/[0.07]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
                  Favorites
                </p>

                <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                  {isLoading
                    ? "Saved properties"
                    : `${listings.length} saved ${
                        listings.length === 1 ? "property" : "properties"
                      }`}
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-[#2b2d31]/46 dark:text-white/40">
                  A clean shortlist of the rentals you've marked for later.
                </p>
              </div>

              {!isLoading && !isError && listings.length > 0 && (
                <div
                  className="
                    inline-flex items-center gap-2 rounded-full
                    border border-black/[0.07] bg-white/45
                    px-3 py-2
                    dark:border-white/[0.07] dark:bg-white/[0.03]
                  "
                >
                  <Heart
                    size={12}
                    strokeWidth={1.9}
                    className="text-[#2b2d31]/45 dark:text-white/42"
                  />

                  <span className="text-[10px] font-semibold text-[#2b2d31]/48 dark:text-white/45">
                    {listings.length} saved
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 lg:p-6">
            {/* LOADING */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="
                      overflow-hidden rounded-[22px]
                      border border-black/[0.06]
                      bg-white/[0.35]
                      dark:border-white/[0.06]
                      dark:bg-white/[0.025]
                    "
                  >
                    <div className="h-44 animate-pulse bg-black/[0.035] dark:bg-white/[0.04]" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 w-2/3 animate-pulse rounded-full bg-black/[0.05] dark:bg-white/[0.05]" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-black/[0.04] dark:bg-white/[0.04]" />
                      <div className="h-3 w-1/3 animate-pulse rounded-full bg-black/[0.04] dark:bg-white/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ERROR */}
            {isError && (
              <div
                className="
                  rounded-[20px] border border-rose-200/70
                  bg-rose-50/70 px-5 py-4
                  text-[12px] text-rose-700
                  dark:border-rose-400/15
                  dark:bg-rose-400/10
                  dark:text-rose-300
                "
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span>
                    {t("dashboard.error", "Couldn't load your saved listings.")}
                  </span>

                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="
                      rounded-full border border-rose-300/70
                      px-3 py-1.5 text-[10px] font-semibold
                      transition-colors hover:bg-rose-100
                      dark:border-rose-400/20 dark:hover:bg-rose-400/10
                    "
                  >
                    {t("dashboard.retry", "Retry")}
                  </button>
                </div>
              </div>
            )}

            {/* EMPTY */}
            {!isLoading && !isError && listings.length === 0 && (
              <div
                className="
                  rounded-[22px] border border-dashed border-black/10
                  bg-white/35 px-6 py-14 text-center
                  dark:border-white/10 dark:bg-white/[0.02]
                "
              >
                <div
                  className="
                    mx-auto flex h-12 w-12 items-center justify-center rounded-2xl
                    border border-black/[0.07] bg-white/60 text-[#2b2d31]/45
                    dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/42
                  "
                >
                  <Heart size={19} strokeWidth={1.8} />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#202226] dark:text-white">
                  {t(
                    "dashboard.renter.empty",
                    "You haven't saved any listings yet.",
                  )}
                </p>

                <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-[#2b2d31]/46 dark:text-white/40">
                  Tap the heart on any rental you like and it'll be added here.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="
                    mt-5 inline-flex h-9 items-center justify-center
                    rounded-full border border-black/[0.08]
                    bg-[#202226] px-4
                    text-[10px] font-semibold text-white
                    transition-colors hover:bg-[#303238]
                    dark:border-white/[0.08]
                    dark:bg-white dark:text-[#17191d]
                    dark:hover:bg-white/90
                  "
                >
                  Browse rentals
                </button>
              </div>
            )}

            {/* LISTINGS */}
            {!isLoading && !isError && listings.length > 0 && (
              <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <StaggerItem key={listing._id}>
                    <ListingCard
                      listing={listing}
                      isFavorited={true}
                      onClick={() => navigate(`/listings/${listing._id}`)}
                      onToggleFavorite={(id) => toggle(id, true)}
                    />
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
