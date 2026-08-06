import { useTranslation } from "react-i18next";
import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import { StaggerGrid, StaggerItem } from "../../components/ui/StaggerGrid.jsx";
import { useFavorites, useToggleFavorite } from "../../features/favorites/hooks/useFavorites.js";

const links = [
  { to: "/renter", label: "Overview" },
  { to: "/renter/saved", label: "Saved Listings" },
];

export default function SavedListings() {
  const { t } = useTranslation();
  const { listings, isLoading, isError, refetch } = useFavorites();
  const { toggle } = useToggleFavorite();

  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <h1 className="font-display text-3xl text-text mb-6">
        {t("dashboard.renter.savedTitle", "Saved Listings")}
      </h1>

      {isLoading && <p className="text-sm text-text/70">{t("dashboard.loading", "Loading...")}</p>}

      {isError && (
        <div className="text-sm text-red-600 flex items-center gap-3">
          {t("dashboard.error", "Couldn't load your saved listings.")}
          <button onClick={() => refetch()} className="text-brass underline">
            {t("dashboard.retry", "Retry")}
          </button>
        </div>
      )}

      {!isLoading && !isError && listings.length === 0 && (
        <p className="text-sm text-text/60">
          {t("dashboard.renter.empty", "You haven't saved any listings yet.")}
        </p>
      )}

      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <StaggerItem key={listing._id}>
            <ListingCard
              listing={listing}
              isFavorited={true}
              onToggleFavorite={(id) => toggle(id, true)}
            />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </AppShell>
  );
}
