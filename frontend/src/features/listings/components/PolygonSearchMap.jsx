import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/ui/Icon';
import { priceBubbleIcon } from './PriceBubbleMarker';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function DrawLayer({ isDrawing, onPoint, onStrokeEnd }) {
  const draggingRef = useRef(false);
  const map = useMapEvents({
    mousedown(e) {
      if (!isDrawing) return;
      draggingRef.current = true;
      map.dragging.disable();
      onPoint([e.latlng.lng, e.latlng.lat]);
    },
    mousemove(e) {
      if (!isDrawing || !draggingRef.current) return;
      onPoint([e.latlng.lng, e.latlng.lat]);
    },
    mouseup() {
      if (!isDrawing || !draggingRef.current) return;
      draggingRef.current = false;
      map.dragging.enable();
      onStrokeEnd();
    },
  });
  useEffect(() => {
    if (!isDrawing) map.dragging.enable();
  }, [isDrawing, map]);
  return null;
}

function Controls({ isDrawing, hasAnyShape, onToggleDraw, onClear }) {
  const map = useMap();
  return (
    <div className="absolute bottom-4 left-4 z-[500] flex flex-col gap-2">
      <button
        onClick={onToggleDraw}
        className={`flex items-center gap-2 h-9 px-3.5 rounded-full border text-xs font-semibold honey-lift hover:-translate-y-px hover:shadow-md ${
          isDrawing ? 'bg-[#b08b57] text-white border-[#b08b57]' : 'bg-white text-neutral-900 border-neutral-200'
        }`}
      >
        <Icon name={isDrawing ? 'close' : 'pencil'} size={14} />
        {isDrawing ? 'Cancel drawing' : 'Draw search area'}
      </button>
      {hasAnyShape && !isDrawing && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 h-9 px-3.5 rounded-full border border-neutral-200 bg-white text-neutral-900 text-xs font-semibold honey-lift hover:-translate-y-px hover:shadow-md"
        >
          <Icon name="close" size={14} />
          Clear area
        </button>
      )}
      <div className="flex flex-col rounded-lg overflow-hidden shadow-sm border border-neutral-200 mt-1">
        <button onClick={() => map.zoomIn()} className="w-9 h-9 flex items-center justify-center bg-white border-b border-neutral-200 hover:bg-neutral-50">
          <Icon name="plus" size={16} />
        </button>
        <button onClick={() => map.zoomOut()} className="w-9 h-9 flex items-center justify-center bg-white hover:bg-neutral-50">
          <Icon name="minus" size={16} />
        </button>
      </div>
    </div>
  );
}

export default function PolygonSearchMap({ center, shape, onShapeChange, results = [], isSearching }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPoints, setDraftPoints] = useState([]);
  const [pendingPoints, setPendingPoints] = useState(null);

  const startDrawing = () => {
    onShapeChange(null);
    setPendingPoints(null);
    setDraftPoints([]);
    setIsDrawing(true);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setDraftPoints([]);
  };

  const handleStrokeEnd = () => {
    setIsDrawing(false);
    setDraftPoints((prev) => {
      if (prev.length >= 3) setPendingPoints(prev);
      return prev;
    });
  };

  const confirmSearch = () => {
    if (!pendingPoints || pendingPoints.length < 3) return;
    const ring = [...pendingPoints, pendingPoints[0]];
    onShapeChange(ring);
    setPendingPoints(null);
    setDraftPoints([]);
  };

  const clearShape = () => {
    setIsDrawing(false);
    setDraftPoints([]);
    setPendingPoints(null);
    onShapeChange(null);
  };

  const handleToggleDraw = () => (isDrawing ? cancelDrawing() : startDrawing());

  const activePoints = shape || pendingPoints || draftPoints;
  const leafletPositions = activePoints.map(([lng, lat]) => [lat, lng]);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-neutral-200">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DrawLayer
          isDrawing={isDrawing}
          onPoint={(pt) => setDraftPoints((prev) => [...prev, pt])}
          onStrokeEnd={handleStrokeEnd}
        />

        {leafletPositions.length > 1 && (
          <Polygon
            positions={leafletPositions}
            pathOptions={{
              color: '#b08b57',
              weight: 3,
              fillColor: '#b08b57',
              fillOpacity: shape ? 0.18 : 0.12,
              dashArray: shape ? null : '6 4',
            }}
          />
        )}

        {results.map((l) => {
          const [lng, lat] = l.location?.coordinates || [];
          if (lat == null || lng == null) return null;
          return (
            <Marker key={l._id} position={[lat, lng]} icon={priceBubbleIcon(l.price)}>
              <Popup>
                <div style={{ fontSize: 13 }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{l.title}</p>
                  <Link to={`/listings/${l._id}`} style={{ color: '#b08b57', fontWeight: 600 }}>
                    View details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <Controls
          isDrawing={isDrawing}
          hasAnyShape={!!shape || !!pendingPoints}
          onToggleDraw={handleToggleDraw}
          onClear={clearShape}
        />
      </MapContainer>

      {isDrawing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-[#14141a] text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none animate-[hint-drop_280ms_var(--ease-honey-soft)_both]">
          Click and drag to trace the area you want to search
        </div>
      )}

      {!isDrawing && !pendingPoints && !shape && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-white/95 text-neutral-700 text-xs font-medium px-4 py-2 rounded-full shadow-md pointer-events-none animate-[hint-drop_280ms_var(--ease-honey-soft)_both]">
          Tip: use "Draw search area" to lasso any neighborhood
        </div>
      )}

      {pendingPoints && !shape && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] animate-[pop-in_360ms_var(--ease-honey-soft)_both] flex flex-col items-center gap-2">
          <span className="bg-white/95 text-neutral-700 text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm">
            Area selected — ready to search
          </span>
          <button
            onClick={confirmSearch}
            className="flex items-center gap-2 bg-[#14141a] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg honey-lift hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Icon name="search" size={15} />
            Search inside this area
          </button>
        </div>
      )}

      {shape && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-white text-neutral-900 text-xs font-semibold px-4 py-2 rounded-full shadow-md animate-[hint-drop_280ms_var(--ease-honey-soft)_both]">
          {isSearching ? 'Searching this area…' : `${results.length} ${results.length === 1 ? 'listing' : 'listings'} found here`}
        </div>
      )}
    </div>
  );
}
