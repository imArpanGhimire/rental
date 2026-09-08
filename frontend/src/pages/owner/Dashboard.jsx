import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Home,
  PlusCircle,
  Heart,
  Settings,
  MessageSquare,
  Compass,
  Star,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import Button from "../../components/ui/Button.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import DashboardTabs from "../../components/ui/DashboardTabs.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import { useMyListings } from "../../features/listings/hooks/useMyListings.js";
import {
  useOwnerVisitRequests,
  useUpdateVisitRequestStatus,
} from "../../features/requests/hooks/useVisitRequests.js";
import { getPropertyReviews } from "../../api/reviews.api.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";

const links = [
  {
    to: "/owner",
    label: "Overview",
    icon: Home,
    end: true,
  },
  {
    to: "/owner/listings",
    label: "My Listings",
    icon: Compass,
  },
  {
    to: "/owner/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    to: "/owner/favorites",
    label: "Favorites",
    icon: Heart,
  },
  {
    to: "/owner/settings",
    label: "Settings",
    icon: Settings,
  },
];

const STATUS_STYLES = {
  pending:
    "border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300",
  accepted:
    "border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300",
  declined:
    "border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-400/15 dark:bg-rose-400/10 dark:text-rose-300",
};

function getSavedCount(listing) {
  const directCount =
    listing?.favoriteCount ??
    listing?.favoritesCount ??
    listing?.savedCount ??
    listing?.saveCount ??
    listing?.forlaterCount;

  if (typeof directCount === "number" && Number.isFinite(directCount)) {
    return directCount;
  }

  const savedArray =
    listing?.savedBy ??
    listing?.favorites ??
    listing?.forlater ??
    listing?.savedUsers;

  if (Array.isArray(savedArray)) {
    return savedArray.length;
  }

  return null;
}

function StatTile({ icon: Icon, value, label, helper }) {
  return (
    <div
      className="
        rounded-[22px] border border-black/[0.07] bg-white/55 p-4
        shadow-[0_16px_42px_rgba(20,23,31,0.045)] backdrop-blur
        dark:border-white/[0.07] dark:bg-white/[0.035] dark:shadow-none
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[28px] font-bold tracking-[-0.045em] text-[#202226] dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-[#2b2d31]/70 dark:text-white/65">
            {label}
          </p>
          {helper && (
            <p className="mt-1 text-[11px] leading-4 text-[#2b2d31]/42 dark:text-white/38">
              {helper}
            </p>
          )}
        </div>

        <div
          className="
            flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
            border border-black/[0.06] bg-white/60 text-[#2a2c30]
            dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white/80
          "
        >
          <Icon size={17} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function StatusSummary({ pending, accepted, declined }) {
  const items = [
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
    },
    {
      label: "Accepted",
      value: accepted,
      icon: CheckCircle2,
    },
    {
      label: "Declined",
      value: declined,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="
            rounded-2xl border border-black/[0.06] bg-white/45 px-3 py-3
            dark:border-white/[0.07] dark:bg-white/[0.035]
          "
        >
          <div className="flex items-center gap-2 text-[#2b2d31]/45 dark:text-white/40">
            <Icon size={13} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.11em]">
              {label}
            </span>
          </div>
          <p className="mt-2 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function OwnerRequestRow({ request, onUpdateStatus, isUpdating }) {
  const property = request.property;
  const renter = request.renter;

  const statusClass =
    STATUS_STYLES[request.status] ||
    "border-black/10 bg-white/50 text-[#2b2d31]/60 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/55";

  return (
    <div
      className="
        rounded-[20px] border border-black/[0.07] bg-white/48 p-4
        transition-colors hover:bg-white/68
        dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:bg-white/[0.045]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-[15px] font-bold tracking-[-0.025em] text-[#202226] dark:text-white">
            {property?.title ?? "Listing removed"}
          </p>

          <p className="mt-1 text-[12px] text-[#2b2d31]/55 dark:text-white/50">
            {renter?.name ?? "Renter"}
            {renter?.phone ? ` · ${renter.phone}` : ""}
          </p>
        </div>

        <span
          className={`
            shrink-0 rounded-full border px-2.5 py-1 text-[10px]
            font-semibold capitalize
            ${statusClass}
          `}
        >
          {request.status}
        </span>
      </div>

      {request.message && (
        <p className="mt-3 whitespace-pre-line text-[12px] leading-5 text-[#2b2d31]/58 dark:text-white/52">
          {request.message}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-[#2b2d31]/38 dark:text-white/35">
          <CalendarDays size={11} strokeWidth={1.8} />
          <span>
            Requested{" "}
            {request.createdAt
              ? new Date(request.createdAt).toLocaleDateString()
              : "recently"}
          </span>
        </div>

        {request.status === "pending" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(request._id, "accepted")}
              className="
                rounded-full bg-[#202226] px-4 py-2 text-[11px] font-semibold
                text-white transition-colors hover:bg-[#303238]
                disabled:cursor-not-allowed disabled:opacity-50
                dark:bg-white dark:text-[#17191d] dark:hover:bg-white/90
              "
            >
              Accept
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(request._id, "declined")}
              className="
                rounded-full border border-black/10 bg-white/45 px-4 py-2
                text-[11px] font-semibold text-[#2b2d31]/70 transition-colors
                hover:bg-white/80 hover:text-[#17191d]
                disabled:cursor-not-allowed disabled:opacity-50
                dark:border-white/10 dark:bg-white/[0.035] dark:text-white/65
                dark:hover:bg-white/[0.07] dark:hover:text-white
              "
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useMyListings();
  const listings = data?.myproperties ?? data?.listings ?? [];

  const {
    requests,
    isLoading: requestsLoading,
    isError: requestsError,
  } = useOwnerVisitRequests();

  const updateStatus = useUpdateVisitRequestStatus();

  const reviewQueries = useQueries({
    queries: listings.map((listing) => ({
      queryKey: ["owner-dashboard-reviews", listing._id],
      queryFn: () => getPropertyReviews(listing._id),
      enabled: Boolean(listing._id),
      staleTime: 30000,
    })),
  });

  const averageRating = useMemo(() => {
    let totalRating = 0;
    let totalReviews = 0;

    reviewQueries.forEach((query) => {
      const reviews = query.data?.reviews ?? [];

      reviews.forEach((review) => {
        const rating = Number(review.rating);

        if (Number.isFinite(rating)) {
          totalRating += rating;
          totalReviews += 1;
        }
      });
    });

    if (totalReviews === 0) {
      return null;
    }

    return (totalRating / totalReviews).toFixed(1);
  }, [reviewQueries]);

  const savedByRenters = useMemo(() => {
    let total = 0;
    let foundAtLeastOneCount = false;

    listings.forEach((listing) => {
      const count = getSavedCount(listing);

      if (count !== null) {
        total += count;
        foundAtLeastOneCount = true;
      }
    });

    return foundAtLeastOneCount ? total : null;
  }, [listings]);

  const requestCounts = useMemo(
    () => ({
      pending: requests.filter((request) => request.status === "pending")
        .length,
      accepted: requests.filter((request) => request.status === "accepted")
        .length,
      declined: requests.filter((request) => request.status === "declined")
        .length,
    }),
    [requests],
  );

  const latestRequest = useMemo(() => {
    if (!requests.length) return null;

    return [...requests].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    )[0];
  }, [requests]);

  function handleUpdateStatus(id, status) {
    updateStatus.mutate({
      id,
      status,
    });
  }

  const reviewsLoading = reviewQueries.some((query) => query.isLoading);

  const recentListings = useMemo(() => {
    return [...listings]
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      )
      .slice(0, 3);
  }, [listings]);

  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <div className="space-y-6">
        {/* HERO */}
        <section
          className="
            relative overflow-hidden rounded-[30px] border border-black/[0.06]
            bg-gradient-to-br from-[#f3f2ee] via-[#e9e8e4] to-[#d8d7d3]
            px-6 py-7 shadow-[0_20px_60px_rgba(20,23,31,0.055)]
            sm:px-8 sm:py-8
            dark:border-white/[0.06]
            dark:from-[#1c1f26] dark:via-[#181b20] dark:to-[#121419]
            dark:shadow-none
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/50 blur-3xl dark:bg-white/[0.03]" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
                Owner workspace
              </p>

              <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[36px] dark:text-white">
                {t("dashboard.owner.title", "Welcome back")}
                {user?.name ? `, ${user.name}` : ""}
              </h1>

              <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
                {t(
                  "dashboard.owner.subtitle",
                  "Manage your properties, review visit requests and keep track of renter activity.",
                )}
              </p>
            </div>

            <Link to="/owner/listings/new" className="shrink-0 no-underline">
              <Button
                pill
                className="flex items-center gap-2 border-0 bg-[#202226] text-white hover:bg-[#303238] dark:bg-white dark:text-[#17191d]"
              >
                <PlusCircle size={15} strokeWidth={1.9} />
                <span>{t("dashboard.owner.newListing", "New listing")}</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            icon={Compass}
            value={isLoading ? "—" : listings.length}
            label="Total listings"
            helper="Properties you manage"
          />

          <StatTile
            icon={Heart}
            value={
              isLoading ? "—" : savedByRenters === null ? "—" : savedByRenters
            }
            label="Saved by renters"
            helper="Across your listings"
          />

          <StatTile
            icon={MessageSquare}
            value={requestsLoading ? "—" : requests.length}
            label="Visit requests"
            helper={
              requestsLoading
                ? "Loading activity"
                : `${requestCounts.pending} waiting for response`
            }
          />

          <StatTile
            icon={Star}
            value={isLoading || reviewsLoading ? "—" : (averageRating ?? "—")}
            label="Average rating"
            helper="Across received reviews"
          />
        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.75fr)]">
          {/* LISTINGS + REQUESTS */}
          <div
            className="
              overflow-hidden rounded-[26px] border border-black/[0.07]
              bg-white/52 shadow-[0_18px_52px_rgba(20,23,31,0.045)]
              backdrop-blur
              dark:border-white/[0.07] dark:bg-white/[0.025] dark:shadow-none
            "
          >
            <div className="border-b border-black/[0.06] px-5 py-5 sm:px-6 dark:border-white/[0.07]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
                    Property management
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                    Listings & requests
                  </h2>
                  <p className="mt-1 text-[12px] text-[#2b2d31]/48 dark:text-white/43">
                    Review your properties and respond to renter visits.
                  </p>
                </div>

                <Link
                  to="/owner/listings"
                  className="
                    hidden items-center gap-1.5 rounded-full border border-black/[0.08]
                    bg-white/50 px-3 py-2 text-[11px] font-semibold text-[#2b2d31]/65
                    no-underline transition-colors hover:bg-white/80 hover:text-[#17191d]
                    sm:inline-flex
                    dark:border-white/[0.08] dark:bg-white/[0.035]
                    dark:text-white/60 dark:hover:bg-white/[0.07] dark:hover:text-white
                  "
                >
                  View all
                  <ArrowUpRight size={12} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <DashboardTabs
                tabs={[
                  {
                    id: "overview",
                    label: "Listings",
                    content: (
                      <>
                        {isLoading && (
                          <div className="flex flex-col gap-3">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="h-24 animate-pulse rounded-[18px] border border-black/[0.06] bg-black/[0.025] dark:border-white/[0.06] dark:bg-white/[0.035]"
                              />
                            ))}
                          </div>
                        )}

                        {isError && <ErrorState onRetry={refetch} />}

                        {!isLoading && !isError && listings.length === 0 && (
                          <div className="rounded-[20px] border border-dashed border-black/10 bg-white/35 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                            <p className="text-sm font-semibold text-[#202226] dark:text-white">
                              No listings yet
                            </p>
                            <p className="mx-auto mt-1 max-w-sm text-[12px] leading-5 text-[#2b2d31]/48 dark:text-white/43">
                              Create your first property listing to start
                              receiving renter interest and visit requests.
                            </p>

                            <Link
                              to="/owner/listings/new"
                              className="mt-5 inline-block no-underline"
                            >
                              <Button variant="outline">
                                Create your first listing
                              </Button>
                            </Link>
                          </div>
                        )}

                        {!isLoading && !isError && listings.length > 0 && (
                          <div className="flex flex-col gap-3">
                            {listings.map((listing) => (
                              <ListingCard
                                key={listing._id}
                                listing={listing}
                                variant="row"
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ),
                  },
                  {
                    id: "requests",
                    label: `Requests${requests.length ? ` (${requests.length})` : ""}`,
                    content: (
                      <>
                        {requestsError && (
                          <div className="rounded-[18px] border border-rose-200/70 bg-rose-50/70 px-4 py-3 text-[12px] text-rose-700 dark:border-rose-400/15 dark:bg-rose-400/10 dark:text-rose-300">
                            Couldn't load visit requests.
                          </div>
                        )}

                        {requestsLoading && (
                          <div className="flex flex-col gap-3">
                            {[...Array(2)].map((_, i) => (
                              <div
                                key={i}
                                className="h-28 animate-pulse rounded-[20px] border border-black/[0.06] bg-black/[0.025] dark:border-white/[0.06] dark:bg-white/[0.035]"
                              />
                            ))}
                          </div>
                        )}

                        {!requestsLoading &&
                          !requestsError &&
                          requests.length === 0 && (
                            <div className="rounded-[20px] border border-dashed border-black/10 bg-white/35 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                              <p className="text-sm font-semibold text-[#202226] dark:text-white">
                                No visit requests yet
                              </p>
                              <p className="mt-1 text-[12px] text-[#2b2d31]/48 dark:text-white/43">
                                New renter requests will appear here.
                              </p>
                            </div>
                          )}

                        {!requestsLoading &&
                          !requestsError &&
                          requests.length > 0 && (
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
                          )}
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <div
              className="
                rounded-[26px] border border-black/[0.07] bg-white/52 p-5
                shadow-[0_18px_52px_rgba(20,23,31,0.045)] backdrop-blur
                dark:border-white/[0.07] dark:bg-white/[0.025] dark:shadow-none
              "
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
                Visit activity
              </p>
              <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                Request overview
              </h2>

              <div className="mt-4">
                <StatusSummary
                  pending={requestsLoading ? "—" : requestCounts.pending}
                  accepted={requestsLoading ? "—" : requestCounts.accepted}
                  declined={requestsLoading ? "—" : requestCounts.declined}
                />
              </div>

              <div className="mt-4 rounded-[18px] border border-black/[0.06] bg-white/40 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2b2d31]/38 dark:text-white/35">
                  Latest request
                </p>

                {requestsLoading ? (
                  <div className="mt-3 h-12 animate-pulse rounded-xl bg-black/[0.035] dark:bg-white/[0.04]" />
                ) : latestRequest ? (
                  <>
                    <p className="mt-2 text-[13px] font-semibold text-[#202226] dark:text-white">
                      {latestRequest.property?.title ?? "Listing removed"}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-[#2b2d31]/48 dark:text-white/43">
                      From {latestRequest.renter?.name ?? "a renter"}
                      {latestRequest.createdAt
                        ? ` · ${new Date(
                            latestRequest.createdAt,
                          ).toLocaleDateString()}`
                        : ""}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-[12px] text-[#2b2d31]/48 dark:text-white/43">
                    No visit activity yet.
                  </p>
                )}
              </div>
            </div>

            <div
              className="
                overflow-hidden rounded-[26px] border border-black/[0.07]
                bg-white/52 shadow-[0_18px_52px_rgba(20,23,31,0.045)]
                backdrop-blur
                dark:border-white/[0.07] dark:bg-white/[0.025] dark:shadow-none
              "
            >
              <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 pb-4 pt-5 dark:border-white/[0.07]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
                    Portfolio snapshot
                  </p>

                  <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                    Recently added
                  </h2>

                  <p className="mt-1 text-[12px] text-[#2b2d31]/48 dark:text-white/43">
                    A quick look at your latest properties.
                  </p>
                </div>

                <Link
                  to="/owner/listings"
                  className="
                    inline-flex shrink-0 items-center gap-1.5 rounded-full
                    border border-black/[0.08] bg-white/50 px-3 py-2
                    text-[10px] font-semibold text-[#2b2d31]/62 no-underline
                    transition-colors hover:bg-white/80 hover:text-[#17191d]
                    dark:border-white/[0.08] dark:bg-white/[0.035]
                    dark:text-white/58 dark:hover:bg-white/[0.07] dark:hover:text-white
                  "
                >
                  View all
                  <ArrowUpRight size={11} strokeWidth={1.8} />
                </Link>
              </div>

              <div className="p-4">
                {isLoading ? (
                  <div className="space-y-2.5">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-[72px] animate-pulse rounded-[16px] border border-black/[0.06] bg-black/[0.025] dark:border-white/[0.06] dark:bg-white/[0.035]"
                      />
                    ))}
                  </div>
                ) : recentListings.length > 0 ? (
                  <div className="space-y-2.5">
                    {recentListings.map((listing) => {
                      const image =
                        listing.images?.[0]?.url ?? listing.images?.[0] ?? null;

                      const address =
                        listing.location?.address ??
                        listing.address ??
                        "Location not specified";

                      return (
                        <Link
                          key={listing._id}
                          to={`/listings/${listing._id}`}
                          className="
                            flex items-center gap-3 rounded-[17px]
                            border border-black/[0.06] bg-white/38 p-2.5
                            no-underline transition-colors hover:bg-white/70
                            dark:border-white/[0.07] dark:bg-white/[0.02]
                            dark:hover:bg-white/[0.045]
                          "
                        >
                          <div className="h-14 w-16 shrink-0 overflow-hidden rounded-[13px] bg-black/[0.04] dark:bg-white/[0.04]">
                            {image ? (
                              <img
                                src={image}
                                alt={listing.title ?? "Property"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#2b2d31]/28 dark:text-white/25">
                                <Home size={16} strokeWidth={1.7} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold text-[#202226] dark:text-white">
                              {listing.title ?? "Untitled property"}
                            </p>

                            <p className="mt-1 truncate text-[10px] text-[#2b2d31]/44 dark:text-white/40">
                              {address}
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-[#2b2d31]/68 dark:text-white/62">
                              {Number.isFinite(Number(listing.price))
                                ? `NPR ${Number(listing.price).toLocaleString()} / month`
                                : "Price not set"}
                            </p>
                          </div>

                          <ArrowUpRight
                            size={13}
                            strokeWidth={1.8}
                            className="shrink-0 text-[#2b2d31]/32 dark:text-white/30"
                          />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-dashed border-black/10 bg-white/30 px-5 py-8 text-center dark:border-white/10 dark:bg-white/[0.018]">
                    <p className="text-[12px] font-semibold text-[#202226] dark:text-white">
                      No properties yet
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#2b2d31]/46 dark:text-white/42">
                      Your latest listings will appear here after you publish
                      them.
                    </p>

                    <Link
                      to="/owner/listings/new"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#202226] px-3.5 py-2 text-[10px] font-semibold text-white no-underline transition-colors hover:bg-[#303238] dark:bg-white dark:text-[#17191d] dark:hover:bg-white/90"
                    >
                      <PlusCircle size={11} strokeWidth={1.9} />
                      Add listing
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
