import { useTranslation } from "react-i18next";
import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import { StaggerGrid, StaggerItem } from "../../components/ui/StaggerGrid.jsx";
import { useMyListings } from "../../features/listings/hooks/useMyListings.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";

const links = [
  { to: "/owner", label: "Overview" },
  { to: "/owner/listings", label: "My Listings" },
];

export default function MyListings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useMyListings();
  const listings = data?.listings ?? [];

  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <h1 className="font-display text-3xl text-text mb-6">
        {t("dashboard.owner.myListingsTitle", "My Listings")}
      </h1>

      {isLoading && <p className="text-sm text-text/70">{t("dashboard.loading", "Loading...")}</p>}

      {isError && (
        <div className="text-sm text-red-600 flex items-center gap-3">
          {t("dashboard.error", "Couldn't load your listings.")}
          <button onClick={() => refetch()} className="text-brass underline">
            {t("dashboard.retry", "Retry")}
          </button>
        </div>
      )}

      {!isLoading && !isError && listings.length === 0 && (
        <p className="text-sm text-text/60">
          {t("dashboard.owner.empty", "You haven't posted any listings yet.")}
        </p>
      )}

      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <StaggerItem key={listing._id}>
            <ListingCard listing={listing} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </AppShell>
  );
}