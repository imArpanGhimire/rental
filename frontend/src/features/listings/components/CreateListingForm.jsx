import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import LocationPicker from "./LocationPicker.jsx";
import PhotoUploader from "./PhotoUploader.jsx";
import { useCreateListing } from "../hooks/useCreateListing.js";
import { LISTING_TYPES, COMMON_AMENITIES } from "../constants.js";

export default function CreateListingForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: { type: "rental" },
  });
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]); // [{ url, publicId }]
  const [position, setPosition] = useState(null); // [lat, lng] from LocationPicker
  const [locationError, setLocationError] = useState(null);
  const { mutate, isPending, error } = useCreateListing();

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = (data) => {
    if (!position) {
      setLocationError("Please drop a pin on the map to set the location");
      return;
    }
    setLocationError(null);

    const [lat, lng] = position;

    mutate(
      {
        title: data.title,
        description: data.description,
        type: data.type,
        price: Number(data.price),
        location: {
          coordinates: [lng, lat], // schema stores [lng, lat]
          address: data.address,
        },
        amenities,
        images,
      },
      {
        onSuccess: (result) => {
          navigate(`/listings/${result.property._id}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl">
      <Input
        label="Title"
        placeholder="e.g. Sunny 2BHK near New Baneshwor"
        {...register("title", { required: "Title is required" })}
        error={errors.title?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wide text-text/70">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={3}
          className="border border-stone bg-transparent px-3 py-2 text-sm text-text outline-none focus:border-brass resize-none"
        />
        {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wide text-text/70">Type</label>
        <select
          {...register("type", { required: true })}
          className="border border-stone bg-transparent px-3 py-2 text-sm text-text outline-none focus:border-brass"
        >
          {LISTING_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-bg text-text">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Address (short description, e.g. Baneshwor, Kathmandu)"
        placeholder="e.g. Baneshwor, Kathmandu"
        {...register("address", { required: "Address is required" })}
        error={errors.address?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wide text-text/70">Pin the exact location</label>
        <LocationPicker
          value={position}
          onChange={setPosition}
          onAddressSuggestion={(name) => setValue("address", name, { shouldValidate: true })}
        />
        {locationError && <p className="text-xs text-red-600">{locationError}</p>}
      </div>

      <Input
        label="Price (NPR / month)"
        type="number"
        {...register("price", {
          required: "Price is required",
          min: { value: 1, message: "Price must be greater than 0" },
        })}
        error={errors.price?.message}
      />

      <PhotoUploader images={images} onChange={setImages} />

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wide text-text/70">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`px-3 py-1.5 text-xs border ${
                amenities.includes(amenity)
                  ? "border-brass bg-brass-light text-ink"
                  : "border-stone text-text/70"
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600">
          {error.message || "Failed to create listing"}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Publishing..." : "Publish Listing"}
      </Button>
    </form>
  );
}
