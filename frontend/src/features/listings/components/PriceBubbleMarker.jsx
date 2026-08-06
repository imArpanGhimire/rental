// frontend/src/features/listings/components/PriceBubbleMarker.jsx
import L from 'leaflet';

export function priceBubbleIcon(price) {
  const formatted = Number(price).toLocaleString('en-IN');
  const html = `
    <div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;gap:6px;">
      <span style="background:#fff;color:#171717;font-size:12px;font-weight:600;padding:7px 13px;border-radius:999px;box-shadow:0 6px 16px rgba(20,20,26,0.22);white-space:nowrap;">
        Rs ${formatted} / month
      </span>
      <div style="width:8px;height:8px;background:#171717;border-radius:50%;"></div>
    </div>
  `;
  return L.divIcon({ className: 'price-bubble-wrapper', html, iconSize: [0, 0] });
}
