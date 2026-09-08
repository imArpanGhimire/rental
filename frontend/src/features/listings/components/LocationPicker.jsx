import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, Loader2, MapPin, Search } from "lucide-react";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CENTER = [27.7172, 85.324];

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

function RecenterOnChange({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, {
        duration: 0.8,
      });
    }
  }, [position, map]);

  return null;
}

export default function LocationPicker({
  value,
  onChange,
  onAddressSuggestion,
}) {
  const position = value || DEFAULT_CENTER;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearching(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=np&q=${encodeURIComponent(
            query,
          )}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function pickSuggestion(suggestion) {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    onChange([lat, lng]);
    onAddressSuggestion?.(suggestion.display_name);
    setQuery(suggestion.display_name);
    setSuggestions([]);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocateError("Geolocation isn't supported by your browser");
      return;
    }

    setLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        onChange([lat, lng]);
        setQuery("");
        setLocating(false);
      },
      () => {
        setLocateError(
          "Couldn't get your location. Check browser permissions.",
        );
        setLocating(false);
      },
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          className="
            flex items-center gap-2.5 rounded-2xl border border-black/[0.09]
            bg-white/45 px-3.5 py-2.5 transition-colors
            focus-within:border-black/20 focus-within:bg-white/65
            dark:border-white/[0.09] dark:bg-white/[0.025]
            dark:focus-within:border-white/20 dark:focus-within:bg-white/[0.045]
          "
        >
          <Search
            size={15}
            strokeWidth={1.8}
            className="shrink-0 text-[#2b2d31]/38 dark:text-white/35"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a place in Nepal..."
            className="
              min-w-0 flex-1 bg-transparent text-sm text-[#202226] outline-none
              placeholder:text-[#2b2d31]/30
              dark:text-white dark:placeholder:text-white/25
            "
          />

          {searching && (
            <Loader2
              size={14}
              strokeWidth={1.8}
              className="animate-spin text-[#2b2d31]/40 dark:text-white/35"
            />
          )}

          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="
              hidden shrink-0 items-center gap-1.5 rounded-full
              border border-black/[0.08] bg-white/50 px-3 py-1.5
              text-[10px] font-semibold text-[#2b2d31]/62 transition-colors
              hover:bg-white/80 hover:text-[#17191d]
              disabled:cursor-not-allowed disabled:opacity-50
              sm:inline-flex
              dark:border-white/[0.08] dark:bg-white/[0.035]
              dark:text-white/58 dark:hover:bg-white/[0.07] dark:hover:text-white
            "
          >
            {locating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Crosshair size={12} strokeWidth={1.9} />
            )}
            Current location
          </button>
        </div>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="
            mt-2 inline-flex items-center gap-1.5 rounded-full border
            border-black/[0.08] bg-white/45 px-3 py-2 text-[10px] font-semibold
            text-[#2b2d31]/62 transition-colors hover:bg-white/75
            disabled:cursor-not-allowed disabled:opacity-50 sm:hidden
            dark:border-white/[0.08] dark:bg-white/[0.035]
            dark:text-white/58 dark:hover:bg-white/[0.07]
          "
        >
          {locating ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Crosshair size={12} strokeWidth={1.9} />
          )}
          Use current location
        </button>

        {suggestions.length > 0 && (
          <div
            className="
              absolute left-0 right-0 top-[calc(100%+8px)] z-[600]
              overflow-hidden rounded-2xl border border-black/[0.09]
              bg-[#f5f4f0]/95 shadow-[0_18px_48px_rgba(20,23,31,0.14)]
              backdrop-blur-xl
              dark:border-white/[0.09] dark:bg-[#17191e]/95
            "
          >
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.place_id}
                onClick={() => pickSuggestion(suggestion)}
                className="
                  flex w-full items-start gap-2.5 border-b border-black/[0.06]
                  px-3.5 py-3 text-left text-[12px] leading-5 text-[#2b2d31]/72
                  transition-colors last:border-b-0 hover:bg-black/[0.035]
                  dark:border-white/[0.06] dark:text-white/68
                  dark:hover:bg-white/[0.045]
                "
              >
                <MapPin
                  size={13}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-[#2b2d31]/38 dark:text-white/35"
                />
                <span>{suggestion.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {locateError && <p className="text-xs text-red-600">{locateError}</p>}

      <div
        className="
          h-64 overflow-hidden rounded-[20px] border border-black/[0.08]
          bg-black/[0.03] sm:h-72
          dark:border-white/[0.08] dark:bg-white/[0.03]
        "
      >
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <ClickHandler onPick={onChange} />
          <RecenterOnChange position={value} />

          {value && <Marker position={value} icon={icon} />}
        </MapContainer>
      </div>

      <div
        className="
          flex items-start gap-2 rounded-2xl border border-black/[0.06]
          bg-white/35 px-3.5 py-3 text-[11px] leading-5 text-[#2b2d31]/48
          dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-white/43
        "
      >
        <MapPin size={13} strokeWidth={1.8} className="mt-0.5 shrink-0" />

        <span>
          {value
            ? `Pinned at ${value[0].toFixed(5)}, ${value[1].toFixed(5)}`
            : "Search above, use your current location, or click on the map to drop a pin."}
        </span>
      </div>
    </div>
  );
}
