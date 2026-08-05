export function formatPrice(amount, currency = "NPR") {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
