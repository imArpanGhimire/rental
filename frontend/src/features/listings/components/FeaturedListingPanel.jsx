import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';
import DropdownMenu from '../../../components/ui/DropdownMenu';

export default function FeaturedListingPanel({ listings = [], isLoading }) {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selected && listings.length > 0) setSelected(listings[0]);
    if (selected && !listings.find((l) => l._id === selected._id)) {
      setSelected(listings[0] || null);
    }
  }, [listings, selected]);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-ivory border border-stone p-6 text-sm text-neutral-500">
        Loading listings…
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="rounded-2xl bg-ivory border border-stone p-6 text-sm text-neutral-500">
        No listings match your search yet.
      </div>
    );
  }

  return (
    <div className="p-1">
      {selected && (
        <div className="rounded-2xl bg-bg border border-stone shadow-[0_1px_2px_rgba(20,20,26,0.04),0_8px_24px_rgba(20,20,26,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500">Most popular</span>
            <button
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="share" size={14} /> Share
            </button>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => navigate(`/listings/${selected._id}`)}
            role="button"
            tabIndex={0}
          >
            <div className="px-5 pt-3">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-ivory border border-stone">
                {selected.images?.[0]?.url ? (
                  <img src={selected.images[0].url} alt={selected.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    No photo yet
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pt-4">
              <h2 className="text-xl font-bold tracking-tight leading-snug hover:underline">{selected.title}</h2>
              <p className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1.5">
                <Icon name="pin" size={13} className="text-neutral-400 flex-shrink-0" />
                {selected.location?.address || 'Location unavailable'}
              </p>
            </div>
          </div>

          <div className="px-5 pb-4">
            <div className="flex gap-5 text-sm text-neutral-500 my-3.5">
              <span className="flex items-center gap-1.5"><Icon name="bed" size={15} className="text-neutral-400" />{selected.rooms ?? '—'}</span>
              <span className="flex items-center gap-1.5"><Icon name="bath" size={15} className="text-neutral-400" />{selected.bathrooms ?? 1}</span>
              <span className="flex items-center gap-1.5"><Icon name="ruler" size={15} className="text-neutral-400" />{selected.sizeSqft ?? '—'} sqft</span>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">{selected.description}</p>

            <p className="mt-4 text-sm">
              Rental price: <strong className="text-base">Rs {selected.price?.toLocaleString('en-IN')} / month</strong>
            </p>

            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 bg-ink text-ivory rounded-full py-3 font-semibold text-sm honey-lift hover:shadow-lg hover:-translate-y-px active:translate-y-0 active:shadow-sm active:duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/listings/${selected._id}`);
                }}
              >
                Show contacts <Icon name="arrowRight" size={16} />
              </button>
              <DropdownMenu
                trigger={
                  <button
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-stone hover:bg-ivory transition-colors duration-200"
                    aria-label="More actions"
                  >
                    <Icon name="dots" size={16} />
                  </button>
                }
                items={[
                  {
                    label: "Copy link",
                    onSelect: () => {
                      navigator.clipboard.writeText(`${window.location.origin}/listings/${selected._id}`);
                    },
                  },
                  {
                    label: "Report listing",
                    danger: true,
                    onSelect: () => {
                      console.log("report listing", selected._id);
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {listings.length > 1 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-3 px-1 tracking-tight">More nearby</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listings
              .filter((l) => l._id !== selected?._id)
              .slice(0, 4)
              .map((l) => (
                <button
                  key={l._id}
                  onClick={() => navigate(`/listings/${l._id}`)}
                  className="text-left rounded-2xl bg-bg border border-stone overflow-hidden honey-lift hover:shadow-[0_8px_24px_rgba(20,20,26,0.08)] hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ivory border-b border-stone">
                    {l.images?.[0]?.url ? (
                      <img src={l.images[0].url} alt={l.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                        No photo yet
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm truncate">{l.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">Rs {l.price?.toLocaleString('en-IN')} /mo</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
