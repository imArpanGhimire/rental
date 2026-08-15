import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { ArrowLeft, Star } from "lucide-react";

export default function ListingGallery({ photos = [], rating }) {
  const [active, setActive] = useState(0);

  const navigate = useNavigate();

  const hero = photos[active] || photos[0];

  if (!photos.length) {
    return (
      <div className="rounded-2xl overflow-hidden border border-stone bg-brass-light aspect-[4/3] sm:aspect-video flex items-center justify-center">
        <p className="text-sm text-text/40">No photos available</p>
      </div>
    );
  }

  const visiblePhotos = photos.slice(0, 5);

  const extraCount = Math.max(photos.length - visiblePhotos.length, 0);

  return (
    <div className="w-full">
      <div className="flex items-stretch gap-3">
        {/* MAIN PHOTO */}
        <div className="relative flex-1 min-w-0 aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-brass-light border border-stone shadow-[0_8px_30px_rgba(20,20,26,0.08)]">
          <img
            src={hero}
            alt="Property"
            className="w-full h-full object-cover"
          />

          {/* BACK */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-bg/90 backdrop-blur-sm flex items-center justify-center text-text shadow-sm hover:bg-white hover:scale-105 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>

          {/* RATING */}
          {rating && (
            <span className="absolute top-4 left-16 bg-bg/90 backdrop-blur-sm text-text text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <Star size={12} className="fill-brass text-brass" />

              {rating}
            </span>
          )}

          {/* PHOTO COUNT */}
          {photos.length > 1 && (
            <span className="absolute bottom-4 right-4 bg-ink/75 backdrop-blur-sm text-ivory text-[11px] font-medium px-3 py-1.5 rounded-full">
              {active + 1} / {photos.length}
            </span>
          )}
        </div>

        {/* SIDE THUMBNAILS */}
        {photos.length > 1 && (
          <div className="w-[64px] sm:w-[76px] shrink-0 flex flex-col gap-2">
            {visiblePhotos.map((photo, index) => {
              const activePhoto = index === active;

              const lastVisible =
                index === visiblePhotos.length - 1 && extraCount > 0;

              return (
                <button
                  key={`${photo}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activePhoto
                      ? "border-ink ring-2 ring-brass/20"
                      : "border-stone hover:border-brass opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {lastVisible && (
                    <span className="absolute inset-0 bg-ink/65 flex items-center justify-center text-ivory text-xs font-semibold">
                      +{extraCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* MOBILE THUMBNAILS */}
      {photos.length > 1 && (
        <div className="sm:hidden mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={`mobile-${photo}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                index === active ? "border-ink" : "border-stone"
              }`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
