import { useState, useRef, useEffect } from "react";
import Icon from "../../../components/ui/Icon";
import { LISTING_TYPES, NEPAL_AREAS } from "../constants";

export default function ListingFilters({ filters, onChange }) {
  const [openMenu, setOpenMenu] = useState(null);

  const [priceDraft, setPriceDraft] = useState({
    min: filters.minPrice ?? "",
    max: filters.maxPrice ?? "",
  });

  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Keep the price inputs synchronized with the
   * currently applied filters.
   */
  useEffect(() => {
    setPriceDraft({
      min: filters.minPrice ?? "",
      max: filters.maxPrice ?? "",
    });
  }, [filters.minPrice, filters.maxPrice]);

  const toggleMenu = (menu) => {
    setOpenMenu((previous) => (previous === menu ? null : menu));
  };

  const applyPrice = () => {
    const min = priceDraft.min !== "" ? Number(priceDraft.min) : null;

    const max = priceDraft.max !== "" ? Number(priceDraft.max) : null;

    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });

    setOpenMenu(null);
  };

  const regionSuggestions = (
    filters.search
      ? NEPAL_AREAS.filter((area) =>
          area.toLowerCase().includes(filters.search.toLowerCase()),
        )
      : NEPAL_AREAS
  ).slice(0, 6);

  return (
    <div className="filter-bar" ref={wrapRef}>
      {/* =====================================================
          TYPE
      ===================================================== */}

      <div style={{ position: "relative" }}>
        <Pill
          label={`Type: ${
            filters.type
              ? LISTING_TYPES.find((type) => type.value === filters.type)?.label
              : "Any"
          }`}
          dark
          onClick={() => toggleMenu("type")}
          onClear={
            filters.type
              ? () =>
                  onChange({
                    ...filters,
                    type: null,
                  })
              : null
          }
        />

        {openMenu === "type" && (
          <div className="filter-dropdown">
            <button
              type="button"
              className={`filter-dropdown__option w-full ${
                !filters.type ? "is-selected" : ""
              }`}
              onClick={() => {
                onChange({
                  ...filters,
                  type: null,
                });

                setOpenMenu(null);
              }}
            >
              Any
            </button>

            {LISTING_TYPES.map((type) => (
              <button
                type="button"
                key={type.value}
                className={`filter-dropdown__option w-full ${
                  filters.type === type.value ? "is-selected" : ""
                }`}
                onClick={() => {
                  onChange({
                    ...filters,
                    type: type.value,
                  });

                  setOpenMenu(null);
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div style={{ position: "relative" }}>
        <Pill
          label={`Price: Rs ${
            filters.minPrice ?? "—"
          }–${filters.maxPrice ?? "—"}`}
          dark
          onClick={() => toggleMenu("price")}
          onClear={
            filters.minPrice || filters.maxPrice
              ? () =>
                  onChange({
                    ...filters,
                    minPrice: null,
                    maxPrice: null,
                  })
              : null
          }
        />

        {openMenu === "price" && (
          <div className="filter-dropdown">
            <div className="filter-dropdown__row">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={priceDraft.min}
                onChange={(e) =>
                  setPriceDraft((previous) => ({
                    ...previous,
                    min: e.target.value,
                  }))
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Max"
                value={priceDraft.max}
                onChange={(e) =>
                  setPriceDraft((previous) => ({
                    ...previous,
                    max: e.target.value,
                  }))
                }
              />
            </div>

            <button
              type="button"
              className="filter-dropdown__apply"
              onClick={applyPrice}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          AREA
      ===================================================== */}

      <div style={{ position: "relative" }}>
        <Pill label="Area" onClick={() => toggleMenu("area")} />

        {openMenu === "area" && (
          <div className="filter-dropdown">
            {NEPAL_AREAS.slice(0, 8).map((area) => (
              <button
                type="button"
                key={area}
                className={`filter-dropdown__option w-full ${
                  filters.search === area ? "is-selected" : ""
                }`}
                onClick={() => {
                  onChange({
                    ...filters,
                    search: area,
                  });

                  setOpenMenu(null);
                }}
              >
                {area}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          SEARCH

          Search is intentionally separated from the filters.
          Desktop: pushed to the right.
          Mobile: full width underneath the filters.
      ===================================================== */}

      <div
        className="ml-auto max-md:ml-0 max-md:w-full"
        style={{
          position: "relative",
        }}
      >
        <div
          className="filter-bar__search filter-bar__search--highlight max-md:w-full"
          style={{
            minWidth: 0,
          }}
        >
          <Icon name="search" size={15} className="filter-bar__search-icon" />

          <div className="filter-bar__search-text">
            <span className="filter-bar__search-label">Region</span>

            <input
              value={filters.search || ""}
              onFocus={() => setOpenMenu("region")}
              onChange={(e) => {
                onChange({
                  ...filters,
                  search: e.target.value,
                });

                setOpenMenu("region");
              }}
              placeholder="Search location in Nepal"
            />
          </div>

          {filters.search && (
            <button
              type="button"
              className="filter-bar__search-clear"
              onClick={() => {
                onChange({
                  ...filters,
                  search: "",
                });

                setOpenMenu(null);
              }}
              aria-label="Clear search"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>

        {/* REGION SUGGESTIONS */}

        {openMenu === "region" && regionSuggestions.length > 0 && (
          <div className="filter-dropdown filter-dropdown--wide max-md:w-full">
            {regionSuggestions.map((area) => (
              <button
                type="button"
                key={area}
                className="filter-dropdown__option w-full"
                onClick={() => {
                  onChange({
                    ...filters,
                    search: area,
                  });

                  setOpenMenu(null);
                }}
              >
                <Icon name="pin" size={13} className="text-neutral-400" />

                <span>{area}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   FILTER PILL
========================================================= */

function Pill({ label, dark, onClick, onClear }) {
  return (
    <button
      type="button"
      className={`pill ${dark ? "pill--dark" : "pill--light"}`}
      onClick={onClick}
    >
      <span>{label}</span>

      {onClear ? (
        <span
          className="pill__clear"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <Icon name="close" size={12} />
        </span>
      ) : (
        <Icon name="chevronDown" size={14} className="pill__chevron" />
      )}
    </button>
  );
}
