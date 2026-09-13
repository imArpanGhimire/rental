import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import {
  AlignLeft,
  Building2,
  Check,
  ChevronDown,
  ImagePlus,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";

import LocationPicker from "./LocationPicker.jsx";
import PhotoUploader from "./PhotoUploader.jsx";

import { useCreateListing } from "../hooks/useCreateListing.js";
import { useUpdateListing } from "../hooks/useUpdateListing.js";

import { LISTING_TYPES, COMMON_AMENITIES } from "../constants.js";

import { useAuth } from "../../auth/AuthContext.jsx";

function SectionCard({ icon: Icon, eyebrow, title, description, children }) {
  return (
    <section
      className="
        overflow-hidden rounded-[26px]
        border border-black/[0.07]
        bg-white/52
        shadow-[0_18px_52px_rgba(20,23,31,0.045)]
        backdrop-blur
        dark:border-white/[0.07]
        dark:bg-white/[0.025]
        dark:shadow-none
      "
    >
      <div className="border-b border-black/[0.06] px-5 py-5 sm:px-6 dark:border-white/[0.07]">
        <div className="flex items-start gap-3.5">
          <div
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl border border-black/[0.06]
              bg-white/60 text-[#2a2c30]
              dark:border-white/[0.08]
              dark:bg-white/[0.05]
              dark:text-white/80
            "
          >
            <Icon size={16} strokeWidth={1.8} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
              {eyebrow}
            </p>

            <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-[12px] leading-5 text-[#2b2d31]/48 dark:text-white/43">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.11em] text-[#2b2d31]/52 dark:text-white/48">
      {children}
    </label>
  );
}

export default function CreateListingForm({ listing = null, mode = "create" }) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const isEdit = mode === "edit" && Boolean(listing?._id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "rental",
      price: "",
      contactPhone: user?.phone || "",
      address: "",
      rooms: "",
      furnished: "false",
      genderPreference: "any",
      waterSupply: "",
      isAvailable: "true",
    },
  });

  const [amenities, setAmenities] = useState([]);

  const [images, setImages] = useState([]);

  const [position, setPosition] = useState(null);

  const [locationError, setLocationError] = useState(null);

  const createMutation = useCreateListing();

  const updateMutation = useUpdateListing(listing?._id);

  const activeMutation = isEdit ? updateMutation : createMutation;

  useEffect(() => {
    if (!listing) {
      if (user?.phone) {
        setValue("contactPhone", user.phone);
      }

      return;
    }

    const coordinates = listing.location?.coordinates || [];

    const lng = coordinates[0];

    const lat = coordinates[1];

    reset({
      title: listing.title || "",

      description: listing.description || "",

      type: listing.type || "rental",

      price: listing.price ?? "",

      contactPhone:
        listing.contactPhone || listing.owner?.phone || user?.phone || "",

      address: listing.location?.address || "",

      rooms: listing.rooms ?? "",

      furnished: listing.furnished ? "true" : "false",

      genderPreference: listing.genderPreference || "any",

      waterSupply: listing.waterSupply || "",

      isAvailable: listing.isAvailable === false ? "false" : "true",
    });

    setAmenities(listing.amenities || []);

    setImages(listing.images || []);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setPosition([lat, lng]);
    }
  }, [listing, reset, setValue, user?.phone]);

  function toggleAmenity(amenity) {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  }

  function onSubmit(data) {
    if (!position) {
      setLocationError("Please drop a pin on the map to set the location");

      return;
    }

    if (!/^9[678]\d{8}$/.test(data.contactPhone)) {
      return;
    }

    setLocationError(null);

    const [lat, lng] = position;

    const payload = {
      title: data.title.trim(),

      description: data.description.trim(),

      type: data.type,

      price: Number(data.price),

      contactPhone: data.contactPhone.trim(),

      location: {
        coordinates: [lng, lat],

        address: data.address.trim(),
      },

      amenities,
      images,

      rooms: data.rooms === "" ? "" : Number(data.rooms),

      furnished: data.furnished === "true",

      genderPreference: data.genderPreference,

      waterSupply: data.waterSupply,

      ...(isEdit
        ? {
            isAvailable: data.isAvailable === "true",
          }
        : {}),
    };

    activeMutation.mutate(payload, {
      onSuccess: (result) => {
        const updated = result?.updatedProperty || result?.property || result;

        const id = updated?._id || listing?._id;

        if (isEdit) {
          navigate("/owner/listings", {
            replace: true,
          });

          return;
        }

        if (id) {
          navigate(`/listings/${id}`);
        } else {
          navigate("/owner/listings");
        }
      },
    });
  }

  const mutationError = activeMutation.error;

  const isPending = activeMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="space-y-5">
          <SectionCard
            icon={Building2}
            eyebrow="Step 01"
            title="Property details"
            description="Give renters the essential information they need at a glance."
          >
            <div className="space-y-5">
              <Input
                label="Title"
                placeholder="e.g. Sunny 2BHK near New Baneshwor"
                {...register("title", {
                  required: "Title is required",
                })}
                error={errors.title?.message}
              />

              <div>
                <FieldLabel>Description</FieldLabel>

                <div className="relative">
                  <AlignLeft
                    size={15}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-[#2b2d31]/32 dark:text-white/30"
                  />

                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={5}
                    placeholder="Describe the property, surroundings and anything renters should know..."
                    className="
                      w-full resize-none rounded-2xl
                      border border-black/[0.09]
                      bg-white/45 py-3 pl-10 pr-4
                      text-sm text-[#202226]
                      outline-none transition-colors
                      placeholder:text-[#2b2d31]/30
                      focus:border-black/20 focus:bg-white/65
                      dark:border-white/[0.09]
                      dark:bg-white/[0.025]
                      dark:text-white
                      dark:placeholder:text-white/25
                      dark:focus:border-white/20
                      dark:focus:bg-white/[0.045]
                    "
                  />
                </div>

                {errors.description && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel>Listing type</FieldLabel>

                  <div className="relative">
                    <select
                      {...register("type", {
                        required: true,
                      })}
                      className="
                        w-full appearance-none rounded-2xl
                        border border-black/[0.09]
                        bg-white/45 px-4 py-3 pr-10
                        text-sm text-[#202226]
                        outline-none transition-colors
                        focus:border-black/20 focus:bg-white/65
                        dark:border-white/[0.09]
                        dark:bg-white/[0.025]
                        dark:text-white
                        dark:focus:border-white/20
                        dark:focus:bg-white/[0.045]
                      "
                    >
                      {LISTING_TYPES.map((type) => (
                        <option
                          key={type.value}
                          value={type.value}
                          className="bg-bg text-text"
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={15}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2b2d31]/40 dark:text-white/35"
                    />
                  </div>
                </div>

                <Input
                  label="Price (NPR / month)"
                  type="number"
                  min="1"
                  placeholder="e.g. 25000"
                  {...register("price", {
                    required: "Price is required",

                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },
                  })}
                  error={errors.price?.message}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Rooms"
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  {...register("rooms", {
                    min: {
                      value: 0,
                      message: "Rooms cannot be negative",
                    },
                  })}
                  error={errors.rooms?.message}
                />

                <div>
                  <FieldLabel>Furnishing</FieldLabel>

                  <select
                    {...register("furnished")}
                    className="
                      w-full rounded-2xl border border-black/[0.09]
                      bg-white/45 px-4 py-3 text-sm text-[#202226]
                      outline-none focus:border-black/20
                      dark:border-white/[0.09]
                      dark:bg-white/[0.025]
                      dark:text-white
                    "
                  >
                    <option value="false">Unfurnished</option>

                    <option value="true">Furnished</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel>Gender preference</FieldLabel>

                  <select
                    {...register("genderPreference")}
                    className="
                      w-full rounded-2xl border border-black/[0.09]
                      bg-white/45 px-4 py-3 text-sm text-[#202226]
                      outline-none focus:border-black/20
                      dark:border-white/[0.09]
                      dark:bg-white/[0.025]
                      dark:text-white
                    "
                  >
                    <option value="any">Any</option>

                    <option value="male">Male</option>

                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Water supply</FieldLabel>

                  <select
                    {...register("waterSupply")}
                    className="
                      w-full rounded-2xl border border-black/[0.09]
                      bg-white/45 px-4 py-3 text-sm text-[#202226]
                      outline-none focus:border-black/20
                      dark:border-white/[0.09]
                      dark:bg-white/[0.025]
                      dark:text-white
                    "
                  >
                    <option value="">Not specified</option>

                    <option value="municipal">Municipal</option>

                    <option value="tanker">Tanker</option>

                    <option value="jar">Jar</option>

                    <option value="borewell">Borewell</option>
                  </select>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={Phone}
            eyebrow="Step 02"
            title="Contact"
            description="Choose the phone number renters should use for this property."
          >
            <Input
              label="Contact phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98XXXXXXXX"
              {...register("contactPhone", {
                required: "Contact phone is required",

                pattern: {
                  value: /^9[678]\d{8}$/,

                  message: "Enter a valid 10-digit Nepali mobile number",
                },
              })}
              error={errors.contactPhone?.message}
            />

            <p className="mt-2 text-[10px] leading-4 text-[#2b2d31]/40 dark:text-white/35">
              Your registered owner phone is used by default, but you can use a
              different number for this property.
            </p>
          </SectionCard>

          <SectionCard
            icon={MapPin}
            eyebrow="Step 03"
            title="Location"
            description="Set a clear address and pin the exact property location."
          >
            <div className="space-y-5">
              <Input
                label="Address"
                placeholder="e.g. Baneshwor, Kathmandu"
                {...register("address", {
                  required: "Address is required",
                })}
                error={errors.address?.message}
              />

              <div>
                <FieldLabel>Pin the exact location</FieldLabel>

                <LocationPicker
                  value={position}
                  onChange={setPosition}
                  onAddressSuggestion={(name) =>
                    setValue("address", name, {
                      shouldValidate: true,
                    })
                  }
                />

                {locationError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {locationError}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={ImagePlus}
            eyebrow="Step 04"
            title="Property photos"
            description={
              isEdit
                ? "Keep, remove or add photos. Changes are finalized when you save."
                : "Add clear images that show the property accurately."
            }
          >
            <PhotoUploader images={images} onChange={setImages} />
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard
            icon={Sparkles}
            eyebrow="Step 05"
            title="Amenities"
            description="Select everything that applies to this property."
          >
            <div className="flex flex-wrap gap-2.5">
              {COMMON_AMENITIES.map((amenity) => {
                const active = amenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`
                        inline-flex items-center gap-1.5
                        rounded-full border px-3.5 py-2
                        text-[11px] font-semibold
                        transition-colors
                        ${
                          active
                            ? "border-[#202226] bg-[#202226] text-white dark:border-white dark:bg-white dark:text-[#17191d]"
                            : "border-black/[0.09] bg-white/40 text-[#2b2d31]/62 hover:bg-white/75 hover:text-[#17191d] dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-white/58 dark:hover:bg-white/[0.06] dark:hover:text-white"
                        }
                      `}
                  >
                    {active && <Check size={12} strokeWidth={2.2} />}

                    {amenity}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {isEdit && (
            <SectionCard
              icon={Check}
              eyebrow="Status"
              title="Availability"
              description="Control whether renters can request a visit."
            >
              <div>
                <FieldLabel>Property status</FieldLabel>

                <select
                  {...register("isAvailable")}
                  className="
                    w-full rounded-2xl border border-black/[0.09]
                    bg-white/45 px-4 py-3 text-sm text-[#202226]
                    outline-none focus:border-black/20
                    dark:border-white/[0.09]
                    dark:bg-white/[0.025]
                    dark:text-white
                  "
                >
                  <option value="true">Available</option>

                  <option value="false">Rented / filled</option>
                </select>
              </div>
            </SectionCard>
          )}

          <aside
            className="
              rounded-[26px] border border-black/[0.07]
              bg-gradient-to-br
              from-[#f0efeb]
              via-[#e7e6e2]
              to-[#d8d7d3]
              p-5
              shadow-[0_18px_52px_rgba(20,23,31,0.045)]
              sm:p-6
              dark:border-white/[0.07]
              dark:from-[#1b1e24]
              dark:via-[#17191e]
              dark:to-[#111318]
              dark:shadow-none
              xl:sticky xl:top-6
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/40 dark:text-white/38">
              {isEdit ? "Ready to save" : "Ready to publish"}
            </p>

            <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
              {isEdit ? "Update listing" : "Listing checklist"}
            </h2>

            <div className="mt-5 space-y-3">
              {[
                "Clear title and description",
                "Correct rent and property details",
                "Valid renter contact number",
                "Accurate map location",
                "Useful property photos",
                "Correct amenities",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 text-[12px] leading-5 text-[#2b2d31]/58 dark:text-white/52"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white/50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                    <Check size={11} strokeWidth={2} />
                  </span>

                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="my-5 h-px bg-black/[0.07] dark:bg-white/[0.07]" />

            {mutationError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-xs leading-5 text-red-700 dark:border-red-400/15 dark:bg-red-400/10 dark:text-red-300">
                {mutationError?.response?.data?.message ||
                  mutationError?.message ||
                  (isEdit
                    ? "Failed to update listing"
                    : "Failed to create listing")}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="
                w-full justify-center rounded-full
                border-0 bg-[#202226]
                py-3 text-white
                hover:bg-[#303238]
                dark:bg-white
                dark:text-[#17191d]
                dark:hover:bg-white/90
              "
            >
              {isPending
                ? isEdit
                  ? "Saving..."
                  : "Publishing..."
                : isEdit
                  ? "Save changes"
                  : "Publish listing"}
            </Button>

            {isEdit && (
              <button
                type="button"
                onClick={() => navigate("/owner/listings")}
                className="
                  mt-2 w-full rounded-full
                  border border-black/[0.08]
                  px-4 py-2.5
                  text-[11px] font-semibold
                  text-[#2b2d31]/60
                  transition-colors
                  hover:bg-white/40
                  dark:border-white/[0.08]
                  dark:text-white/55
                  dark:hover:bg-white/[0.04]
                "
              >
                Cancel
              </button>
            )}
          </aside>
        </div>
      </div>
    </form>
  );
}
