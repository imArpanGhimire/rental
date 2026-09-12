import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { useListings } from "../../listings/hooks/useListings.js";

function getImage(listing) {
  if (Array.isArray(listing?.images) && listing.images.length > 0) {
    const firstImage = listing.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return firstImage?.url || firstImage?.secure_url || null;
  }

  return null;
}

function getLocation(listing) {
  return (
    listing?.address ||
    listing?.city ||
    listing?.location?.name ||
    listing?.location?.address ||
    "Nepal"
  );
}

function formatPrice(price) {
  if (price == null) return "Price on request";

  return `Rs. ${Number(price).toLocaleString()}`;
}

export default function FeaturedHomes() {
  const { data, isLoading, error } = useListings();

  const listings = (data?.properties ?? []).slice(0, 3);

  return (
    <section className="py-3 sm:py-5">
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brass">
            Fresh on Rentora
          </p>

          <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.045em] text-ink sm:text-[32px]">
            Places worth a look
          </h2>

          <p className="mt-1.5 max-w-xl text-sm text-ink/50">
            A few rentals currently available on Rentora.
          </p>
        </div>

        <Link
          to="/browse"
          className="
            hidden
            shrink-0
            items-center
            gap-2
            rounded-full
            border
            border-stone
            bg-bg
            px-4
            py-2.5
            text-[12px]
            font-semibold
            text-ink
            no-underline
            transition-colors
            hover:border-ink/20
            hover:bg-ivory
            sm:flex
          "
        >
          Browse all
          <ArrowRight size={14} strokeWidth={1.8} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[22px] border border-stone bg-bg"
            >
              <div className="aspect-[4/3] animate-pulse bg-stone/50" />

              <div className="space-y-3 p-4">
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-stone" />
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-stone" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[22px] border border-stone bg-bg px-6 py-10 text-center">
          <p className="text-sm font-medium text-ink">
            We couldn't load the latest listings.
          </p>

          <Link
            to="/browse"
            className="mt-3 inline-block text-xs font-semibold text-brass"
          >
            Open Browse instead
          </Link>
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-[22px] border border-stone bg-bg px-6 py-10 text-center">
          <p className="text-sm text-ink/50">
            No listings are available right now.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {listings.map((listing) => {
            const image = getImage(listing);

            return (
              <Link
                key={listing._id}
                to={`/listings/${listing._id}`}
                className="
                  group
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-stone
                  bg-bg
                  text-ink
                  no-underline
                  shadow-[0_12px_35px_rgba(20,23,31,0.04)]
                  transition-[border-color,box-shadow]
                  hover:border-ink/15
                  hover:shadow-[0_16px_42px_rgba(20,23,31,0.08)]
                "
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory">
                  {image ? (
                    <img
                      src={image}
                      alt={listing.title || "Rental property"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-sm font-semibold text-ink/25">
                        Rentora
                      </span>
                    </div>
                  )}

                  {listing.type && (
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[9px] font-semibold capitalize text-white backdrop-blur-md">
                      {listing.type}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="line-clamp-1 font-display text-[16px] font-semibold tracking-[-0.025em] text-ink">
                      {listing.title || "Rental property"}
                    </h3>

                    <span className="shrink-0 text-[12px] font-bold text-ink">
                      {formatPrice(listing.price)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink/40">
                    <MapPin size={12} strokeWidth={1.8} className="shrink-0" />

                    <span className="truncate">{getLocation(listing)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Link
        to="/browse"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-stone bg-bg py-3 text-xs font-semibold text-ink no-underline sm:hidden"
      >
        Browse all rentals
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
