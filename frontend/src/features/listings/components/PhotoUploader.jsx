import { useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";

import { useUploadImages } from "../hooks/useUploadImages.js";

const MAX_IMAGES = 5;

export default function PhotoUploader({ images = [], onChange }) {
  const [error, setError] = useState(null);
  const uploadMutation = useUploadImages();
  const uploading = uploadMutation.isPending;

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} photos.`);

      e.target.value = "";
      return;
    }

    const selected = files.slice(0, remaining);

    setError(null);

    try {
      const uploaded = await uploadMutation.mutateAsync(selected);

      onChange([...images, ...uploaded]);

      if (files.length > remaining) {
        setError(
          `Only ${MAX_IMAGES} photos are allowed. Extra files were ignored.`,
        );
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  function removeImage(publicId) {
    onChange(images.filter((img) => img.publicId !== publicId));

    setError(null);
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, index) => (
            <div
              key={img.publicId || img.url}
              className="
                  group relative aspect-[4/3] overflow-hidden rounded-[18px]
                  border border-black/[0.08] bg-black/[0.03]
                  dark:border-white/[0.08] dark:bg-white/[0.03]
                "
            >
              <img
                src={img.url}
                alt={`Property photo ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur">
                  Cover photo
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="
                    absolute right-2 top-2 flex h-7 w-7 items-center justify-center
                    rounded-full border border-white/15 bg-black/55 text-white
                    backdrop-blur transition-colors hover:bg-black/75
                  "
                aria-label="Remove photo"
              >
                <X size={13} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < MAX_IMAGES && (
        <label
          className={`
            flex min-h-[150px] cursor-pointer flex-col items-center justify-center
            rounded-[20px] border border-dashed border-black/[0.14] bg-white/30
            px-6 py-7 text-center transition-colors
            hover:border-black/25 hover:bg-white/55
            dark:border-white/[0.12] dark:bg-white/[0.02]
            dark:hover:border-white/20 dark:hover:bg-white/[0.045]
            ${uploading ? "pointer-events-none opacity-65" : ""}
          `}
        >
          <div
            className="
              flex h-11 w-11 items-center justify-center rounded-2xl
              border border-black/[0.07] bg-white/65 text-[#2b2d31]/75
              dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white/65
            "
          >
            {uploading ? (
              <Loader2 size={18} strokeWidth={1.8} className="animate-spin" />
            ) : (
              <ImagePlus size={18} strokeWidth={1.8} />
            )}
          </div>

          <p className="mt-3 text-[14px] font-semibold text-[#202226] dark:text-white">
            {uploading
              ? "Uploading photos..."
              : images.length
                ? "Add more photos"
                : "Add property photos"}
          </p>

          <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#2b2d31]/45 dark:text-white/40">
            {images.length} / {MAX_IMAGES} photos. The first photo is used as
            the cover.
          </p>

          {!uploading && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/50 px-3 py-1.5 text-[10px] font-semibold text-[#2b2d31]/60 dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white/55">
              <Upload size={11} strokeWidth={1.9} />
              Browse files
            </span>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-300">{error}</p>
      )}
    </div>
  );
}
