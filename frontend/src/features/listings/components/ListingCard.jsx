import { formatAddress } from "../../../utils/formatAddress";
import Icon from "../../../components/ui/Icon";

export default function ListingCard({
  listing,
  selected,
  onClick,
  onToggleFavorite,
  isFavorited,
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-bg text-left transition-all duration-200 ${
        selected
          ? "border-brass shadow-[0_0_0_3px_var(--color-brass-light)]"
          : "border-stone hover:border-brass/50 hover:shadow-[0_8px_24px_-12px_rgba(20,23,31,0.18)]"
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory">
        <img
          src={listing.images?.[0]}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {onToggleFavorite && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(listing._id);
            }}
            className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              isFavorited
                ? "bg-brick text-white"
                : "bg-white/80 text-ink hover:bg-white"
            }`}
          >
            <Icon name="heart" filled={isFavorited} size={15} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-lg font-semibold text-ink">
            Rs {listing.price?.toLocaleString()}
          </span>
          <span className="text-xs text-ink/50">/ month</span>
        </div>

        <p className="flex items-center gap-1 text-sm text-ink/60">
          <Icon name="pin" size={13} className="shrink-0 text-ink/40" />
          <span className="truncate">{formatAddress(listing.location)}</span>
        </p>

        <div className="mt-1 flex items-center gap-4 text-xs text-ink/55">
          <span className="flex items-center gap-1.5">
            <Icon name="bed" size={14} />
            {listing.rooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="bath" size={14} />
            {listing.bathrooms ?? 1}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="ruler" size={14} />
            {listing.sizeSqft} m²
          </span>
        </div>
      </div>
    </button>
  );
}
