import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Crosshair, Loader2 } from "lucide-react";
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
    if (position) map.flyTo(position, 16, { duration: 0.8 });
  }, [position, map]);
  return null;
}

export default function LocationPicker({ value, onChange, onAddressSuggestion }) {
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
            query
          )}`,
          { headers: { Accept: "application/json" } }
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

  function pickSuggestion(s) {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    onChange([lat, lng]);
    onAddressSuggestion?.(s.display_name);
    setQuery(s.display_name);
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
        setLocateError("Couldn't get your location. Check browser permissions.");
        setLocating(false);
      }
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div className="flex items-center gap-2 border border-stone rounded-xl px-3 py-2.5 bg-bg focus-within:border-brass transition-colors">
          <Search size={15} className="text-text/40 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a place in Nepal..."
            className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text/35"
          />
          {searching && <Loader2 size={14} className="animate-spin text-text/40" />}
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex items-center gap-1.5 text-xs font-medium text-brass shrink-0 disabled:opacity-50"
          >
            {locating ? <Loader2 size={13} className="animate-spin" /> : <Crosshair size={13} />}
            Use current location
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-[600] top-full mt-1.5 left-0 right-0 bg-bg border border-stone rounded-xl shadow-lg overflow-hidden animate-[hint-drop_200ms_var(--ease-honey-soft)_both]">
            {suggestions.map((s) => (
              <button
                type="button"
                key={s.place_id}
                onClick={() => pickSuggestion(s)}
                className="w-full text-left px-3.5 py-2.5 text-sm text-text hover:bg-ivory transition-colors border-b border-stone last:border-b-0"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {locateError && <p className="text-xs text-red-600">{locateError}</p>}

      <div className="rounded-2xl overflow-hidden border border-stone h-56 sm:h-72">
        <MapContainer center={position} zoom={13} scrollWheelZoom className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ClickHandler onPick={onChange} />
          <RecenterOnChange position={value} />
          {value && <Marker position={value} icon={icon} />}
        </MapContainer>
      </div>
      <p className="text-xs text-text/60">
        {value
          ? `Pinned at ${value[0].toFixed(5)}, ${value[1].toFixed(5)}`
          : "Search above, use your current location, or click on the map to drop a pin"}
      </p>
    </div>
  );
}
