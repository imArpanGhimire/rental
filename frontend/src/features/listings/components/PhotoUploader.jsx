import { useState } from "react";
import { X, Upload } from "lucide-react";
import { uploadImage } from "../../../api/listings.api.js";

/**
 * images: [{ url, publicId }]
 * onChange: (images) => void
 */
export default function PhotoUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage(file)));
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // lets the same file be re-selected later if removed
    }
  }

  function removeImage(publicId) {
    onChange(images.filter((img) => img.publicId !== publicId));
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-wide text-text/70">Photos</label>

      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div key={img.publicId} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.publicId)}
              className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
              aria-label="Remove photo"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}

        <label className="w-20 h-20 rounded-lg border border-dashed border-stone flex flex-col items-center justify-center cursor-pointer text-text/50 hover:border-brass hover:text-brass transition-colors">
          <Upload size={16} />
          <span className="text-[10px] mt-1">{uploading ? "..." : "Add"}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
