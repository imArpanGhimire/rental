export function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date) {
  if (!date) return "";

  const listedDate = new Date(date);
  const now = new Date();

  // Compare calendar days, not exact 24h windows, so "yesterday" means
  // the previous calendar day regardless of what time it is right now.
  const startOfListed = new Date(
    listedDate.getFullYear(),
    listedDate.getMonth(),
    listedDate.getDate(),
  );
  const startOfNow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const diffDays = Math.round(
    (startOfNow - startOfListed) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}