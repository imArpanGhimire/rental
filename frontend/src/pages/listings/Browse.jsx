import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AppShell from "../../components/layout/AppShell.jsx";

import ListingFilters from "../../features/listings/components/ListingFilters.jsx";

import PolygonSearchMap from "../../features/listings/components/PolygonSearchMap.jsx";

import FeaturedListingPanel from "../../features/listings/components/FeaturedListingPanel.jsx";

import { useListings } from "../../features/listings/hooks/useListings.js";

import { usePolygonSearch } from "../../features/listings/hooks/usePolygonSearch.js";

import { useDebounce } from "../../hooks/useDebounce.js";

const DEFAULT_CENTER = [27.7172, 85.324];

export default function Browse() {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({});

  const [shape, setShape] = useState(null);

  const debouncedFilters = useDebounce(filters, 400);

  /*
   * Only send filters that are actually supported
   * by the backend.
   */
  const extraFilters = {
    minPrice: debouncedFilters.minPrice || undefined,

    maxPrice: debouncedFilters.maxPrice || undefined,

    search: debouncedFilters.search || undefined,
  };

  /*
   * Default feed when there is no drawn polygon.
   */
  const defaultFeed = useListings(shape ? {} : extraFilters);

  /*
   * Polygon-scoped feed when the user draws
   * a search area.
   */
  const polygonFeed = usePolygonSearch(shape, extraFilters);

  const active = shape ? polygonFeed : defaultFeed;

  const rawResults = active.data?.properties ?? [];

  /*
   * Type filtering is currently handled on
   * the frontend because the existing backend
   * endpoint doesn't need another request for it.
   */
  const results = useMemo(() => {
    if (!filters.type) {
      return rawResults;
    }

    return rawResults.filter((listing) => listing.type === filters.type);
  }, [rawResults, filters.type]);

  const resultCount = results.length;

  return (
    <AppShell>
      <div className="max-w-[1600px] mx-auto w-full">
        {/* =================================================
            PAGE HEADER

            Real voice instead of template copy — tell the
            person what they're looking at and how many
            results it holds.
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 px-1 pt-2 pb-5">
          <div>
            <h1 className="font-display text-[28px] sm:text-[34px] leading-tight text-ink">
              {t("browse.title", "Rentals across the valley")}
            </h1>

            <p className="text-sm text-ink/55 mt-1.5">
              {active.isLoading
                ? t("browse.searching", "Looking...")
                : shape
                  ? t(
                      "browse.countInArea",
                      "{{count}} places in your drawn area",
                      { count: resultCount },
                    )
                  : t("browse.count", "{{count}} places listed right now", {
                      count: resultCount,
                    })}
            </p>
          </div>

          <ListingFilters filters={filters} onChange={setFilters} />
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {active.error && (
          <div className="flex items-center justify-between gap-4 border border-rust/30 bg-rust/[0.06] text-rust text-sm rounded-lg px-4 py-3 mb-5">
            <span>
              {t(
                "browse.error",
                "Listings didn't load. The map and search below may be out of date.",
              )}
            </span>

            <button
              type="button"
              onClick={() => active.refetch?.()}
              className="font-medium underline underline-offset-2 shrink-0"
            >
              {t("browse.retry", "Try again")}
            </button>
          </div>
        )}

        {/* =================================================
            LISTINGS + MAP

            The map is the primary surface for this product —
            let it run edge to edge rather than sitting boxed
            next to an identically-sized card column.

            Desktop: listings rail | map
            Mobile:  listings, then map
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-0 lg:gap-6 -mx-1 lg:mx-0">
          {/* =================================================
              FEATURED LISTING + NEARBY
          ================================================= */}

          <div className="min-w-0 px-1 lg:px-0">
            <FeaturedListingPanel
              listings={results}
              isLoading={active.isLoading}
            />
          </div>

          {/* =================================================
              MAP
          ================================================= */}

          <div className="lg:sticky lg:top-6 h-[420px] lg:h-[calc(100vh-140px)] min-w-0 mt-5 lg:mt-0">
            <PolygonSearchMap
              center={DEFAULT_CENTER}
              shape={shape}
              onShapeChange={setShape}
              results={results}
              isSearching={active.isLoading}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
