import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import {
  MapPin,
  Wifi,
  Car,
  Droplet,
  Zap,
  Check,
  X,
  Heart,
  UserRound,
  CheckCircle2,
  CircleOff,
  Phone,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";
import ListingGallery from "../../features/listings/components/ListingGallery.jsx";
import ListingMap from "../../features/listings/components/ListingMap.jsx";
import Badge from "../../components/ui/Badge.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import ReviewCard from "../../features/reviews/components/ReviewCard.jsx";
import ReviewForm from "../../features/reviews/components/ReviewForm.jsx";

import { formatRelativeDate } from "../../utils/formatDate";

import {
  useReviews,
  useCreateReview,
  useDeleteReview,
  useReplyToReview,
  useEditReply,
} from "../../features/reviews/hooks/useReviews.js";

import { useListing } from "../../features/listings/hooks/useListing.js";

import {
  useFavorites,
  useToggleFavorite,
} from "../../features/favorites/hooks/useFavorites.js";

import { getNearbyProperties } from "../../api/listings.api.js";
import { createVisitRequest } from "../../api/visitRequests.api.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

/* =========================================================
   AMENITY ICONS
========================================================= */

const AMENITY_ICONS = [
  {
    match: /wifi|internet/i,
    icon: Wifi,
  },
  {
    match: /park/i,
    icon: Car,
  },
  {
    match: /water/i,
    icon: Droplet,
  },
  {
    match: /electric|backup|power/i,
    icon: Zap,
  },
];

function amenityIcon(label) {
  const found = AMENITY_ICONS.find((amenity) => amenity.match.test(label));

  return found ? found.icon : Check;
}

/* =========================================================
   VISIT REQUEST MODAL
========================================================= */

function VisitRequestModal({ listing, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
     * Safety check.
     *
     * The modal should never normally be opened for an unavailable
     * property, but this prevents submission if its state somehow
     * changes while the modal is open.
     */
    if (listing?.isAvailable === false) {
      setSubmitError(
        "This property is currently rented and is not accepting visit requests.",
      );

      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const composedMessage = [
      date ? `Preferred date: ${date}` : null,
      time ? `Preferred time: ${time}` : null,
      message?.trim() || null,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      await createVisitRequest({
        propertyId: listing._id,
        message: composedMessage,
      });

      setSent(true);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          "Couldn't send request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-bg p-6 shadow-2xl">
        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-4 top-4
            flex h-8 w-8
            items-center justify-center
            rounded-full
            transition-colors
            hover:bg-ivory
          "
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {sent ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass-light">
              <Check size={20} className="text-brass" />
            </div>

            <p className="mb-2 font-display text-lg text-text">Request sent</p>

            <p className="text-sm text-text/60">
              Your visit request has been sent to the owner.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="
                mt-5 rounded-full
                bg-ink
                px-6 py-2.5
                text-sm font-medium
                text-ivory
                transition-opacity
                hover:opacity-90
              "
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="font-display text-lg text-text">Request to visit</p>

              <p className="mt-1 text-sm text-text/60">{listing.title}</p>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text/70">Date</span>

              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  rounded-xl
                  border border-stone
                  bg-transparent
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-brass
                "
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text/70">Time</span>

              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="
                  rounded-xl
                  border border-stone
                  bg-transparent
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-brass
                "
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text/70">
                Message (optional)
              </span>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Anything the owner should know..."
                className="
                  resize-none
                  rounded-xl
                  border border-stone
                  bg-transparent
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-brass
                "
              />
            </label>

            {submitError && (
              <p role="alert" className="text-sm text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                mt-1 rounded-full
                bg-ink
                px-6 py-3
                text-sm font-medium
                text-ivory
                transition-opacity
                hover:opacity-90
                disabled:opacity-60
              "
            >
              {isSubmitting ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LISTING DETAIL
========================================================= */

export default function ListingDetail() {
  const { t } = useTranslation();

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const { data: listing, isLoading, error } = useListing(id);

  const [expanded, setExpanded] = useState(false);

  const [visitModalOpen, setVisitModalOpen] = useState(false);

  /* =======================================================
     FAVORITES / SAVE
  ======================================================= */

  const { favoriteIds } = useFavorites({
    enabled: user?.role === "renter",
  });

  const { toggle, add, remove } = useToggleFavorite();

  const isSaved =
    favoriteIds?.some((favoriteId) => String(favoriteId) === String(id)) ??
    false;

  const isSaving = add.isPending || remove.isPending;

  function handleToggleSave() {
    if (!listing?._id) return;

    if (user?.role !== "renter") {
      navigate("/login");

      return;
    }

    toggle(listing._id, isSaved);
  }

  /* =======================================================
     REVIEWS
  ======================================================= */

  const {
    data: reviewData,
    isError: reviewsError,
    refetch: refetchReviews,
  } = useReviews(id);

  const createReview = useCreateReview(id);

  const deleteReview = useDeleteReview(id);

  const replyToReviewMutation = useReplyToReview(id);

  const editReplyMutation = useEditReply(id);

  /* =======================================================
     NEARBY PROPERTIES
  ======================================================= */

  const coordinates = listing?.location?.coordinates;

  const { data: nearbyData } = useQuery({
    queryKey: ["nearby-on-detail", coordinates],

    queryFn: () =>
      getNearbyProperties({
        lng: coordinates[0],
        lat: coordinates[1],
        radius: 3,
        limit: 12,
      }),

    enabled: !!coordinates,
  });

  const nearbyListings = nearbyData?.properties ?? [];

  /* =======================================================
     REVIEW DATA
  ======================================================= */

  const reviews = reviewData?.reviews ?? [];

  const avgRating = useMemo(() => {
    if (!reviews.length) {
      return null;
    }

    const validRatings = reviews.filter((review) =>
      Number.isFinite(Number(review.rating)),
    );

    if (!validRatings.length) {
      return null;
    }

    const sum = validRatings.reduce(
      (acc, review) => acc + Number(review.rating),
      0,
    );

    return (sum / validRatings.length).toFixed(1);
  }, [reviews]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-text/70">
            {t("dashboard.loading", "Loading...")}
          </p>
        </div>
      </AppShell>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !listing) {
    return (
      <AppShell>
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-red-600">
            {t("listing.notFound", "Listing not found.")}
          </p>
        </div>
      </AppShell>
    );
  }

  /* =======================================================
     LISTING DATA
  ======================================================= */

  const description = listing.description;

  const address = listing.location?.address;

  const images =
    listing.images
      ?.map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean) ?? [];

  const amenities = listing.amenities ?? [];

  /*
   * Existing properties created before isAvailable was added
   * may not contain the property yet.
   *
   * Treat them as available unless explicitly set to false.
   */
  const isAvailable = listing.isAvailable !== false;

  const owner = listing.owner;

  const ownerName = owner?.name || "Property owner";

  const ownerPhoto = owner?.profilePicture || "";

  const ownerInitial = ownerName.trim().charAt(0).toUpperCase();

  /* =======================================================
     OWNER CHECK
  ======================================================= */

  const currentUserId = user?.id || user?._id;

  const listingOwnerId = listing.owner?._id || listing.owner?.id;

  const isOwnerOfThis =
    user?.role === "owner" &&
    currentUserId &&
    listingOwnerId &&
    String(currentUserId) === String(listingOwnerId);

  const canReview = user?.role === "renter" && !isOwnerOfThis;

  /* =======================================================
     REVIEW OWNERSHIP
  ======================================================= */

  const isOwnReview = (review) => {
    const reviewerId = review?.reviewer?._id || review?.reviewer?.id;

    return (
      currentUserId &&
      reviewerId &&
      String(currentUserId) === String(reviewerId)
    );
  };

  /* =======================================================
     VISIT HANDLER
  ======================================================= */

  function handleOpenVisit() {
    if (!isAvailable) {
      return;
    }

    if (!user) {
      navigate("/login");

      return;
    }

    if (user.role !== "renter") {
      return;
    }

    setVisitModalOpen(true);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl pb-24 lg:pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          {/* =================================================
              LEFT SIDE — MAP
          ================================================= */}

          <div className="h-[420px] lg:sticky lg:top-6 lg:h-[calc(100vh-96px)] lg:self-start">
            {coordinates ? (
              <ListingMap
                coordinates={coordinates}
                listings={nearbyListings}
                currentId={listing._id}
                onSelect={(nextId) => navigate(`/listings/${nextId}`)}
                className="h-full w-full overflow-hidden rounded-2xl border border-stone"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-stone bg-ivory text-sm text-text/50">
                Location unavailable
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT SIDE — LISTING CONTENT
          ================================================= */}

          <div className="flex flex-col gap-6">
            <ListingGallery
              photos={images}
              rating={avgRating}
              listingId={listing._id}
              title={listing.title}
            />

            {/* =================================================
                TITLE / LOCATION
            ================================================= */}

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge>{listing.type}</Badge>

                {isAvailable ? (
                  <span
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full
                      bg-emerald-50
                      px-2.5 py-1
                      text-[10px] font-semibold
                      text-emerald-700
                      dark:bg-emerald-400/10
                      dark:text-emerald-300
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Available
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full
                      bg-black/[0.045]
                      px-2.5 py-1
                      text-[10px] font-semibold
                      text-[#2b2d31]/55
                      dark:bg-white/[0.06]
                      dark:text-white/45
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2b2d31]/30 dark:bg-white/30" />
                    Rented
                  </span>
                )}

                {reviews.length > 0 && avgRating && (
                  <span className="text-xs text-text/50">
                    {avgRating} · {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl text-text sm:text-3xl">
                {listing.title}
              </h1>

              {address && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-text/70">
                  <MapPin size={14} className="shrink-0 text-text/40" />

                  {address}
                </p>
              )}

              {listing.createdAt && (
                <p className="mt-1.5 text-xs text-text/40">
                  Listed {formatRelativeDate(listing.createdAt)}
                </p>
              )}
            </div>

            {/* =================================================
                AMENITIES
            ================================================= */}

            {amenities.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-lg text-text">
                  {t("listing.amenities", "Amenities")}
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {amenities.map((amenity) => {
                    const AmenityIcon = amenityIcon(amenity);

                    return (
                      <div
                        key={amenity}
                        className="
                            flex min-h-[72px]
                            items-center gap-3
                            rounded-xl
                            border border-stone/70
                            bg-bg
                            px-4 py-3
                            transition-colors
                            duration-200
                            hover:border-brass/40
                            hover:bg-ivory/30
                          "
                      >
                        <div
                          className="
                              flex h-9 w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-stone/60
                              bg-ivory/60
                              text-text/70
                            "
                        >
                          <AmenityIcon size={18} strokeWidth={1.8} />
                        </div>

                        <span className="text-sm font-medium leading-tight text-text/80">
                          {amenity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {description && (
              <div>
                <h2 className="mb-2 font-display text-lg text-text">
                  {t("listing.description", "Description")}
                </h2>

                <p
                  className={`text-sm leading-relaxed text-text/70 ${
                    expanded ? "" : "line-clamp-4"
                  }`}
                >
                  {description}
                </p>

                <button
                  type="button"
                  onClick={() => setExpanded((previous) => !previous)}
                  className="
                    mt-1
                    text-sm font-medium
                    text-text
                    underline
                    underline-offset-2
                    transition-colors
                    hover:text-brass
                  "
                >
                  {expanded
                    ? t("listing.showLess", "Show less")
                    : t("listing.readMore", "Read More...")}
                </button>
              </div>
            )}

            {/* =================================================
                OWNER
            ================================================= */}

            {owner && (
              <section
                className="
                  overflow-hidden
                  rounded-[22px]
                  border border-black/[0.07]
                  bg-white/45
                  dark:border-white/[0.07]
                  dark:bg-white/[0.025]
                "
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3.5">
                    {/* OWNER PHOTO */}

                    <div
                      className="
                        flex h-12 w-12
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        border border-black/[0.07]
                        bg-[#ecebe7]
                        dark:border-white/[0.08]
                        dark:bg-white/[0.06]
                      "
                    >
                      {ownerPhoto ? (
                        <img
                          src={ownerPhoto}
                          alt={ownerName}
                          className="h-full w-full object-cover"
                        />
                      ) : ownerInitial ? (
                        <span className="font-display text-[15px] font-bold text-[#202226]/65 dark:text-white/65">
                          {ownerInitial}
                        </span>
                      ) : (
                        <UserRound
                          size={18}
                          className="text-[#202226]/45 dark:text-white/45"
                        />
                      )}
                    </div>

                    {/* OWNER DETAILS */}

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/38 dark:text-white/35">
                        Property owner
                      </p>

                      <p className="mt-1 truncate text-[14px] font-semibold text-[#202226] dark:text-white">
                        {ownerName}
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        {isAvailable ? (
                          <>
                            <CheckCircle2
                              size={12}
                              strokeWidth={2}
                              className="text-emerald-600 dark:text-emerald-400"
                            />

                            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                              Property available
                            </span>
                          </>
                        ) : (
                          <>
                            <CircleOff
                              size={12}
                              strokeWidth={2}
                              className="text-[#2b2d31]/40 dark:text-white/40"
                            />

                            <span className="text-[10px] font-medium text-[#2b2d31]/45 dark:text-white/42">
                              Currently rented
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CONTACT OWNER */}

                  {!isOwnerOfThis && isAvailable && owner?.phone && (
                    <a
                      href={`tel:${owner.phone}`}
                      className="
                          inline-flex h-10
                          shrink-0
                          items-center
                          justify-center
                          gap-2
                          rounded-full
                          border
                          border-black/[0.08]
                          bg-white/60
                          px-4
                          text-[11px]
                          font-semibold
                          text-[#202226]
                          no-underline
                          transition-colors
                          hover:bg-white
                          dark:border-white/[0.08]
                          dark:bg-white/[0.05]
                          dark:text-white
                          dark:hover:bg-white/[0.08]
                        "
                    >
                      <Phone size={13} strokeWidth={1.9} />
                      Contact owner
                    </a>
                  )}
                </div>

                {/* UNAVAILABLE MESSAGE */}

                {!isAvailable && (
                  <div
                    className="
                      border-t
                      border-black/[0.06]
                      bg-black/[0.025]
                      px-5 py-3
                      text-[10px]
                      leading-5
                      text-[#2b2d31]/48
                      dark:border-white/[0.06]
                      dark:bg-white/[0.025]
                      dark:text-white/40
                    "
                  >
                    This property has been marked as rented or filled by the
                    owner. New visit requests are currently disabled.
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                PRICE / ACTIONS
            ================================================= */}

            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="whitespace-nowrap text-2xl font-semibold text-text">
                  {formatPrice(listing.price)}

                  <span className="text-sm font-normal text-text/50">
                    {" "}
                    /Month
                  </span>
                </p>

                <div className="mt-2">
                  {isAvailable ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-emerald-50
                        px-2.5 py-1
                        text-[10px]
                        font-semibold
                        text-emerald-700
                        dark:bg-emerald-400/10
                        dark:text-emerald-300
                      "
                    >
                      <CheckCircle2 size={11} strokeWidth={2} />
                      Available
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-black/[0.045]
                        px-2.5 py-1
                        text-[10px]
                        font-semibold
                        text-[#2b2d31]/50
                        dark:bg-white/[0.06]
                        dark:text-white/45
                      "
                    >
                      <CircleOff size={11} strokeWidth={2} />
                      Rented
                    </span>
                  )}
                </div>
              </div>

              {!isOwnerOfThis && (
                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                  {/* SAVE */}

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    disabled={isSaving}
                    aria-pressed={isSaved}
                    className={`
                      flex items-center
                      justify-center gap-1.5
                      rounded-full
                      border
                      px-5 py-3
                      text-sm
                      font-medium
                      transition-colors
                      disabled:opacity-60
                      ${
                        isSaved
                          ? "border-brass bg-brass-light text-brass"
                          : "border-stone text-text hover:bg-ivory"
                      }
                    `}
                  >
                    <Heart size={16} className={isSaved ? "fill-brass" : ""} />

                    {isSaved
                      ? t("listing.saved", "Saved")
                      : t("listing.save", "Save")}
                  </button>

                  {/* REQUEST VISIT */}

                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={handleOpenVisit}
                    className={`
                      rounded-full
                      px-6 py-3
                      text-sm
                      font-medium
                      transition-colors
                      ${
                        isAvailable
                          ? "bg-ink text-ivory hover:opacity-90"
                          : "cursor-not-allowed bg-black/10 text-text/35 dark:bg-white/10 dark:text-white/30"
                      }
                    `}
                  >
                    {isAvailable
                      ? t("listing.requestVisit", "Request to visit")
                      : "Currently rented"}
                  </button>
                </div>
              )}
            </div>

            {/* =================================================
                REVIEWS
            ================================================= */}

            <div className="border-t border-stone pt-2">
              <div className="mb-3 mt-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg text-text">
                  {t("reviews.title", "Reviews")}

                  {reviews.length > 0 && ` (${reviews.length})`}
                </h2>

                {avgRating && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-brass">★</span>

                    <span className="font-semibold text-text">{avgRating}</span>
                  </div>
                )}
              </div>

              {reviewsError && <ErrorState onRetry={refetchReviews} />}

              {canReview && (
                <div className="mb-4">
                  <ReviewForm
                    onSubmit={(payload, opts) =>
                      createReview.mutate(payload, opts)
                    }
                    isSubmitting={createReview.isPending}
                  />
                </div>
              )}

              {!reviewsError && reviews.length === 0 && (
                <div className="rounded-2xl border border-stone bg-ivory p-5">
                  <p className="text-sm text-text/60">
                    {t("reviews.empty", "No reviews yet.")}
                  </p>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="flex flex-col gap-3">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      isOwner={Boolean(isOwnerOfThis)}
                      isOwnReview={isOwnReview(review)}
                      onReply={(reviewId, comment) =>
                        replyToReviewMutation.mutate({
                          reviewId,
                          comment,
                        })
                      }
                      onEditReply={(reviewId, comment) =>
                        editReplyMutation.mutate({
                          reviewId,
                          comment,
                        })
                      }
                      isReplying={replyToReviewMutation.isPending}
                      isEditingReply={editReplyMutation.isPending}
                      onDelete={(reviewId) => deleteReview.mutate(reviewId)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          VISIT MODAL
      ===================================================== */}

      {visitModalOpen && isAvailable && (
        <VisitRequestModal
          listing={listing}
          onClose={() => setVisitModalOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE BOTTOM BAR
      ===================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-stone bg-bg p-4 lg:hidden">
        <p className="shrink-0 text-lg font-semibold text-text">
          {formatPrice(listing.price)}

          <span className="block text-xs font-normal leading-none text-text/50">
            /Month
          </span>
        </p>

        {!isOwnerOfThis && (
          <div className="flex flex-1 items-center gap-2">
            {/* SAVE */}

            <button
              type="button"
              onClick={handleToggleSave}
              disabled={isSaving}
              aria-pressed={isSaved}
              aria-label={isSaved ? "Remove from saved" : "Save listing"}
              className={`
                flex h-12 w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                transition-colors
                disabled:opacity-60
                ${
                  isSaved
                    ? "border-brass bg-brass-light text-brass"
                    : "border-stone text-text"
                }
              `}
            >
              <Heart size={18} className={isSaved ? "fill-brass" : ""} />
            </button>

            {/* REQUEST VISIT */}

            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleOpenVisit}
              className={`
                flex-1
                rounded-full
                px-6 py-3
                text-sm
                font-medium
                ${
                  isAvailable
                    ? "bg-ink text-ivory hover:opacity-90"
                    : "cursor-not-allowed bg-black/10 text-text/35 dark:bg-white/10 dark:text-white/30"
                }
              `}
            >
              {isAvailable ? t("listing.bookNow", "Request Visit") : "Rented"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
