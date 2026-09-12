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

  const extraFilters = {
    minPrice: debouncedFilters.minPrice || undefined,
    maxPrice: debouncedFilters.maxPrice || undefined,
    search: debouncedFilters.search || undefined,
  };

  const defaultFeed = useListings(shape ? {} : extraFilters);
  const polygonFeed = usePolygonSearch(shape, extraFilters);

  const active = shape ? polygonFeed : defaultFeed;

  const rawResults = active.data?.properties ?? [];

  const results = useMemo(() => {
    if (!filters.type) {
      return rawResults;
    }

    return rawResults.filter((listing) => listing.type === filters.type);
  }, [rawResults, filters.type]);

  const resultCount = results.length;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1600px]">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 px-1 pb-5 pt-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[28px] leading-tight text-ink sm:text-[34px]">
              {t("browse.title", "Rentals across the valley")}
            </h1>

            <p className="mt-1.5 text-sm text-ink/55">
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
          <div className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-rust/30 bg-rust/[0.06] px-4 py-3 text-sm text-rust">
            <span>
              {t(
                "browse.error",
                "Listings didn't load. The map and search below may be out of date.",
              )}
            </span>

            <button
              type="button"
              onClick={() => active.refetch?.()}
              className="shrink-0 font-medium underline underline-offset-2"
            >
              {t("browse.retry", "Try again")}
            </button>
          </div>
        )}

        {/* =================================================
            LISTINGS + MAP
        ================================================= */}

        <div
          className="
            -mx-1
            grid
            grid-cols-1
            gap-0

            lg:mx-0
            lg:grid-cols-[400px_minmax(0,1fr)]
            lg:items-stretch
            lg:gap-6
          "
        >
          {/* =================================================
              LEFT PROPERTY COLUMN
          ================================================= */}

          <div className="min-w-0 px-1 lg:px-0">
            <FeaturedListingPanel
              listings={results}
              isLoading={active.isLoading}
            />
          </div>

          {/* =================================================
              RIGHT MAP COLUMN

              IMPORTANT:
              This column stretches to the full height of the
              grid row (same height as the property column).

              The child inside it is what becomes sticky.
          ================================================= */}

          <div className="mt-5 min-w-0 lg:mt-0">
            <div
              className="
                h-[420px]

                lg:sticky
                lg:top-[88px]
                lg:h-[calc(100vh-112px)]
              "
            >
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
      </div>
    </AppShell>
  );
}
