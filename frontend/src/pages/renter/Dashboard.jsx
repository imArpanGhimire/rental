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
import { useFavorites } from "../../features/favorites/hooks/useFavorites.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";

const links = [
  { to: "/renter", label: "Overview", icon: Home, end: true },
  { to: "/renter/saved", label: "Favorites", icon: Heart },
  { to: "/renter/messages", label: "Messages", icon: MessageSquare },
  { to: "/", label: "Discover", icon: Compass },
  { to: "/renter/settings", label: "Settings", icon: Settings },
];

export default function RenterDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError } = useFavorites();
  const listings = data?.listings ?? [];

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
        <StatCard icon={MessageSquare} value="—" label="Inquiries sent" />
        <StatCard icon={Compass} value="—" label="Viewed this week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        <DashboardTabs
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "tour", label: "Virtual Tour" },
          ]}
        >
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