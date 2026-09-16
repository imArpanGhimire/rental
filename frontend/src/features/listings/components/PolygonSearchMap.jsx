import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../../../components/ui/Icon";
import { priceBubbleIcon } from "./PriceBubbleMarker";

import "leaflet/dist/leaflet.css";

/* =========================================================
   DRAW LAYER

   Uses native Pointer Events on the Leaflet container.

   This gives us one drawing implementation for:
   - mouse
   - touch
   - stylus

   While drawing:
   - Leaflet dragging is disabled
   - touch zoom is disabled
   - double-click zoom is disabled
   - page scrolling is blocked while tracing
========================================================= */

function DrawLayer({ isDrawing, onPoint, onStrokeEnd }) {
  const map = useMap();

  const drawingRef = useRef(false);
  const activePointerRef = useRef(null);
  const lastPointRef = useRef(null);

  const onPointRef = useRef(onPoint);
  const onStrokeEndRef = useRef(onStrokeEnd);

  useEffect(() => {
    onPointRef.current = onPoint;
  }, [onPoint]);

  useEffect(() => {
    onStrokeEndRef.current = onStrokeEnd;
  }, [onStrokeEnd]);

  const addPointFromPointer = useCallback(
    (event) => {
      const container = map.getContainer();

      const rect = container.getBoundingClientRect();

      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      /*
       * Don't add hundreds of almost-identical points.
       * A small spacing also produces a cleaner polygon.
       */
      const lastPoint = lastPointRef.current;

      if (lastPoint) {
        const dx = point.x - lastPoint.x;
        const dy = point.y - lastPoint.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 4) {
          return;
        }
      }

      lastPointRef.current = point;

      const latLng = map.containerPointToLatLng([point.x, point.y]);

      onPointRef.current([latLng.lng, latLng.lat]);
    },
    [map],
  );

  useEffect(() => {
    const container = map.getContainer();

    if (!container) {
      return undefined;
    }

    function disableMapGestures() {
      map.dragging.disable();

      if (map.touchZoom) {
        map.touchZoom.disable();
      }

      if (map.doubleClickZoom) {
        map.doubleClickZoom.disable();
      }

      if (map.boxZoom) {
        map.boxZoom.disable();
      }

      if (map.keyboard) {
        map.keyboard.disable();
      }
    }

    function restoreMapGestures() {
      map.dragging.enable();

      if (map.touchZoom) {
        map.touchZoom.enable();
      }

      if (map.doubleClickZoom) {
        map.doubleClickZoom.enable();
      }

      if (map.boxZoom) {
        map.boxZoom.enable();
      }

      if (map.keyboard) {
        map.keyboard.enable();
      }
    }

    function handlePointerDown(event) {
      if (!isDrawing) {
        return;
      }

      /*
       * Ignore secondary mouse buttons.
       */
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      drawingRef.current = true;
      activePointerRef.current = event.pointerId;
      lastPointRef.current = null;

      disableMapGestures();

      /*
       * Capture the pointer so drawing continues even if the
       * finger/mouse briefly moves outside the map container.
       */
      try {
        container.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture may not be available in older browsers.
      }

      addPointFromPointer(event);
    }

    function handlePointerMove(event) {
      if (
        !isDrawing ||
        !drawingRef.current ||
        activePointerRef.current !== event.pointerId
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      addPointFromPointer(event);
    }

    function finishStroke(event) {
      if (!drawingRef.current || activePointerRef.current !== event.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      /*
       * Capture the final finger/mouse position as well.
       */
      addPointFromPointer(event);

      drawingRef.current = false;
      activePointerRef.current = null;
      lastPointRef.current = null;

      try {
        if (container.hasPointerCapture(event.pointerId)) {
          container.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Safe fallback for browsers without pointer capture.
      }

      restoreMapGestures();

      onStrokeEndRef.current();
    }

    function cancelStroke(event) {
      if (!drawingRef.current || activePointerRef.current !== event.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      drawingRef.current = false;
      activePointerRef.current = null;
      lastPointRef.current = null;

      try {
        if (container.hasPointerCapture(event.pointerId)) {
          container.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore unsupported pointer-capture behavior.
      }

      restoreMapGestures();

      onStrokeEndRef.current();
    }

    if (isDrawing) {
      /*
       * Critical on mobile:
       * tell the browser this surface belongs to the drawing
       * interaction instead of page scrolling / pinch gestures.
       */
      container.style.touchAction = "none";
      container.style.cursor = "crosshair";

      disableMapGestures();
    } else {
      container.style.touchAction = "";
      container.style.cursor = "";

      drawingRef.current = false;
      activePointerRef.current = null;
      lastPointRef.current = null;

      restoreMapGestures();
    }

    container.addEventListener("pointerdown", handlePointerDown, {
      passive: false,
    });

    container.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });

    container.addEventListener("pointerup", finishStroke, {
      passive: false,
    });

    container.addEventListener("pointercancel", cancelStroke, {
      passive: false,
    });

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", finishStroke);
      container.removeEventListener("pointercancel", cancelStroke);

      container.style.touchAction = "";
      container.style.cursor = "";

      drawingRef.current = false;
      activePointerRef.current = null;
      lastPointRef.current = null;

      restoreMapGestures();
    };
  }, [isDrawing, map, addPointFromPointer]);

  return null;
}

/* =========================================================
   MAP CONTROLS
========================================================= */

function Controls({ isDrawing, hasAnyShape, onToggleDraw, onClear }) {
  const map = useMap();

  return (
    <div
      className="
        absolute
        bottom-3
        left-3
        z-[500]
        flex
        max-w-[calc(100%-24px)]
        flex-col
        gap-2

        sm:bottom-4
        sm:left-4
      "
    >
      <button
        type="button"
        onClick={onToggleDraw}
        className={`
          flex
          h-9
          w-fit
          max-w-full
          items-center
          gap-2
          rounded-full
          border
          px-3.5
          text-xs
          font-semibold
          shadow-sm
          transition-colors

          ${
            isDrawing
              ? "border-[#b08b57] bg-[#b08b57] text-white"
              : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
          }
        `}
      >
        <Icon name={isDrawing ? "close" : "pencil"} size={14} />

        <span className="whitespace-nowrap">
          {isDrawing ? "Cancel drawing" : "Draw search area"}
        </span>
      </button>

      {hasAnyShape && !isDrawing && (
        <button
          type="button"
          onClick={onClear}
          className="
            flex
            h-9
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-neutral-200
            bg-white
            px-3.5
            text-xs
            font-semibold
            text-neutral-900
            shadow-sm
            transition-colors
            hover:bg-neutral-50
          "
        >
          <Icon name="close" size={14} />
          Clear area
        </button>
      )}

      <div
        className="
          mt-1
          flex
          w-9
          flex-col
          overflow-hidden
          rounded-lg
          border
          border-neutral-200
          shadow-sm
        "
      >
        <button
          type="button"
          onClick={() => map.zoomIn()}
          aria-label="Zoom in"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            border-b
            border-neutral-200
            bg-white
            hover:bg-neutral-50
          "
        >
          <Icon name="plus" size={16} />
        </button>

        <button
          type="button"
          onClick={() => map.zoomOut()}
          aria-label="Zoom out"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            bg-white
            hover:bg-neutral-50
          "
        >
          <Icon name="minus" size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   POLYGON SEARCH MAP
========================================================= */

export default function PolygonSearchMap({
  center,
  shape,
  onShapeChange,
  results = [],
  isSearching,
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const [draftPoints, setDraftPoints] = useState([]);

  const [pendingPoints, setPendingPoints] = useState(null);

  /* =======================================================
     DRAWING
  ======================================================= */

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

    setDraftPoints((previous) => {
      if (previous.length >= 3) {
        setPendingPoints(previous);
      }

      return previous;
    });
  };

  /* =======================================================
     CONFIRM
  ======================================================= */

  const confirmSearch = () => {
    if (!pendingPoints || pendingPoints.length < 3) {
      return;
    }

    const ring = [...pendingPoints, pendingPoints[0]];

    onShapeChange(ring);

    setPendingPoints(null);
    setDraftPoints([]);
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearShape = () => {
    setIsDrawing(false);

    setDraftPoints([]);
    setPendingPoints(null);

    onShapeChange(null);
  };

  const handleToggleDraw = () => {
    if (isDrawing) {
      cancelDrawing();
      return;
    }

    startDrawing();
  };

  /* =======================================================
     POLYGON
  ======================================================= */

  const activePoints = shape || pendingPoints || draftPoints;

  const leafletPositions = activePoints.map(([lng, lat]) => [lat, lng]);

  return (
    <div
      className="
        relative
        h-full
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-neutral-200
      "
    >
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* DRAW INTERACTION */}

        <DrawLayer
          isDrawing={isDrawing}
          onPoint={(point) => {
            setDraftPoints((previous) => [...previous, point]);
          }}
          onStrokeEnd={handleStrokeEnd}
        />

        {/* SEARCH POLYGON */}

        {leafletPositions.length > 1 && (
          <Polygon
            positions={leafletPositions}
            interactive={false}
            pathOptions={{
              color: "#b08b57",
              weight: 3,
              fillColor: "#b08b57",
              fillOpacity: shape ? 0.18 : 0.12,
              dashArray: shape ? null : "6 4",
            }}
          />
        )}

        {/* PROPERTY MARKERS */}

        {results.map((listing) => {
          const [lng, lat] = listing.location?.coordinates || [];

          if (lat == null || lng == null) {
            return null;
          }

          return (
            <Marker
              key={listing._id}
              position={[lat, lng]}
              icon={priceBubbleIcon(listing.price)}
            >
              <Popup>
                <div style={{ fontSize: 13 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {listing.title}
                  </p>

                  <Link
                    to={`/listings/${listing._id}`}
                    style={{
                      color: "#b08b57",
                      fontWeight: 600,
                    }}
                  >
                    View details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* MAP CONTROLS */}

        <Controls
          isDrawing={isDrawing}
          hasAnyShape={Boolean(shape) || Boolean(pendingPoints)}
          onToggleDraw={handleToggleDraw}
          onClear={clearShape}
        />
      </MapContainer>

      {/* =====================================================
          DRAWING INSTRUCTION
      ===================================================== */}

      {isDrawing && (
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-3
            z-[500]
            w-max
            max-w-[calc(100%-24px)]
            -translate-x-1/2
            rounded-full
            bg-[#14141a]
            px-3.5
            py-2
            text-center
            text-[11px]
            font-medium
            leading-4
            text-white
            shadow-lg

            sm:top-4
            sm:px-4
            sm:text-xs
          "
        >
          <span className="sm:hidden">
            Drag your finger to trace the search area
          </span>

          <span className="hidden sm:inline">
            Click and drag to trace the area you want to search
          </span>
        </div>
      )}

      {/* =====================================================
          DEFAULT TIP
      ===================================================== */}

      {!isDrawing && !pendingPoints && !shape && (
        <div
          className="
              pointer-events-none
              absolute
              left-1/2
              top-3
              z-[500]
              w-max
              max-w-[calc(100%-24px)]
              -translate-x-1/2
              rounded-full
              bg-white/95
              px-3.5
              py-2
              text-center
              text-[11px]
              font-medium
              leading-4
              text-neutral-700
              shadow-md

              sm:top-4
              sm:px-4
              sm:text-xs
            "
        >
          Draw an area to search this neighborhood
        </div>
      )}

      {/* =====================================================
          CONFIRM DRAWING
      ===================================================== */}

      {pendingPoints && !shape && (
        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-[600]
            flex
            w-[calc(100%-24px)]
            -translate-x-1/2
            flex-col
            items-center
            gap-2

            sm:bottom-4
            sm:w-auto
          "
        >
          <span
            className="
              rounded-full
              bg-white/95
              px-3.5
              py-1.5
              text-center
              text-[11px]
              font-medium
              text-neutral-700
              shadow-sm

              sm:text-xs
            "
          >
            Area selected — ready to search
          </span>

          <button
            type="button"
            onClick={confirmSearch}
            className="
              flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#14141a]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-opacity
              hover:opacity-90

              sm:w-auto
            "
          >
            <Icon name="search" size={15} />
            Search inside this area
          </button>
        </div>
      )}

      {/* =====================================================
          ACTIVE SEARCH
      ===================================================== */}

      {shape && (
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-3
            z-[500]
            w-max
            max-w-[calc(100%-24px)]
            -translate-x-1/2
            rounded-full
            bg-white
            px-3.5
            py-2
            text-center
            text-[11px]
            font-semibold
            leading-4
            text-neutral-900
            shadow-md

            sm:top-4
            sm:px-4
            sm:text-xs
          "
        >
          {isSearching
            ? "Searching this area…"
            : `${results.length} ${
                results.length === 1 ? "listing" : "listings"
              } found here`}
        </div>
      )}
    </div>
  );
}
