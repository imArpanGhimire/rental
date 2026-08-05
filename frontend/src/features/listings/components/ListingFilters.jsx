// frontend/src/features/listings/components/ListingFilters.jsx
import { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/ui/Icon';
import { LISTING_TYPES, NEPAL_AREAS } from '../constants';

export default function ListingFilters({ filters, onChange }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [priceDraft, setPriceDraft] = useState({
    min: filters.minPrice ?? '',
    max: filters.maxPrice ?? '',
  });
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu) => setOpenMenu((prev) => (prev === menu ? null : menu));

  const applyPrice = () => {
    onChange({
      ...filters,
      minPrice: priceDraft.min !== '' ? Number(priceDraft.min) : null,
      maxPrice: priceDraft.max !== '' ? Number(priceDraft.max) : null,
    });
    setOpenMenu(null);
  };

  const regionSuggestions = (
    filters.search
      ? NEPAL_AREAS.filter((a) => a.toLowerCase().includes(filters.search.toLowerCase()))
      : NEPAL_AREAS
  ).slice(0, 6);

  return (
    <div className="filter-bar" ref={wrapRef}>
      <div style={{ position: 'relative' }}>
        <Pill
          label={`Type: ${filters.type ? LISTING_TYPES.find((t) => t.value === filters.type)?.label : 'Any'}`}
          dark
          onClick={() => toggleMenu('type')}
          onClear={filters.type ? () => onChange({ ...filters, type: null }) : null}
        />
        {openMenu === 'type' && (
          <div className="filter-dropdown">
            <div
              className={`filter-dropdown__option ${!filters.type ? 'is-selected' : ''}`}
              onClick={() => { onChange({ ...filters, type: null }); setOpenMenu(null); }}
            >
              Any
            </div>
            {LISTING_TYPES.map((t) => (
              <div
                key={t.value}
                className={`filter-dropdown__option ${filters.type === t.value ? 'is-selected' : ''}`}
                onClick={() => { onChange({ ...filters, type: t.value }); setOpenMenu(null); }}
              >
                {t.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <Pill
          label={`Price: Rs ${filters.minPrice ?? '—'}–${filters.maxPrice ?? '—'}`}
          dark
          onClick={() => toggleMenu('price')}
          onClear={(filters.minPrice || filters.maxPrice) ? () => onChange({ ...filters, minPrice: null, maxPrice: null }) : null}
        />
        {openMenu === 'price' && (
          <div className="filter-dropdown">
            <div className="filter-dropdown__row">
              <input
                type="number"
                placeholder="Min"
                value={priceDraft.min}
                onChange={(e) => setPriceDraft((p) => ({ ...p, min: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceDraft.max}
                onChange={(e) => setPriceDraft((p) => ({ ...p, max: e.target.value }))}
              />
            </div>
            <button className="filter-dropdown__apply" onClick={applyPrice}>
              Apply
            </button>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <Pill label="Area" onClick={() => toggleMenu('area')} />
        {openMenu === 'area' && (
          <div className="filter-dropdown">
            {NEPAL_AREAS.slice(0, 8).map((area) => (
              <div
                key={area}
                className={`filter-dropdown__option ${filters.search === area ? 'is-selected' : ''}`}
                onClick={() => { onChange({ ...filters, search: area }); setOpenMenu(null); }}
              >
                {area}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <Pill label="Floor" onClick={() => toggleMenu('floor')} />
        {openMenu === 'floor' && (
          <div className="filter-dropdown">
            <div className="filter-dropdown__disabled">
              Not available yet — the backend doesn't store floor data for listings.
            </div>
          </div>
        )}
      </div>

      <button className="filter-bar__more" aria-label="More filters">
        <Icon name="dots" size={16} />
      </button>

      <div style={{ position: 'relative' }}>
        <div className="filter-bar__search filter-bar__search--highlight">
          <Icon name="search" size={15} className="filter-bar__search-icon" />
          <div className="filter-bar__search-text">
            <span className="filter-bar__search-label">Region</span>
            <input
              value={filters.search || ''}
              onFocus={() => setOpenMenu('region')}
              onChange={(e) => { onChange({ ...filters, search: e.target.value }); setOpenMenu('region'); }}
              placeholder="Search location in Nepal"
            />
          </div>
          {filters.search && (
            <button
              className="filter-bar__search-clear"
              onClick={() => { onChange({ ...filters, search: '' }); setOpenMenu(null); }}
              aria-label="Clear search"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
        {openMenu === 'region' && regionSuggestions.length > 0 && (
          <div className="filter-dropdown filter-dropdown--wide">
            {regionSuggestions.map((area) => (
              <div
                key={area}
                className="filter-dropdown__option"
                onClick={() => { onChange({ ...filters, search: area }); setOpenMenu(null); }}
              >
                <Icon name="pin" size={13} className="text-neutral-400" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ label, dark, onClick, onClear }) {
  return (
    <button type="button" className={`pill ${dark ? 'pill--dark' : 'pill--light'}`} onClick={onClick}>
      <span>{label}</span>
      {onClear ? (
        <span className="pill__clear" onClick={(e) => { e.stopPropagation(); onClear(); }}>
          <Icon name="close" size={12} />
        </span>
      ) : (
        <Icon name="chevronDown" size={14} className="pill__chevron" />
      )}
    </button>
  );
}
