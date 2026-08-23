import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { MapPin, Wifi, Car, Droplet, Zap, Check, X, Heart } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

import ListingGallery from "../../features/listings/components/ListingGallery.jsx";

import ListingMap from "../../features/listings/components/ListingMap.jsx";

import Badge from "../../components/ui/Badge.jsx";

import ErrorState from "../../components/ui/ErrorState.jsx";

import ReviewCard from "../../features/reviews/components/ReviewCard.jsx";

import ReviewForm from "../../features/reviews/components/ReviewForm.jsx";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4">
      <div className="bg-bg rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-ivory transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {sent ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-brass-light flex items-center justify-center">
              <Check size={20} className="text-brass" />
            </div>

            <p className="font-display text-lg text-text mb-2">Request sent</p>

            <p className="text-sm text-text/60">
              Your visit request has been sent to the owner.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 bg-ink text-ivory text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        ) : (
          /* =================================================
             FORM
          ================================================= */

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="font-display text-lg text-text">Request to visit</p>

              <p className="text-sm text-text/60 mt-1">{listing.title}</p>
            </div>

            {/* DATE */}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text/70">Date</span>

              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-stone rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brass bg-transparent"
              />
            </label>

            {/* TIME */}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text/70">Time</span>

              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border border-stone rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brass bg-transparent"
              />
            </label>

            {/* MESSAGE */}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text/70">
                Message (optional)
              </span>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Anything the owner should know..."
                className="border border-stone rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brass resize-none bg-transparent"
              />
            </label>

            {/* ERROR */}

            {submitError && (
              <p role="alert" className="text-sm text-red-600">
                {submitError}
              </p>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-ink text-ivory text-sm font-medium px-6 py-3 rounded-full mt-1 disabled:opacity-60 hover:opacity-90 transition-opacity"
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
        <div className="flex items-center justify-center min-h-[300px]">
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
        <div className="flex items-center justify-center min-h-[300px]">
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
     RENDER
  ======================================================= */

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6 lg:gap-8">
          {/* =================================================
              LEFT SIDE — MAP
          ================================================= */}

          <div className="lg:sticky lg:top-6 lg:self-start h-[420px] lg:h-[calc(100vh-96px)]">
            {coordinates ? (
              <ListingMap
                coordinates={coordinates}
                listings={nearbyListings}
                currentId={listing._id}
                onSelect={(nextId) => navigate(`/listings/${nextId}`)}
                className="w-full h-full rounded-2xl overflow-hidden border border-stone"
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-ivory border border-stone flex items-center justify-center text-sm text-text/50">
                Location unavailable
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT SIDE — LISTING CONTENT
          ================================================= */}

          <div className="flex flex-col gap-6">
            {/* =================================================
                GALLERY
            ================================================= */}

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
              <div className="flex items-center gap-2 mb-2">
                <Badge>{listing.type}</Badge>

                {reviews.length > 0 && avgRating && (
                  <span className="text-xs text-text/50">
                    {avgRating} · {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl text-text">
                {listing.title}
              </h1>

              {address && (
                <p className="text-sm text-text/60 flex items-center gap-1.5 mt-2">
                  <MapPin size={14} className="text-text/40 shrink-0" />

                  {address}
                </p>
              )}
            </div>

            {/* =================================================
                AMENITIES
            ================================================= */}

            {amenities.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-brass-light/70 to-brass-light/30 border border-brass/20 py-5 px-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-2">
                  {amenities.map((amenity) => {
                    const AmenityIcon = amenityIcon(amenity);

                    return (
                      <div
                        key={amenity}
                        className="flex flex-col items-center gap-2 text-center"
                      >
                        <span className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-brass to-[#8f6d3f]">
                          <AmenityIcon
                            size={19}
                            className="text-ivory"
                            strokeWidth={1.75}
                          />
                        </span>

                        <span className="text-xs font-medium text-text/80">
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
                <h2 className="font-display text-lg text-text mb-2">
                  {t("listing.description", "Description")}
                </h2>

                <p
                  className={`text-sm text-text/70 leading-relaxed ${
                    expanded ? "" : "line-clamp-4"
                  }`}
                >
                  {description}
                </p>

                <button
                  type="button"
                  onClick={() => setExpanded((previous) => !previous)}
                  className="text-sm text-text font-medium mt-1 underline underline-offset-2 hover:text-brass transition-colors"
                >
                  {expanded
                    ? t("listing.showLess", "Show less")
                    : t("listing.readMore", "Read More...")}
                </button>
              </div>
            )}

            {/* =================================================
                PRICE / CONTACT
            ================================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
              <p className="text-2xl text-text font-semibold whitespace-nowrap">
                {formatPrice(listing.price)}

                <span className="text-sm text-text/50 font-normal">
                  {" "}
                  /Month
                </span>
              </p>

              {!isOwnerOfThis && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleSave}
                    disabled={isSaving}
                    aria-pressed={isSaved}
                    className={`flex items-center justify-center gap-1.5 border text-sm font-medium px-5 py-3 rounded-full transition-colors disabled:opacity-60 ${
                      isSaved
                        ? "border-brass bg-brass-light text-brass"
                        : "border-stone text-text hover:bg-ivory"
                    }`}
                  >
                    <Heart size={16} className={isSaved ? "fill-brass" : ""} />
                    {isSaved
                      ? t("listing.saved", "Saved")
                      : t("listing.save", "Save")}
                  </button>

                  {listing.owner?.phone && (
                    <a
                      href={`tel:${listing.owner.phone}`}
                      className="border border-stone text-text text-sm font-medium px-5 py-3 rounded-full hover:bg-ivory transition-colors text-center"
                    >
                      {t("listing.contact", "Contact")} · {listing.owner.phone}
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setVisitModalOpen(true)}
                    className="bg-ink text-ivory text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                  >
                    {t("listing.requestVisit", "Request to visit")}
                  </button>
                </div>
              )}
            </div>

            {/* =================================================
                REVIEWS
            ================================================= */}

            <div className="pt-2 border-t border-stone">
              <div className="flex items-center justify-between gap-3 mb-3 mt-4">
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

              {/* REVIEW ERROR */}

              {reviewsError && <ErrorState onRetry={refetchReviews} />}

              {/* =================================================
                  RENTER REVIEW FORM
              ================================================= */}

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

              {/* =================================================
                  NO REVIEWS
              ================================================= */}

              {!reviewsError && reviews.length === 0 && (
                <div className="rounded-2xl border border-stone bg-ivory p-5">
                  <p className="text-sm text-text/60">
                    {t("reviews.empty", "No reviews yet.")}
                  </p>
                </div>
              )}

              {/* =================================================
                  REVIEW LIST
              ================================================= */}

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
          VISIT REQUEST MODAL
      ===================================================== */}

      {visitModalOpen && (
        <VisitRequestModal
          listing={listing}
          onClose={() => setVisitModalOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE BOTTOM BAR
      ===================================================== */}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg border-t border-stone p-4 flex items-center justify-between gap-4 z-40">
        <p className="text-lg text-text font-semibold shrink-0">
          {formatPrice(listing.price)}

          <span className="text-xs text-text/50 font-normal block leading-none">
            /Month
          </span>
        </p>

        {!isOwnerOfThis && (
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={isSaving}
              aria-pressed={isSaved}
              aria-label={isSaved ? "Remove from saved" : "Save listing"}
              className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full border transition-colors disabled:opacity-60 ${
                isSaved
                  ? "border-brass bg-brass-light text-brass"
                  : "border-stone text-text"
              }`}
            >
              <Heart size={18} className={isSaved ? "fill-brass" : ""} />
            </button>

            <button
              type="button"
              onClick={() => setVisitModalOpen(true)}
              className="bg-ink text-ivory text-sm font-medium px-6 py-3 rounded-full flex-1 hover:opacity-90 transition-opacity"
            >
              {t("listing.bookNow", "Book Now")}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
