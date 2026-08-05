import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function pinIcon(color, size) {
  const w = size;
  const h = size * (40 / 30);
  const svg = `
    <svg width="${w}" height="${h}" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 4px rgba(20,20,26,0.35));">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="15" cy="15" r="6.5" fill="#ffffff"/>
      <circle cx="15" cy="15" r="3.5" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
  });
}

const currentIcon = pinIcon("#2f8a4e", 36);
const otherIcon = pinIcon("#8a8677", 28);

export default function ListingMap({ coordinates, listings = [], currentId, onSelect, className }) {
  if (!coordinates || coordinates.length !== 2) return null;
  const [lng, lat] = coordinates;
  const position = [lat, lng];

  return (
    <div className={className ?? "rounded-2xl overflow-hidden border border-stone h-56 sm:h-72"}>
      <MapContainer
        key={`${lat}-${lng}`}
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <Marker position={position} icon={currentIcon} zIndexOffset={1000} />

        {listings
          .filter((l) => l._id !== currentId && l.location?.coordinates)
          .map((l) => {
            const [olng, olat] = l.location.coordinates;
            return (
              <Marker
                key={l._id}
                position={[olat, olng]}
                icon={otherIcon}
                eventHandlers={{ click: () => onSelect?.(l._id) }}
              />
            );
          })}
      </MapContainer>
    </div>
  );
}
