import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import { StaggerGrid, StaggerItem } from "../../components/ui/StaggerGrid.jsx";
import { useMyListings } from "../../features/listings/hooks/useMyListings.js";
import Button from "../../components/ui/Button.jsx";

const links = [
  { to: "/owner", label: "Overview" },
  { to: "/owner/listings", label: "My Listings" },
  { to: "/owner/listings/new", label: "Add Listing" },
];

export default function MyListings() {
  const { t } = useTranslation();

  const { data, isLoading, isError, refetch, isFetching } = useMyListings();

  /*
   * Your backend uses `myproperties`.
   * `listings` is kept as a fallback in case the backend response changes.
   */
  const listings = data?.myproperties ?? data?.listings ?? [];

  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-brass font-semibold mb-2">
            Owner
          </p>

          <h1 className="font-display text-3xl sm:text-4xl text-text">
            {t("dashboard.owner.myListingsTitle", "My Listings")}
          </h1>

          <p className="text-sm text-text/50 mt-2">
            Manage the properties you have posted.
          </p>
        </div>

        <Link to="/owner/listings/new" className="shrink-0">
          <Button pill className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Listing</span>
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 rounded-2xl border border-stone bg-bg animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-stone bg-bg p-8 text-center">
          <p className="text-sm text-red-600 mb-4">
            {t("dashboard.error", "Couldn't load your listings.")}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium text-brass underline underline-offset-4"
          >
            {t("dashboard.retry", "Retry")}
          </button>
        </div>
      )}

      {!isLoading && !isError && listings.length === 0 && (
        <div className="rounded-3xl border border-stone bg-bg p-10 sm:p-14 text-center">
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-brass-light flex items-center justify-center">
            <PlusCircle size={23} className="text-brass" />
          </div>

          <h2 className="font-display text-xl text-text mb-2">
            No listings yet
          </h2>

          <p className="text-sm text-text/55 max-w-sm mx-auto mb-6">
            You haven't posted any properties yet. Add your first listing and it
            will appear here.
          </p>

          <Link to="/owner/listings/new">
            <Button pill>Create your first listing</Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && listings.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-text/55">
              {listings.length} {listings.length === 1 ? "listing" : "listings"}
            </p>

            {isFetching && (
              <span className="text-xs text-text/40">Updating...</span>
            )}
          </div>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <StaggerItem key={listing._id}>
                <ListingCard listing={listing} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </>
      )}
    </AppShell>
  );
}
