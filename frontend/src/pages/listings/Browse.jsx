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

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto w-full">
        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <h1 className="font-display text-xl sm:text-2xl text-text mb-5">
          {t("browse.title", "Find your next home")}
        </h1>

        {/* =================================================
            FILTERS
        ================================================= */}

        <ListingFilters filters={filters} onChange={setFilters} />

        {/* =================================================
            ERROR
        ================================================= */}

        {active.error && (
          <p className="text-sm text-red-600 mb-4">
            {t("browse.error", "Couldn't load listings.")}
          </p>
        )}

        {/* =================================================
            LISTINGS + MAP

            Desktop:
              Listings | Map

            Mobile:
              Listings
              Map
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6">
          {/* =================================================
              FEATURED LISTING + NEARBY
          ================================================= */}

          <div
            key={
              shape ? `polygon-${results.length}` : `default-${results.length}`
            }
            className="min-w-0 animate-[panel-fade-in_420ms_var(--ease-honey-soft)_both]"
          >
            <FeaturedListingPanel
              listings={results}
              isLoading={active.isLoading}
            />
          </div>

          {/* =================================================
              MAP
          ================================================= */}

          <div className="lg:sticky lg:top-6 h-[400px] lg:h-[560px] min-w-0">
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
