import { formatAddress } from '../../../utils/formatAddress';
import Icon from '../../../components/ui/Icon';

export default function ListingCard({ listing, selected, onClick, onToggleFavorite, isFavorited }) {
  return (
    <button className={`listing-card ${selected ? 'is-selected' : ''}`} onClick={onClick}>
      <div className="listing-card__image">
        <img src={listing.images?.[0]} alt={listing.title} loading="lazy" />
        <span
          className={`listing-card__heart ${isFavorited ? 'is-active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(listing._id); }}
        >
          <Icon name="heart" filled={isFavorited} size={16} />
        </span>
      </div>
      <div className="listing-card__body">
        <div className="listing-card__price-row">
          <span className="listing-card__price">
            €{listing.price}<span> / night</span>
          </span>
        </div>
        <p className="listing-card__address">
          <Icon name="pin" size={12} className="listing-card__pin" />
          {formatAddress(listing.location)}
        </p>
        <div className="listing-card__specs">
          <span><Icon name="bed" size={14} />{listing.rooms}</span>
          <span><Icon name="bath" size={14} />{listing.bathrooms ?? 1}</span>
          <span><Icon name="ruler" size={14} />{listing.sizeSqft} m²</span>
        </div>
      </div>
    </button>
  );
}
