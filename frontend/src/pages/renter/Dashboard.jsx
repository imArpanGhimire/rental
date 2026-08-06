import { Home, Heart, Settings, MessageSquare, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Button from "../../components/ui/Button.jsx";
import DashboardTabs from "../../components/ui/DashboardTabs.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import ListingsMapPanel from "../../features/listings/components/ListingsMapPanel.jsx";
import { useFavorites, useToggleFavorite } from "../../features/favorites/hooks/useFavorites.js";
import { useMyVisitRequests } from "../../features/requests/hooks/useVisitRequests.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

const links = [
  { to: "/renter", label: "Overview", icon: Home, end: true },
  { to: "/renter/saved", label: "Favorites", icon: Heart },
  { to: "/renter/messages", label: "Messages", icon: MessageSquare },
  { to: "/", label: "Discover", icon: Compass },
  { to: "/renter/settings", label: "Settings", icon: Settings },
];

const STATUS_STYLES = {
  pending: "bg-brass-light text-brass",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

function RequestRow({ request }) {
  const property = request.property;
  const statusClass = STATUS_STYLES[request.status] || "bg-ivory text-text/60";

  return (
    <div className="border border-stone rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-base text-text">{property?.title ?? "Listing removed"}</p>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusClass}`}>
          {request.status}
        </span>
      </div>
      {property?.price && (
        <p className="text-sm text-text/60">{formatPrice(property.price)} /Month</p>
      )}
      {request.message && (
        <p className="text-sm text-text/70 whitespace-pre-line">{request.message}</p>
      )}
      <p className="text-xs text-text/40">
        Sent {new Date(request.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default function RenterDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { listings, isLoading, isError } = useFavorites();
  const { toggle } = useToggleFavorite();
  const { requests, isLoading: requestsLoading, isError: requestsError } = useMyVisitRequests();

  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-text">
          {t("dashboard.renter.title", "Welcome back")}{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-sm text-text/50 mt-1">Places you've saved, all in one view.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Heart} value={isLoading ? "—" : listings.length} label="Saved listings" />
        <StatCard icon={MessageSquare} value={requestsLoading ? "—" : requests.length} label="Requests sent" />
        <StatCard icon={Compass} value="—" label="Viewed this week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        <DashboardTabs
          tabs={[
            {
              id: "overview",
              label: "Overview",
              content: (
                <>
                  {isError && <p className="text-sm text-red-600">Couldn't load your saved listings.</p>}

                  {!isLoading && !isError && listings.length === 0 && (
                    <div className="border border-stone rounded-2xl p-8 text-center">
                      <p className="text-sm text-text/60 mb-4">You haven't saved any listings yet.</p>
                      <Link to="/">
                        <Button variant="outline">Browse listings</Button>
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing._id}
                        listing={listing}
                        variant="row"
                        isFavorited={true}
                        onToggleFavorite={(id) => toggle(id, true)}
                      />
                    ))}
                  </div>
                </>
              ),
            },
            {
              id: "requests",
              label: "Requests",
              content: (
                <>
                  {requestsError && (
                    <p className="text-sm text-red-600">Couldn't load your visit requests.</p>
                  )}

                  {requestsLoading && (
                    <div className="flex flex-col gap-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl border border-stone bg-brass-light/40 animate-pulse" />
                      ))}
                    </div>
                  )}

                  {!requestsLoading && !requestsError && requests.length === 0 && (
                    <div className="border border-stone rounded-2xl p-8 text-center">
                      <p className="text-sm text-text/60">You haven't requested any visits yet.</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {requests.map((request) => (
                      <RequestRow key={request._id} request={request} />
                    ))}
                  </div>
                </>
              ),
            },
          ]}
        />

        <div className="lg:sticky lg:top-6 lg:self-start h-[400px] lg:h-[500px]">
          <ListingsMapPanel listings={listings} favorites={listings.map((l) => l._id)} onToggleFavorite={(id) => toggle(id, true)} />
        </div>
      </div>
    </AppShell>
  );
}
