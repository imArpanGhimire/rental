import { useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "../../../utils/formatPrice.js";

const centerIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:var(--brass);border:3px solid var(--ivory);box-shadow:0 0 0 2px var(--brass), 0 2px 6px rgba(0,0,0,.3)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const edgeIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:var(--ivory);border:2px solid var(--brass);box-shadow:0 2px 4px rgba(0,0,0,.3);cursor:ew-resize"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function priceIcon(price) {
  return L.divIcon({
    className: "",
    html: `<div style="background:var(--ink);color:var(--ivory);padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25)">${formatPrice(
      price
    )}</div>`,
    iconSize: null,
    iconAnchor: [30, 14],
  });
}

// Places the edge handle due east of center at the given radius, so dragging
// it directly changes distance-from-center = radius.
function edgePosition(center, radiusKm) {
  const latRad = (center.lat * Math.PI) / 180;
  const kmPerDegLng = 111.32 * Math.cos(latRad);
  const lngOffset = radiusKm / kmPerDegLng;
  return { lat: center.lat, lng: center.lng + lngOffset };
}

function RecenterOnCommit({ center }) {
  const map = useMap();
  const prevCenter = useRef(center);
  if (prevCenter.current.lat !== center.lat || prevCenter.current.lng !== center.lng) {
    map.panTo([center.lat, center.lng], { animate: true });
    prevCenter.current = center;
  }
  return null;
}

export default function RadiusSearchMap({ center, radiusKm, onCommit, results = [] }) {
  const edgePos = useMemo(() => edgePosition(center, radiusKm), [center, radiusKm]);

  const handleCenterDragEnd = useCallback(
    (e) => {
      const { lat, lng } = e.target.getLatLng();
      onCommit({ lat, lng }, radiusKm);
    },
    [onCommit, radiusKm]
  );

  const handleEdgeDragEnd = useCallback(
    (e) => {
      const newEdge = e.target.getLatLng();
      const centerLatLng = L.latLng(center.lat, center.lng);
      const distanceKm = centerLatLng.distanceTo(newEdge) / 1000;
      onCommit(center, Math.max(0.3, Math.round(distanceKm * 10) / 10));
    },
    [onCommit, center]
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-stone h-full min-h-[320px] relative">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <RecenterOnCommit center={center} />

        <Circle
          center={[center.lat, center.lng]}
          radius={radiusKm * 1000}
          pathOptions={{ color: "var(--brass)", weight: 2, fillOpacity: 0.08 }}
        />

        <Marker
          position={[center.lat, center.lng]}
          icon={centerIcon}
          draggable
          eventHandlers={{ dragend: handleCenterDragEnd }}
        />
        <Marker
          position={[edgePos.lat, edgePos.lng]}
          icon={edgeIcon}
          draggable
          eventHandlers={{ dragend: handleEdgeDragEnd }}
        />

        {results
          .filter((l) => l.location?.coordinates?.length === 2)
          .map((l) => (
            <Marker
              key={l._id}
              position={[l.location.coordinates[1], l.location.coordinates[0]]}
              icon={priceIcon(l.price)}
            />
          ))}
      </MapContainer>

      <div className="absolute bottom-3 left-3 bg-bg/95 border border-stone rounded-full px-3 py-1.5 text-xs text-text/70 pointer-events-none">
        {radiusKm.toFixed(1)} km radius
      </div>
    </div>
  );
}