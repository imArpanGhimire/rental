import { Home, PlusCircle, Heart, Settings, MessageSquare, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Button from "../../components/ui/Button.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import DashboardTabs from "../../components/ui/DashboardTabs.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import ListingsMapPanel from "../../features/listings/components/ListingsMapPanel.jsx";
import { useMyListings } from "../../features/listings/hooks/useMyListings.js";
import { useOwnerVisitRequests, useUpdateVisitRequestStatus } from "../../features/requests/hooks/useVisitRequests.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";

const links = [
  { to: "/owner", label: "Overview", icon: Home, end: true },
  { to: "/owner/listings", label: "My Listings", icon: Compass },
  { to: "/owner/messages", label: "Messages", icon: MessageSquare },
  { to: "/owner/favorites", label: "Favorites", icon: Heart },
  { to: "/owner/settings", label: "Settings", icon: Settings },
];

const STATUS_STYLES = {
  pending: "bg-brass-light text-brass",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

function OwnerRequestRow({ request, onUpdateStatus, isUpdating }) {
  const property = request.property;
  const renter = request.renter;
  const statusClass = STATUS_STYLES[request.status] || "bg-ivory text-text/60";

  return (
    <div className="border border-stone rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-base text-text">{property?.title ?? "Listing removed"}</p>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusClass}`}>
          {request.status}
        </span>
      </div>
      <p className="text-sm text-text/70">
        {renter?.name}
        {renter?.phone ? ` · ${renter.phone}` : ""}
      </p>
      {request.message && (
        <p className="text-sm text-text/70 whitespace-pre-line">{request.message}</p>
      )}
      <p className="text-xs text-text/40">
        Requested {new Date(request.createdAt).toLocaleDateString()}
      </p>

      {request.status === "pending" && (
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateStatus(request._id, "accepted")}
            className="bg-ink text-ivory text-xs font-medium px-4 py-2 rounded-full disabled:opacity-60"
          >
            Accept
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateStatus(request._id, "declined")}
            className="border border-stone text-text text-xs font-medium px-4 py-2 rounded-full disabled:opacity-60"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

export default function OwnerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useMyListings();
  const listings = data?.myproperties ?? data?.listings ?? [];
  const { requests, isLoading: requestsLoading, isError: requestsError } = useOwnerVisitRequests();
  const updateStatus = useUpdateVisitRequestStatus();

  function handleUpdateStatus(id, status) {
    updateStatus.mutate({ id, status });
  }

  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-text">
            {t("dashboard.owner.title", "Welcome back")}{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-text/50 mt-1">
            {t("dashboard.owner.subtitle", "Here's how your listings are doing.")}
          </p>
        </div>
        <Link to="/owner/listings/new">
          <Button pill className="flex items-center gap-2 shrink-0">
            <PlusCircle size={16} />
            <span className="hidden sm:inline">{t("dashboard.owner.newListing", "New listing")}</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Compass} value={isLoading ? "—" : listings.length} label="Total listings" />
        <StatCard icon={Heart} value="—" label="Saved by renters" />
        <StatCard icon={MessageSquare} value={requestsLoading ? "—" : requests.length} label="Requests" />
        <StatCard icon={Home} value="—" label="Avg. rating" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        <DashboardTabs
          tabs={[
            {
              id: "overview",
              label: "Overview",
              content: (
                <>
                  {isLoading && (
                    <div className="flex flex-col gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 rounded-xl border border-stone bg-brass-light/40 animate-pulse" />
                      ))}
                    </div>
                  )}

                  {isError && <ErrorState onRetry={refetch} />}

                  {!isLoading && !isError && listings.length === 0 && (
                    <div className="border border-stone rounded-2xl p-8 text-center">
                      <p className="text-sm text-text/60 mb-4">You haven't posted any listings yet.</p>
                      <Link to="/owner/listings/new">
                        <Button variant="outline">Create your first listing</Button>
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {listings.map((listing) => (
                      <ListingCard key={listing._id} listing={listing} variant="row" />
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
                    <p className="text-sm text-red-600">Couldn't load visit requests.</p>
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
                      <p className="text-sm text-text/60">No visit requests yet.</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {requests.map((request) => (
                      <OwnerRequestRow
                        key={request._id}
                        request={request}
                        onUpdateStatus={handleUpdateStatus}
                        isUpdating={updateStatus.isPending}
                      />
                    ))}
                  </div>
                </>
              ),
            },
          ]}
        />

        <div className="lg:sticky lg:top-6 lg:self-start h-[400px] lg:h-[500px]">
          <ListingsMapPanel listings={listings} />
        </div>
      </div>
    </AppShell>
  );
}
