import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Share2, Heart, MapPin, Wifi, Car, Droplet, Zap, Check, X } from "lucide-react";
import AppShell from "../../components/layout/AppShell.jsx";
import ListingGallery from "../../features/listings/components/ListingGallery.jsx";
import ListingMap from "../../features/listings/components/ListingMap.jsx";
import Badge from "../../components/ui/Badge.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import ReviewCard from "../../features/reviews/components/ReviewCard.jsx";
import ReviewForm from "../../features/reviews/components/ReviewForm.jsx";
import { useReviews, useCreateReview, useDeleteReview } from "../../features/reviews/hooks/useReviews.js";
import { useListing } from "../../features/listings/hooks/useListing.js";
import { useFavorites, useToggleFavorite } from "../../features/favorites/hooks/useFavorites.js";
import { getNearbyProperties } from "../../api/listings.api.js";
import { createVisitRequest } from "../../api/visitRequests.api.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

const AMENITY_ICONS = [
  { match: /wifi|internet/i, icon: Wifi },
  { match: /park/i, icon: Car },
  { match: /water/i, icon: Droplet },
  { match: /electric|backup|power/i, icon: Zap },
];

function amenityIcon(label) {
  const found = AMENITY_ICONS.find((a) => a.match.test(label));
  return found ? found.icon : Check;
}

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
      await createVisitRequest({ propertyId: listing._id, message: composedMessage });
      setSent(true);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Couldn't send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 honey-lift">
      <div className="bg-bg rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-ivory transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {sent ? (
          <div className="py-6 text-center">
            <p className="font-display text-lg text-text mb-2">Request sent</p>
            <p className="text-sm text-text/60">
              The owner will be notified once notifications are wired up on the backend.
            </p>
            <button onClick={onClose} className="mt-5 bg-ink text-ivory text-sm font-medium px-6 py-2.5 rounded-full">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="font-display text-lg text-text">Request to visit</p>
              <p className="text-sm text-text/60 mt-1">{listing.title}</p>
            </div>

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

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text/70">Message (optional)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Anything the owner should know..."
                className="border border-stone rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brass resize-none bg-transparent"
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
              className="bg-ink text-ivory text-sm font-medium px-6 py-3 rounded-full mt-1 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ListingDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: listing, isLoading, error } = useListing(id);
  const { favoriteIds } = useFavorites({ enabled: user?.role === "renter" });
  const { toggle } = useToggleFavorite();
  const [expanded, setExpanded] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);

  const { data: reviewData, isError: reviewsError, refetch: refetchReviews } = useReviews(id);
  const createReview = useCreateReview(id);
  const deleteReview = useDeleteReview(id);

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

  const reviews = reviewData?.reviews ?? [];
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  if (isLoading) {
    return (
      <AppShell>
        <p className="text-sm text-text/70">{t("dashboard.loading", "Loading...")}</p>
      </AppShell>
    );
  }

  if (error || !listing) {
    return (
      <AppShell>
        <p className="text-sm text-red-600">{t("listing.notFound", "Listing not found.")}</p>
      </AppShell>
    );
  }

  const description = listing.description;
  const address = listing.location?.address;
  const images = listing.images?.map((img) => img.url) ?? [];
  const amenities = listing.amenities ?? [];

  const isOwnerOfThis = user?.role === "owner" && user?.id === listing.owner?._id;
  const canReview = user?.role === "renter" && !isOwnerOfThis;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6 lg:gap-8">
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

          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 rounded-full border border-stone flex items-center justify-center text-text hover:bg-brass-light transition-colors"
                  aria-label="Share listing"
                >
                  <Share2 size={16} />
                </button>
                {user?.role === "renter" && (
                  <button
                    type="button"
                    onClick={() => toggle(listing._id, favoriteIds.includes(listing._id))}
                    className={`w-10 h-10 rounded-full border border-stone flex items-center justify-center transition-colors ${favoriteIds.includes(listing._id) ? "bg-brass-light text-brass" : "text-text hover:bg-brass-light"}`}
                    aria-label="Save listing"
                  >
                    <Heart size={16} fill={favoriteIds.includes(listing._id) ? "currentColor" : "none"} />
                  </button>
                )}
              </div>
            </div>

            <ListingGallery photos={images} rating={avgRating} />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{listing.type}</Badge>
                {reviews.length > 0 && (
                  <span className="text-xs text-text/50">
                    {avgRating} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl text-text">{listing.title}</h1>
              {address && (
                <p className="text-sm text-text/60 flex items-center gap-1.5 mt-2">
                  <MapPin size={14} className="text-text/40 shrink-0" />
                  {address}
                </p>
              )}
            </div>

            {amenities.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-brass-light/70 to-brass-light/30 border border-brass/20 py-5 px-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-2">
                  {amenities.map((a) => {
                    const AmenityIcon = amenityIcon(a);
                    return (
                      <div key={a} className="flex flex-col items-center gap-2 text-center">
                        <span className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-brass to-[#8f6d3f]">
                          <AmenityIcon size={19} className="text-ivory" strokeWidth={1.75} />
                        </span>
                        <span className="text-xs font-medium text-text/80">{a}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {description && (
              <div>
                <h2 className="font-display text-lg text-text mb-2">
                  {t("listing.description", "Description")}
                </h2>
                <p className={`text-sm text-text/70 leading-relaxed ${expanded ? "" : "line-clamp-4"}`}>
                  {description}
                </p>
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="text-sm text-text font-medium mt-1 underline underline-offset-2"
                >
                  {expanded
                    ? t("listing.showLess", "Show less")
                    : t("listing.readMore", "Read More...")}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-1">
              <p className="text-2xl text-text font-semibold whitespace-nowrap">
                {formatPrice(listing.price)}
                <span className="text-sm text-text/50 font-normal"> /Month</span>
              </p>
              {!isOwnerOfThis && (
                <div className="flex items-center gap-2 shrink-0">
                  {listing.owner?.phone && (
                    <a
                      href={`tel:${listing.owner.phone}`}
                      className="border border-stone text-text text-sm font-medium px-5 py-3 rounded-full hover:bg-ivory transition-colors"
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

            <div className="pt-2 border-t border-stone">
              <h2 className="font-display text-lg text-text mb-3 mt-4">
                {t("reviews.title", "Reviews")} {reviews.length > 0 && `(${reviews.length})`}
              </h2>

              {reviewsError && <ErrorState onRetry={refetchReviews} />}

              {canReview && (
                <div className="mb-4">
                  <ReviewForm
                    onSubmit={(payload, opts) => createReview.mutate(payload, opts)}
                    isSubmitting={createReview.isPending}
                  />
                </div>
              )}

              {!reviewsError && reviews.length === 0 && (
                <p className="text-sm text-text/60">{t("reviews.empty", "No reviews yet.")}</p>
              )}

              {reviews.length > 0 && (
                <div className="flex flex-col gap-3">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      isOwner={isOwnerOfThis}
                      isOwnReview={review.reviewer?._id === user?.id}
                      onReply={() => {}}
                      onDelete={() => deleteReview.mutate(review._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {visitModalOpen && (
        <VisitRequestModal listing={listing} onClose={() => setVisitModalOpen(false)} />
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg border-t border-stone p-4 flex items-center justify-between gap-4">
        <p className="text-lg text-text font-semibold shrink-0">
          {formatPrice(listing.price)}
          <span className="text-xs text-text/50 font-normal block leading-none">/Month</span>
        </p>
        {!isOwnerOfThis && (
          <button
            type="button"
            onClick={() => setVisitModalOpen(true)}
            className="bg-ink text-ivory text-sm font-medium px-6 py-3 rounded-full flex-1"
          >
            {t("listing.bookNow", "Book Now")}
          </button>
        )}
      </div>
    </AppShell>
  );
}
