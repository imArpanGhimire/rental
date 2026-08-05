import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Heart, Star } from "lucide-react";

export default function ListingGallery({ photos = [], rating }) {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const hero = photos[active];
  const extraCount = photos.length - 5;

  return (
    <div className="relative -mx-6 sm:mx-0">
      <div className="relative aspect-[4/3] sm:aspect-video sm:rounded-2xl overflow-hidden bg-brass-light">
        {hero && <img src={hero} alt="" className="w-full h-full object-cover" />}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-bg/90 flex items-center justify-center text-text"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </button>

        {rating && (
          <span className="absolute top-4 left-16 bg-bg/90 text-text text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1">
            <Star size={12} className="fill-current" />
            {rating}
          </span>
        )}

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-bg/90 flex items-center justify-center text-text"
            aria-label="Share listing"
          >
            <Share2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className={`w-9 h-9 rounded-full bg-bg/90 flex items-center justify-center ${
              saved ? "text-brass" : "text-text"
            }`}
            aria-label="Save listing"
          >
            <Heart size={15} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {photos.length > 1 && (
          <div className="absolute -bottom-6 left-4 right-4 flex gap-2">
            {photos.slice(0, 5).map((photo, i) => {
              const isLastVisible = i === 4 && extraCount > 0;
              return (
                <button
                  key={photo}
                  onClick={() => setActive(i)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                    i === active ? "border-ink" : "border-bg"
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  {isLastVisible && (
                    <span className="absolute inset-0 bg-ink/60 flex items-center justify-center text-ivory text-xs font-medium">
                      {extraCount}+
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
