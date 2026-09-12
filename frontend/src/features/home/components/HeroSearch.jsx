import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, ChevronDown } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "", label: "Any type" },
  { value: "room", label: "Room" },
  { value: "flat", label: "Flat" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "land", label: "Land" },
  { value: "shop", label: "Shop / Office" },
];

export default function HeroSearch() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    navigate("/browse", {
      state: {
        homeFilters: {
          search: search.trim(),
          type,
        },
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        mx-auto
        flex
        max-w-[760px]
        flex-col
        gap-2
        rounded-[22px]
        border
        border-stone
        bg-bg/95
        p-2
        text-left
        shadow-[0_18px_50px_rgba(20,23,31,0.10)]
        backdrop-blur-xl

        sm:flex-row
        sm:items-center
        sm:gap-0
        sm:rounded-full
      "
    >
      {/* LOCATION */}

      <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2">
        <MapPin size={17} strokeWidth={1.8} className="shrink-0 text-brass" />

        <label className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-ink/35">
            Where
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Kathmandu, Lalitpur..."
            className="
              mt-0.5
              w-full
              border-0
              bg-transparent
              p-0
              text-[13px]
              font-semibold
              text-ink
              outline-none
              placeholder:text-ink/30
            "
          />
        </label>
      </div>

      <div className="hidden h-9 w-px bg-stone sm:block" />

      {/* PROPERTY TYPE */}

      <div className="relative flex min-w-0 flex-1 items-center gap-3 px-4 py-2">
        <div className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-ink/35">
            Property
          </span>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="
              mt-0.5
              w-full
              appearance-none
              border-0
              bg-transparent
              p-0
              pr-6
              text-[13px]
              font-semibold
              text-ink
              outline-none
            "
          >
            {PROPERTY_TYPES.map((propertyType) => (
              <option
                key={propertyType.value}
                value={propertyType.value}
                className="bg-bg text-ink"
              >
                {propertyType.label}
              </option>
            ))}
          </select>
        </div>

        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-4 bottom-[15px] text-ink/35"
        />
      </div>

      {/* SEARCH */}

      <button
        type="submit"
        className="
          flex
          h-12
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-[16px]
          bg-ink
          px-6
          text-[13px]
          font-semibold
          text-ivory
          shadow-sm
          transition-opacity
          hover:opacity-90

          sm:h-12
          sm:w-12
          sm:rounded-full
          sm:px-0
        "
        aria-label="Search rentals"
      >
        <Search size={17} strokeWidth={2} />

        <span className="sm:hidden">Search rentals</span>
      </button>
    </form>
  );
}
