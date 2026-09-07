import {
  Home,
  Heart,
  Settings,
  MessageSquare,
  Compass,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
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

/* =========================================================
   SIDEBAR
========================================================= */

const links = [
  {
    to: "/renter",
    label: "Overview",
    icon: Home,
    end: true,
  },
  {
    to: "/renter/saved",
    label: "Favorites",
    icon: Heart,
  },
  {
    to: "/",
    label: "Discover",
    icon: Compass,
  },
  {
    to: "/renter/settings",
    label: "Settings",
    icon: Settings,
  },
];

/* =========================================================
   STATUS STYLES
========================================================= */

const STATUS_STYLES = {
  pending:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",

  accepted:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",

  declined: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
};

/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({ icon: Icon, value, label, description }) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[24px]
        border border-stone/70
        bg-bg
        px-5
        py-5
        shadow-[0_1px_2px_rgba(20,23,31,0.03),0_12px_35px_rgba(20,23,31,0.05)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-8
          -top-8
          h-24
          w-24
          rounded-full
          bg-text/[0.025]
          blur-2xl
        "
      />

      <div className="relative flex items-start justify-between gap-5">
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-text/35
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2
              font-display
              text-3xl
              font-bold
              tracking-[-0.05em]
              text-text
            "
          >
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-text/45">{description}</p>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border border-stone/70
            bg-ivory/70
            text-text/60
          "
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REQUEST ROW
========================================================= */

function RequestRow({ request, onOpen }) {
  const property = request.property;

  const statusClass =
    STATUS_STYLES[request.status] || "border-stone bg-ivory text-text/60";

  return (
    <div
      className="
        rounded-[22px]
        border border-stone/70
        bg-bg
        p-5
        shadow-[0_1px_2px_rgba(20,23,31,0.03)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="
              font-display
              text-[17px]
              font-semibold
              tracking-[-0.025em]
              text-text
            "
          >
            {property?.title ?? "Listing removed"}
          </p>

          {property?.price && (
            <p className="mt-1.5 text-sm text-text/50">
              {formatPrice(property.price)} / month
            </p>
          )}
        </div>

        <span
          className={`
            shrink-0
            rounded-full
            border
            px-3
            py-1.5
            text-[11px]
            font-semibold
            capitalize
            ${statusClass}
          `}
        >
          {request.status}
        </span>
      </div>

      {request.message && (
        <p
          className="
            mt-4
            whitespace-pre-line
            rounded-2xl
            bg-ivory/55
            px-4
            py-3
            text-sm
            leading-6
            text-text/60
          "
        >
          {request.message}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-4">
        <div
          className="
            flex
            items-center
            gap-2
            text-[11px]
            text-text/35
          "
        >
          <CalendarDays size={12} strokeWidth={1.8} />

          <span>Sent {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>

        {property?._id && (
          <button
            type="button"
            onClick={onOpen}
            className="
              inline-flex
              items-center
              gap-1
              text-xs
              font-semibold
              text-text/50
              transition-colors
              hover:text-text
            "
          >
            Open
            <ArrowUpRight size={12} strokeWidth={1.8} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   REQUEST STATUS ITEM
========================================================= */

function RequestStatusItem({ icon: Icon, label, value, tone }) {
  const tones = {
    pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",

    accepted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",

    declined: "bg-red-500/10 text-red-700 dark:text-red-300",
  };

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-2xl
        border border-stone/60
        bg-ivory/35
        px-4
        py-3.5
      "
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            ${tones[tone]}
          `}
        >
          <Icon size={16} strokeWidth={1.8} />
        </div>

        <span className="text-sm font-medium text-text/65">{label}</span>
      </div>

      <span
        className="
          font-display
          text-xl
          font-bold
          tracking-[-0.04em]
          text-text
        "
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   VISIT ACTIVITY PANEL
========================================================= */

function VisitActivity({ requests, requestsLoading, requestsError, navigate }) {
  const pendingCount = requests.filter(
    (request) => request.status === "pending",
  ).length;

  const acceptedCount = requests.filter(
    (request) => request.status === "accepted",
  ).length;

  const declinedCount = requests.filter(
    (request) => request.status === "declined",
  ).length;

  const latestRequest = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return (
    <div
      className="
        overflow-hidden
        rounded-[28px]
        border border-stone/70
        bg-bg
        shadow-[0_12px_35px_rgba(20,23,31,0.05)]
      "
    >
      {/* HEADER */}

      <div
        className="
          relative
          overflow-hidden
          border-b
          border-stone/70
          px-5
          py-5
          sm:px-6
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-12
            -top-16
            h-32
            w-32
            rounded-full
            bg-text/[0.025]
            blur-3xl
          "
        />

        <div className="relative">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-text/35
            "
          >
            Visit activity
          </p>

          <h2
            className="
              mt-1
              font-display
              text-xl
              font-bold
              tracking-[-0.035em]
              text-text
            "
          >
            Request status
          </h2>

          <p className="mt-1.5 text-sm text-text/45">
            Track what is happening with your property visits.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {requestsLoading && (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-2xl bg-ivory" />
            <div className="h-16 animate-pulse rounded-2xl bg-ivory" />
            <div className="h-16 animate-pulse rounded-2xl bg-ivory" />
          </div>
        )}

        {requestsError && (
          <div
            className="
              rounded-2xl
              border border-red-500/15
              bg-red-500/[0.06]
              px-4
              py-3
              text-sm
              text-red-600
              dark:text-red-300
            "
          >
            Couldn't load your visit activity.
          </div>
        )}

        {!requestsLoading && !requestsError && (
          <>
            {/* STATUS COUNTS */}

            <div className="space-y-3">
              <RequestStatusItem
                icon={Clock}
                label="Pending"
                value={pendingCount}
                tone="pending"
              />

              <RequestStatusItem
                icon={CheckCircle2}
                label="Accepted"
                value={acceptedCount}
                tone="accepted"
              />

              <RequestStatusItem
                icon={XCircle}
                label="Declined"
                value={declinedCount}
                tone="declined"
              />
            </div>

            {/* LATEST REQUEST */}

            <div
              className="
                  mt-6
                  border-t
                  border-stone/60
                  pt-5
                "
            >
              <p
                className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-text/35
                  "
              >
                Latest request
              </p>

              {!latestRequest ? (
                <div
                  className="
                      mt-3
                      rounded-[22px]
                      border border-stone/70
                      bg-ivory/40
                      px-5
                      py-7
                      text-center
                    "
                >
                  <div
                    className="
                        mx-auto
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        border border-stone
                        bg-bg
                        text-text/40
                      "
                  >
                    <MessageSquare size={17} strokeWidth={1.8} />
                  </div>

                  <p
                    className="
                        mt-3
                        font-display
                        text-base
                        font-semibold
                        text-text
                      "
                  >
                    No visit requests yet
                  </p>

                  <p
                    className="
                        mx-auto
                        mt-1.5
                        max-w-xs
                        text-sm
                        leading-6
                        text-text/45
                      "
                  >
                    Request a visit from a property page and its status will
                    appear here.
                  </p>
                </div>
              ) : (
                <div
                  className="
                      mt-3
                      rounded-[22px]
                      border border-stone/70
                      bg-gradient-to-br
                      from-ivory/60
                      to-bg
                      p-5
                    "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3
                        className="
                            truncate
                            font-display
                            text-[17px]
                            font-semibold
                            tracking-[-0.025em]
                            text-text
                          "
                      >
                        {latestRequest.property?.title ?? "Listing removed"}
                      </h3>

                      {latestRequest.property?.price && (
                        <p className="mt-1.5 text-sm text-text/50">
                          {formatPrice(latestRequest.property.price)} / month
                        </p>
                      )}
                    </div>

                    <span
                      className={`
                          shrink-0
                          rounded-full
                          border
                          px-3
                          py-1.5
                          text-[11px]
                          font-semibold
                          capitalize
                          ${
                            STATUS_STYLES[latestRequest.status] ||
                            "border-stone bg-ivory text-text/60"
                          }
                        `}
                    >
                      {latestRequest.status}
                    </span>
                  </div>

                  {latestRequest.message && (
                    <p
                      className="
                          mt-4
                          line-clamp-3
                          text-sm
                          leading-6
                          text-text/55
                        "
                    >
                      {latestRequest.message}
                    </p>
                  )}

                  <div
                    className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-stone/60
                        pt-4
                      "
                  >
                    <span className="text-[11px] text-text/35">
                      {new Date(latestRequest.createdAt).toLocaleDateString()}
                    </span>

                    {latestRequest.property?._id && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/listings/${latestRequest.property._id}`)
                        }
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            font-semibold
                            text-text/55
                            transition-colors
                            hover:text-text
                          "
                      >
                        View property
                        <ArrowUpRight size={13} strokeWidth={1.8} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function RenterDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const { listings, isLoading, isError } = useFavorites();

  const { toggle } = useToggleFavorite();

  const {
    requests,
    isLoading: requestsLoading,
    isError: requestsError,
  } = useMyVisitRequests();

  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  ).length;

  return (
    <AppShell sidebar={<Sidebar links={links} />} centeredContent>
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border border-stone/70
            bg-gradient-to-br
            from-[#f4f3ef]
            via-[#ecebe7]
            to-[#d7d7d4]
            px-6
            py-7
            shadow-[0_16px_45px_rgba(20,23,31,0.06)]
            sm:px-8
            sm:py-8
            dark:from-[#202329]
            dark:via-[#191c21]
            dark:to-[#121419]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-24
              h-72
              w-72
              rounded-full
              bg-white/40
              blur-[90px]
              dark:bg-white/[0.03]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              left-1/3
              h-44
              w-72
              rounded-full
              bg-black/[0.04]
              blur-[70px]
              dark:bg-black/20
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-text/40
                "
              >
                Renter dashboard
              </p>

              <h1
                className="
                  mt-2
                  max-w-3xl
                  font-display
                  text-3xl
                  font-bold
                  tracking-[-0.045em]
                  text-text
                  sm:text-[38px]
                "
              >
                {t("dashboard.renter.title", "Welcome back")}

                {user?.name ? `, ${user.name}` : ""}
              </h1>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-text/55
                "
              >
                Keep track of the places you saved, your visit requests, and
                what you want to explore next.
              </p>
            </div>

            <Link
              to="/"
              className="
                inline-flex
                w-fit
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-ink
                px-5
                py-3
                text-sm
                font-semibold
                text-ivory
                no-underline
                shadow-[0_8px_20px_rgba(20,23,31,0.14)]
                dark:bg-[#ecebe7]
                dark:text-[#14161a]
              "
            >
              Explore rentals
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </Link>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          <DashboardStat
            icon={Heart}
            value={isLoading ? "—" : listings.length}
            label="Saved listings"
            description="Properties you've kept for later."
          />

          <DashboardStat
            icon={MessageSquare}
            value={requestsLoading ? "—" : requests.length}
            label="Requests sent"
            description="Visit requests you've submitted."
          />

          <DashboardStat
            icon={Clock}
            value={requestsLoading ? "—" : pendingRequests}
            label="Pending requests"
            description="Waiting for an owner's response."
          />
        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section
          className="
            mt-7
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[1.25fr_0.8fr]
          "
        >
          {/* LEFT */}

          <div
            className="
              overflow-hidden
              rounded-[28px]
              border border-stone/70
              bg-bg
              shadow-[0_12px_35px_rgba(20,23,31,0.05)]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-stone/70
                px-5
                py-4
                sm:px-6
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-text/35
                  "
                >
                  Your activity
                </p>

                <h2
                  className="
                    mt-1
                    font-display
                    text-xl
                    font-bold
                    tracking-[-0.035em]
                    text-text
                  "
                >
                  Saved & requested
                </h2>
              </div>

              <Link
                to="/renter/saved"
                className="
                  hidden
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold
                  text-text/45
                  no-underline
                  sm:inline-flex
                "
              >
                View saved
                <ArrowUpRight size={13} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="p-4 sm:p-5">
              <DashboardTabs
                tabs={[
                  {
                    id: "overview",
                    label: "Overview",

                    content: (
                      <>
                        {isError && (
                          <div
                            className="
                              rounded-2xl
                              border border-red-500/15
                              bg-red-500/[0.06]
                              px-4
                              py-3
                              text-sm
                              text-red-600
                              dark:text-red-300
                            "
                          >
                            Couldn't load your saved listings.
                          </div>
                        )}

                        {!isLoading && !isError && listings.length === 0 && (
                          <div
                            className="
                                rounded-[24px]
                                border
                                border-stone/70
                                bg-gradient-to-br
                                from-ivory/70
                                to-bg
                                px-6
                                py-10
                                text-center
                              "
                          >
                            <div
                              className="
                                  mx-auto
                                  flex
                                  h-12
                                  w-12
                                  items-center
                                  justify-center
                                  rounded-2xl
                                  border border-stone
                                  bg-bg
                                  text-text/45
                                "
                            >
                              <Heart size={19} strokeWidth={1.8} />
                            </div>

                            <p
                              className="
                                  mt-4
                                  font-display
                                  text-lg
                                  font-semibold
                                  tracking-[-0.025em]
                                  text-text
                                "
                            >
                              Nothing saved yet
                            </p>

                            <p
                              className="
                                  mx-auto
                                  mt-2
                                  max-w-sm
                                  text-sm
                                  leading-6
                                  text-text/50
                                "
                            >
                              Save properties while browsing and they'll show up
                              here.
                            </p>

                            <Link
                              to="/"
                              className="
                                  mt-5
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  bg-ink
                                  px-5
                                  py-2.5
                                  text-sm
                                  font-semibold
                                  text-ivory
                                  no-underline
                                  dark:bg-[#ecebe7]
                                  dark:text-[#14161a]
                                "
                            >
                              Browse listings
                              <ArrowUpRight size={14} strokeWidth={1.8} />
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
                              onClick={() =>
                                navigate(`/listings/${listing._id}`)
                              }
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
                          <div
                            className="
                              rounded-2xl
                              border border-red-500/15
                              bg-red-500/[0.06]
                              px-4
                              py-3
                              text-sm
                              text-red-600
                              dark:text-red-300
                            "
                          >
                            Couldn't load your visit requests.
                          </div>
                        )}

                        {requestsLoading && (
                          <div className="flex flex-col gap-3">
                            {[...Array(2)].map((_, index) => (
                              <div
                                key={index}
                                className="
                                    h-28
                                    animate-pulse
                                    rounded-[22px]
                                    border
                                    border-stone
                                    bg-ivory/60
                                  "
                              />
                            ))}
                          </div>
                        )}

                        {!requestsLoading &&
                          !requestsError &&
                          requests.length === 0 && (
                            <div
                              className="
                                rounded-[24px]
                                border
                                border-stone/70
                                bg-ivory/45
                                px-6
                                py-9
                                text-center
                              "
                            >
                              <MessageSquare
                                size={20}
                                strokeWidth={1.8}
                                className="mx-auto text-text/40"
                              />

                              <p
                                className="
                                  mt-4
                                  font-display
                                  text-lg
                                  font-semibold
                                  text-text
                                "
                              >
                                No requests yet
                              </p>

                              <p
                                className="
                                  mt-2
                                  text-sm
                                  text-text/50
                                "
                              >
                                Request a property visit and track it here.
                              </p>
                            </div>
                          )}

                        <div className="flex flex-col gap-3">
                          {requests.map((request) => (
                            <RequestRow
                              key={request._id}
                              request={request}
                              onOpen={() =>
                                request.property?._id &&
                                navigate(`/listings/${request.property._id}`)
                              }
                            />
                          ))}
                        </div>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* RIGHT */}

          <div className="lg:self-start">
            <VisitActivity
              requests={requests}
              requestsLoading={requestsLoading}
              requestsError={requestsError}
              navigate={navigate}
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
