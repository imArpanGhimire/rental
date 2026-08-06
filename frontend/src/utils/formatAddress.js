export function formatAddress(location) {
  if (!location) return 'Location unavailable';
  if (location.address) return location.address;
  const [lng, lat] = location.coordinates || [];
  if (lat == null || lng == null) return 'Location unavailable';
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}
