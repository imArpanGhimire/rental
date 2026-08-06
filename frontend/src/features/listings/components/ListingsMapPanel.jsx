import { formatAddress } from '../../../utils/formatAddress';
import { useState } from 'react';
import PolygonSearchMap from './PolygonSearchMap';
import ListingCard from './ListingCard';
import Icon from '../../../components/ui/Icon';
import 'leaflet/dist/leaflet.css';

export default function ListingsMapPanel({ listings, selected, onSelect, favorites = [], onToggleFavorite }) {
  const [center] = useState([27.7172, 85.324]);

  return (
    <div className="map-panel">
      <div className="map-panel__map">
        <PolygonSearchMap
          listings={listings}
          center={center}
          selected={selected}
          onSelect={onSelect}
        />
      </div>

      {selected && (
        <div className="map-panel__detail" key={selected._id}>
          <div className="map-panel__detail-header">
            <span className="eyebrow">Most popular</span>
            <button className="share-btn">
              <Icon name="share" size={14} /> Share
            </button>
          </div>

          <div className="map-panel__hero-wrap">
            <img className="map-panel__hero" src={selected.images?.[0]} alt={selected.title} />
          </div>

          <h2 className="map-panel__title">{selected.title}</h2>
          <p className="map-panel__address">
            <Icon name="pin" size={13} /> {formatAddress(selected.location)}
          </p>

          <div className="map-panel__specs">
            <span><Icon name="bed" size={15} />{selected.rooms}</span>
            <span><Icon name="bath" size={15} />{selected.bathrooms ?? 1}</span>
            <span><Icon name="ruler" size={15} />{selected.sizeSqft} m²</span>
          </div>

          <p className="map-panel__desc">{selected.description}</p>
          <p className="map-panel__price">
            Rental price: <strong>€{selected.price} / night</strong>
          </p>

          <div className="map-panel__actions">
            <button className="btn-dark">
              Show contacts <Icon name="arrowRight" size={16} />
            </button>
            <button className="btn-icon" aria-label="More actions">
              <Icon name="dots" size={16} />
            </button>
          </div>

          <div className="map-panel__thumbs">
            {listings.slice(0, 3).map((l) => (
              <ListingCard
                key={l._id}
                listing={l}
                selected={l._id === selected._id}
                onClick={() => onSelect(l)}
                isFavorited={favorites.includes(l._id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
