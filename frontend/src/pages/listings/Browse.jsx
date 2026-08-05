import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "../../components/layout/AppShell.jsx";
import ListingFilters from "../../features/listings/components/ListingFilters.jsx";
import PolygonSearchMap from "../../features/listings/components/PolygonSearchMap.jsx";
import FeaturedListingPanel from "../../features/listings/components/FeaturedListingPanel.jsx";
import { useListings } from "../../features/listings/hooks/useListings.js";
import { usePolygonSearch } from "../../features/listings/hooks/usePolygonSearch.js";
import { useDebounce } from "../../hooks/useDebounce.js";

const DEFAULT_CENTER = [27.7172, 85.324]; // Kathmandu

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

  // Default feed (no shape drawn yet) vs polygon-scoped search — only one is active at a time
  const defaultFeed = useListings(shape ? {} : extraFilters);
  const polygonFeed = usePolygonSearch(shape, extraFilters);
  const active = shape ? polygonFeed : defaultFeed;

  const rawResults = active.data?.properties ?? [];
  const results = useMemo(
    () => (filters.type ? rawResults.filter((l) => l.type === filters.type) : rawResults),
    [rawResults, filters.type]
  );

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-xl sm:text-2xl text-text mb-5">
          {t("browse.title", "Find your next home")}
        </h1>

        <ListingFilters filters={filters} onChange={setFilters} />

        {active.error && (
          <p className="text-sm text-red-600 mb-4">{t("browse.error", "Couldn't load listings.")}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6">
          <div
            key={shape ? `polygon-${results.length}` : `default-${results.length}`}
            className="animate-[panel-fade-in_420ms_var(--ease-honey-soft)_both]"
          >
            <FeaturedListingPanel listings={results} isLoading={active.isLoading} />
          </div>

          <div className="lg:sticky lg:top-6 h-[400px] lg:h-[560px]">
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
