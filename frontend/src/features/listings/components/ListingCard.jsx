import { formatAddress } from "../../../utils/formatAddress";
import { formatRelativeDate } from "../../../utils/formatDate";
import Icon from "../../../components/ui/Icon";

export default function ListingCard({
  listing,
  selected,
  onClick,
  onToggleFavorite,
  isFavorited,
  variant = "card",
}) {
  const imageUrl = listing.images?.[0]?.url;

  // Force the saved state to green regardless of theme/CSS conflicts.
  const favoriteStyle = isFavorited
    ? {
        backgroundColor: "#16a34a",
        borderColor: "#16a34a",
        color: "#ffffff",
      }
    : {
        backgroundColor: "transparent",
      };

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left flex gap-4 rounded-2xl border border-stone bg-bg p-3 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(20,20,26,0.08)] ${
          selected ? "ring-2 ring-brass" : ""
        }`}
      >
        {/* IMAGE */}

        <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-ivory border border-stone">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
              No photo
            </div>
          )}
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-base truncate">
              {listing.title}
            </h3>

            {/* FAVORITE */}

            {onToggleFavorite && (
              <span
                role="button"
                aria-label={
                  isFavorited ? "Remove from saved listings" : "Save listing"
                }
                title={
                  isFavorited ? "Remove from saved listings" : "Save listing"
                }
                style={favoriteStyle}
                className={`
                  shrink-0
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-all
                  duration-200

                  ${
                    isFavorited
                      ? "border-transparent text-white shadow-sm"
                      : "border-black/10 text-neutral-500 dark:border-white/20 dark:text-white/70"
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(listing._id);
                }}
              >
                <Icon name="heart" filled={isFavorited} size={15} />
              </span>
            )}
          </div>

          {/* LOCATION */}

          <p className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1.5 truncate">
            <Icon name="pin" size={12} className="shrink-0 text-neutral-400" />

            {formatAddress(listing.location)}
          </p>

          {/* PROPERTY INFO */}

          <div className="flex items-center gap-4 text-xs text-neutral-500 mt-3">
            <span className="flex items-center gap-1.5">
              <Icon name="bed" size={14} />
              {listing.rooms ?? "—"}
            </span>

            <span className="flex items-center gap-1.5">
              <Icon name="bath" size={14} />
              {listing.bathrooms ?? 1}
            </span>
          </div>

          {/* PRICE */}

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-semibold">
              Rs {listing.price?.toLocaleString("en-IN")}
              <span className="font-normal text-neutral-500"> / month</span>
            </p>

            {listing.createdAt && (
              <span className="text-[11px] text-neutral-400 shrink-0">
                {formatRelativeDate(listing.createdAt)}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl bg-bg border border-stone overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(20,20,26,0.08)] ${
        selected ? "ring-2 ring-brass" : ""
      }`}
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-[4/3] overflow-hidden bg-ivory border-b border-stone">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
            No photo yet
          </div>
        )}

        {/* ===================================================
            FAVORITE
        =================================================== */}

        {onToggleFavorite && (
          <span
            role="button"
            aria-label={
              isFavorited ? "Remove from saved listings" : "Save listing"
            }
            title={isFavorited ? "Remove from saved listings" : "Save listing"}
            style={favoriteStyle}
            className={`
              absolute
              right-3
              top-3
              z-20

              flex
              h-9
              w-9
              items-center
              justify-center

              rounded-full
              border

              transition-all
              duration-200

              ${
                isFavorited
                  ? "border-transparent text-white shadow-[0_3px_12px_rgba(0,0,0,0.18)]"
                  : "border-white/80 text-white shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
              }
            `}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onToggleFavorite(listing._id);
            }}
          >
            <Icon name="heart" filled={isFavorited} size={16} />
          </span>
        )}
      </div>

      {/* =====================================================
          PROPERTY DETAILS
      ===================================================== */}

      <div className="p-4">
        {/* PRICE + DATE */}

        <div className="flex items-start justify-between gap-2">
          <span className="text-base font-semibold">
            Rs {listing.price?.toLocaleString("en-IN")}
            <span className="text-xs font-normal text-neutral-500">
              {" "}
              / month
            </span>
          </span>

          {listing.createdAt && (
            <span className="text-[11px] text-neutral-400 shrink-0 mt-0.5">
              {formatRelativeDate(listing.createdAt)}
            </span>
          )}
        </div>

        {/* TITLE */}

        <h3 className="font-semibold text-sm mt-2 truncate">{listing.title}</h3>

        {/* LOCATION */}

        <p className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1.5">
          <Icon name="pin" size={12} className="shrink-0 text-neutral-400" />

          <span className="truncate">{formatAddress(listing.location)}</span>
        </p>

        {/* ROOMS + BATHROOMS */}

        <div className="flex items-center gap-4 text-xs text-neutral-500 mt-4">
          <span className="flex items-center gap-1.5">
            <Icon name="bed" size={14} />
            {listing.rooms ?? "—"}
          </span>

          <span className="flex items-center gap-1.5">
            <Icon name="bath" size={14} />
            {listing.bathrooms ?? 1}
          </span>
        </div>
      </div>
    </button>
  );
}
