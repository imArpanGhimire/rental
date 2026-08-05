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
import { useAuth } from "../../features/auth/AuthContext.jsx";

const links = [
  { to: "/owner", label: "Overview", icon: Home, end: true },
  { to: "/owner/listings", label: "My Listings", icon: Compass },
  { to: "/owner/messages", label: "Messages", icon: MessageSquare },
  { to: "/owner/favorites", label: "Favorites", icon: Heart },
  { to: "/owner/settings", label: "Settings", icon: Settings },
];

export default function OwnerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useMyListings();
  const listings = data?.myproperties ?? data?.listings ?? [];

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
        <StatCard icon={MessageSquare} value="—" label="Inquiries" />
        <StatCard icon={Home} value="—" label="Avg. rating" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        <DashboardTabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "details", label: "Details" },
            { id: "history", label: "Price History" },
          ]}
        >
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
        </DashboardTabs>

        <div className="lg:sticky lg:top-6 h-[400px] lg:h-[500px]">
          <ListingsMapPanel listings={listings} />
        </div>
      </div>
    </AppShell>
  );
}