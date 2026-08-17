import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Star, Share2 } from "lucide-react";

export default function ListingGallery({
  photos = [],
  rating,
  title = "Rentora listing",
}) {
  const [active, setActive] = useState(0);
  const [shareMessage, setShareMessage] = useState("");

  const navigate = useNavigate();

  const hero = photos[active] || photos[0];

  /*
   * Check whether the current device is a mobile
   * device. On mobile we prefer the native share
   * sheet. On desktop we copy the URL instead.
   */
  const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
      navigator.userAgent,
    );
  };

  /*
   * Copy the current listing URL.
   *
   * Uses the Clipboard API first and falls back
   * to a temporary textarea if necessary.
   */
  const copyListingLink = async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand("copy");

        document.body.removeChild(textarea);
      }

      setShareMessage("Link copied");

      window.setTimeout(() => {
        setShareMessage("");
      }, 2200);
    } catch {
      setShareMessage("Couldn't copy link");

      window.setTimeout(() => {
        setShareMessage("");
      }, 2200);
    }
  };

  /*
   * Share listing.
   *
   * Mobile:
   *   Opens the native Android/iOS share sheet.
   *
   * Desktop:
   *   Copies the listing URL.
   */
  const handleShare = async () => {
    const url = window.location.href;

    /*
     * Mobile devices should use the native
     * share sheet when available.
     */
    if (isMobileDevice() && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this property on Rentora: ${title}`,
          url,
        });
      } catch (error) {
        /*
         * AbortError simply means the user closed
         * the share sheet. Do not show an error.
         */
        if (error?.name !== "AbortError") {
          await copyListingLink();
        }
      }

      return;
    }

    /*
     * Desktop or unsupported mobile browser.
     */
    await copyListingLink();
  };

  /*
   * No images.
   */
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
        {/* =================================================
            MAIN PHOTO
        ================================================= */}

        <div className="relative flex-1 min-w-0 aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-brass-light border border-stone shadow-[0_8px_30px_rgba(20,20,26,0.08)]">
          <img src={hero} alt={title} className="w-full h-full object-cover" />

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-bg/90 backdrop-blur-sm flex items-center justify-center text-text shadow-sm hover:bg-white hover:scale-105 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>

          {/* =================================================
              RATING
          ================================================= */}

          {rating && (
            <span className="absolute top-4 left-16 bg-bg/90 backdrop-blur-sm text-text text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <Star size={12} className="fill-brass text-brass" />

              {rating}
            </span>
          )}

          {/* =================================================
              MOBILE SHARE BUTTON

              On desktop the share button lives above
              the thumbnail column.

              On mobile there is no thumbnail column
              beside the image, so show it here.
          ================================================= */}

          <button
            type="button"
            onClick={handleShare}
            className="sm:hidden absolute top-4 right-4 w-9 h-9 rounded-full bg-bg/90 backdrop-blur-sm flex items-center justify-center text-text shadow-sm hover:bg-white hover:scale-105 transition-all"
            aria-label="Share listing"
          >
            <Share2 size={16} />
          </button>

          {/* =================================================
              PHOTO COUNT
          ================================================= */}

          {photos.length > 1 && (
            <span className="absolute bottom-4 right-4 bg-ink/75 backdrop-blur-sm text-ivory text-[11px] font-medium px-3 py-1.5 rounded-full">
              {active + 1} / {photos.length}
            </span>
          )}
        </div>

        {/* =================================================
            DESKTOP SIDE COLUMN

            Share button is intentionally placed
            ABOVE the thumbnails.
        ================================================= */}

        {photos.length > 1 && (
          <div className="hidden sm:flex w-[64px] sm:w-[76px] shrink-0 flex-col gap-2">
            {/* =================================================
                SHARE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleShare}
              className="relative w-full aspect-square rounded-xl border border-stone bg-bg flex flex-col items-center justify-center gap-1.5 text-text hover:border-brass hover:bg-ivory transition-all shadow-sm"
              aria-label="Share listing"
              title="Share listing"
            >
              <Share2 size={17} />

              <span className="text-[9px] font-medium">Share</span>
            </button>

            {/* =================================================
                THUMBNAILS
            ================================================= */}

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

      {/* =================================================
          MOBILE THUMBNAILS
      ================================================= */}

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

      {/* =================================================
          COPY FEEDBACK
      ================================================= */}

      {shareMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-ink text-ivory text-sm font-medium px-4 py-2.5 rounded-full shadow-lg">
          {shareMessage}
        </div>
      )}
    </div>
  );
}
