import { useMemo } from "react";
import {
  CheckCircle2,
  Clock3,
  Compass,
  Heart,
  Home,
  MessageSquare,
  Settings,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import DashboardTabs from "../../components/ui/DashboardTabs.jsx";
import ListingCard from "../../features/listings/components/ListingCard.jsx";
import {
  useFavorites,
  useToggleFavorite,
} from "../../features/favorites/hooks/useFavorites.js";
import { useMyVisitRequests } from "../../features/requests/hooks/useVisitRequests.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

const links = [
  { to: "/renter", label: "Overview", icon: Home, end: true },
  { to: "/renter/saved", label: "Favorites", icon: Heart },
  { to: "/", label: "Discover", icon: Compass },
  { to: "/renter/settings", label: "Settings", icon: Settings },
];

const STATUS_STYLES = {
  pending: "border-amber-400/15 bg-amber-400/[0.09] text-amber-300",
  accepted: "border-emerald-400/15 bg-emerald-400/[0.09] text-emerald-300",
  declined: "border-rose-400/15 bg-rose-400/[0.09] text-rose-300",
};

function StatTile({ icon: Icon, value, label, helper }) {
  return (
    <div
      className="
        rounded-[22px] border border-black/[0.07] bg-white/[0.52] p-4
        shadow-[0_16px_42px_rgba(20,23,31,0.045)] backdrop-blur
        dark:border-white/[0.07] dark:bg-white/[0.035] dark:shadow-none
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/38 dark:text-white/35">
            {label}
          </p>

          <p className="mt-2 font-display text-[27px] font-bold tracking-[-0.045em] text-[#202226] dark:text-white">
            {value}
          </p>
        </div>

        <span
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px]
            border border-black/[0.06] bg-white/[0.48] text-[#2b2d31]/48
            dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-white/45
          "
        >
          <Icon size={15} strokeWidth={1.8} />
        </span>
      </div>

      <p className="mt-3 text-[10px] leading-5 text-[#2b2d31]/42 dark:text-white/36">
        {helper}
      </p>
    </div>
  );
}

function StatusRow({ icon: Icon, label, value, className }) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-black/[0.06] bg-white/[0.35] px-3.5 py-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl border ${className}`}
        >
          <Icon size={13} strokeWidth={1.9} />
        </span>

        <span className="text-[11px] font-medium text-[#2b2d31]/60 dark:text-white/58">
          {label}
        </span>
      </div>

      <span className="font-display text-[15px] font-bold text-[#202226] dark:text-white">
        {value}
      </span>
    </div>
  );
}

function RequestRow({ request }) {
  const property = request.property;
  const statusClass =
    STATUS_STYLES[request.status] ||
    "border-white/[0.08] bg-white/[0.04] text-white/55";

  return (
    <div className="rounded-[18px] border border-black/[0.07] bg-white/[0.36] p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-[#202226] dark:text-white">
            {property?.title ?? "Listing removed"}
          </p>

          {property?.price && (
            <p className="mt-1 text-[10px] text-[#2b2d31]/42 dark:text-white/36">
              {formatPrice(property.price)} / month
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold capitalize ${statusClass}`}
        >
          {request.status}
        </span>
      </div>

      {request.message && (
        <p className="mt-3 whitespace-pre-line text-[10px] leading-5 text-[#2b2d31]/48 dark:text-white/42">
          {request.message}
        </p>
      )}

      <p className="mt-3 text-[9px] text-[#2b2d31]/30 dark:text-white/28">
        Sent{" "}
        {request.createdAt
          ? new Date(request.createdAt).toLocaleDateString()
          : "recently"}
      </p>
    </div>
  );
}

export default function RenterDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { listings, isLoading, isError } = useFavorites();
  const { toggle } = useToggleFavorite();

  const {
    requests,
    isLoading: requestsLoading,
    isError: requestsError,
  } = useMyVisitRequests();

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

  return (
    <AppShell sidebar={<Sidebar links={links} />} centeredContent>
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

          <div className="relative max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
              Renter dashboard
            </p>

            <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[36px] dark:text-white">
              {t("dashboard.renter.title", "Renter Dashboard")}
              {user?.name ? `, ${user.name}` : ""}
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
              Keep track of the places you've saved, your visit requests, and
              what you want to explore next.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile
            icon={Heart}
            value={isLoading ? "—" : listings.length}
            label="Saved listings"
            helper="Properties you've kept for later."
          />

          <StatTile
            icon={MessageSquare}
            value={requestsLoading ? "—" : requests.length}
            label="Requests sent"
            helper="Visit requests you've submitted."
          />

          <StatTile
            icon={Clock3}
            value={requestsLoading ? "—" : requestCounts.pending}
            label="Pending requests"
            helper="Waiting for an owner's response."
          />
        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.75fr)]">
          {/* SAVED + REQUESTED */}
          <div
            className="
              overflow-hidden rounded-[26px] border border-black/[0.07]
              bg-white/[0.52] shadow-[0_18px_52px_rgba(20,23,31,0.045)]
              backdrop-blur
              dark:border-white/[0.07] dark:bg-white/[0.025] dark:shadow-none
            "
          >
            <div className="border-b border-black/[0.06] px-5 py-5 sm:px-6 dark:border-white/[0.07]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
                    Your activity
                  </p>

                  <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                    Saved & requested
                  </h2>
                </div>

                <Link
                  to="/renter/saved"
                  className="
                    inline-flex items-center gap-1.5 rounded-full
                    border border-black/[0.08] bg-white/50 px-3 py-2
                    text-[10px] font-semibold text-[#2b2d31]/58 no-underline
                    transition-colors hover:bg-white/80 hover:text-[#17191d]
                    dark:border-white/[0.08] dark:bg-white/[0.035]
                    dark:text-white/55 dark:hover:bg-white/[0.07]
                    dark:hover:text-white
                  "
                >
                  View saved
                  <ArrowUpRight size={11} strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <DashboardTabs
                tabs={[
                  {
                    id: "overview",
                    label: "Overview",
                    content: (
                      <>
                        {isLoading && (
                          <div className="flex flex-col gap-3">
                            {[...Array(3)].map((_, index) => (
                              <div
                                key={index}
                                className="h-24 animate-pulse rounded-[18px] border border-black/[0.06] bg-black/[0.025] dark:border-white/[0.06] dark:bg-white/[0.035]"
                              />
                            ))}
                          </div>
                        )}

                        {isError && (
                          <div className="rounded-[18px] border border-rose-200/70 bg-rose-50/70 px-4 py-3 text-[11px] text-rose-700 dark:border-rose-400/15 dark:bg-rose-400/10 dark:text-rose-300">
                            Couldn't load your saved listings.
                          </div>
                        )}

                        {!isLoading && !isError && listings.length === 0 && (
                          <div className="rounded-[20px] border border-dashed border-black/10 bg-white/35 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                            <p className="text-sm font-semibold text-[#202226] dark:text-white">
                              No saved listings yet
                            </p>

                            <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-[#2b2d31]/48 dark:text-white/43">
                              Save properties while browsing and they'll appear
                              here.
                            </p>
                          </div>
                        )}

                        {!isLoading && !isError && listings.length > 0 && (
                          <div className="flex flex-col gap-3">
                            {listings.map((listing) => (
                              <ListingCard
                                key={listing._id}
                                listing={listing}
                                variant="row"
                                isFavorited={true}
                                onClick={() =>
                                  navigate(`/listings/${listing._id}`)
                                }
                                onToggleFavorite={(id) => toggle(id, true)}
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
                          <div className="rounded-[18px] border border-rose-200/70 bg-rose-50/70 px-4 py-3 text-[11px] text-rose-700 dark:border-rose-400/15 dark:bg-rose-400/10 dark:text-rose-300">
                            Couldn't load your visit requests.
                          </div>
                        )}

                        {requestsLoading && (
                          <div className="flex flex-col gap-3">
                            {[...Array(2)].map((_, index) => (
                              <div
                                key={index}
                                className="h-24 animate-pulse rounded-[18px] border border-black/[0.06] bg-black/[0.025] dark:border-white/[0.06] dark:bg-white/[0.035]"
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

                              <p className="mt-1 text-[11px] text-[#2b2d31]/48 dark:text-white/43">
                                Your property visit requests will appear here.
                              </p>
                            </div>
                          )}

                        {!requestsLoading &&
                          !requestsError &&
                          requests.length > 0 && (
                            <div className="flex flex-col gap-3">
                              {requests.map((request) => (
                                <RequestRow
                                  key={request._id}
                                  request={request}
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

          {/* VISIT ACTIVITY */}
          <aside
            className="
              overflow-hidden rounded-[26px] border border-black/[0.07]
              bg-white/[0.52] shadow-[0_18px_52px_rgba(20,23,31,0.045)]
              backdrop-blur
              dark:border-white/[0.07] dark:bg-white/[0.025] dark:shadow-none
            "
          >
            <div className="border-b border-black/[0.06] px-5 py-5 dark:border-white/[0.07]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
                Visit activity
              </p>

              <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                Request status
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-[#2b2d31]/46 dark:text-white/40">
                Track what is happening with your property visits.
              </p>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <StatusRow
                icon={Clock3}
                label="Pending"
                value={requestsLoading ? "—" : requestCounts.pending}
                className="border-amber-400/15 bg-amber-400/[0.09] text-amber-300"
              />

              <StatusRow
                icon={CheckCircle2}
                label="Accepted"
                value={requestsLoading ? "—" : requestCounts.accepted}
                className="border-emerald-400/15 bg-emerald-400/[0.09] text-emerald-300"
              />

              <StatusRow
                icon={XCircle}
                label="Declined"
                value={requestsLoading ? "—" : requestCounts.declined}
                className="border-rose-400/15 bg-rose-400/[0.09] text-rose-300"
              />

              <div className="my-4 border-t border-black/[0.06] dark:border-white/[0.07]" />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/34 dark:text-white/32">
                  Latest request
                </p>

                {requestsLoading ? (
                  <div className="mt-3 h-28 animate-pulse rounded-[18px] border border-black/[0.06] bg-black/[0.025] dark:border-white/[0.06] dark:bg-white/[0.035]" />
                ) : latestRequest ? (
                  <div className="mt-3">
                    <RequestRow request={latestRequest} />
                  </div>
                ) : (
                  <div className="mt-3 rounded-[18px] border border-dashed border-black/[0.08] bg-white/[0.28] px-4 py-6 text-center dark:border-white/[0.08] dark:bg-white/[0.02]">
                    <p className="text-[11px] font-medium text-[#2b2d31]/50 dark:text-white/45">
                      No requests yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
