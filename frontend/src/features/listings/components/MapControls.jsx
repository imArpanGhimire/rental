import { useMap } from 'react-leaflet';
import Icon from '../../../components/ui/Icon';

export default function MapControls({ isDrawing, hasPolygon, onToggleDraw, onClear }) {
  const map = useMap();

  return (
    <div className="map-controls">
      <button
        className={`map-controls__btn ${isDrawing ? 'is-active' : ''}`}
        onClick={onToggleDraw}
        aria-label="Draw search area"
        title="Draw search area"
      >
        <Icon name="pencil" size={16} />
      </button>

      {hasPolygon && (
        <button
          className="map-controls__btn"
          onClick={onClear}
          aria-label="Clear search area"
          title="Clear search area"
        >
          <Icon name="close" size={16} />
        </button>
      )}

      <div className="map-controls__zoom">
        <button className="map-controls__btn" onClick={() => map.zoomIn()} aria-label="Zoom in">
          <Icon name="plus" size={16} />
        </button>
        <button className="map-controls__btn" onClick={() => map.zoomOut()} aria-label="Zoom out">
          <Icon name="minus" size={16} />
        </button>
      </div>
    </div>
  );
}
