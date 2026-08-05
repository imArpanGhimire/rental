const paths = {
  bed: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7 M3 18h18 M3 11V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4",
  bath: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z M6 12V5a2 2 0 0 1 3.2-1.6 M8 5v1",
  ruler: "M3 8h18v5H3z M7 8v2 M11 8v3 M15 8v2 M19 8v3",
  heart: "M12 21s-7.5-4.6-10-9.3C.4 8.4 2 4.5 6 4c2.2-.3 4 .9 6 3 2-2.1 3.8-3.3 6-3 4 .5 5.6 4.4 4 7.7C19.5 16.4 12 21 12 21z",
  heartFill: "M12 21s-7.5-4.6-10-9.3C.4 8.4 2 4.5 6 4c2.2-.3 4 .9 6 3 2-2.1 3.8-3.3 6-3 4 .5 5.6 4.4 4 7.7C19.5 16.4 12 21 12 21z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3",
  close: "M18 6 6 18 M6 6l12 12",
  share: "M15 8a3 3 0 1 0-2.8-4.2 M15 8a3 3 0 0 0 2.8 4.2 M9 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0z M6.6 13.5l8.5 4.7 M6.6 10.5l8.5-4.7 M17.8 16a3 3 0 1 0 0 4.2A3 3 0 0 0 17.8 16z",
  pin: "M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0",
  dots: "M5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  chevronDown: "M6 9l6 6 6-6",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  pencil: "M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
  arrowRight: "M5 12h14 M13 6l6 6-6 6",
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, filled = false, className = "" }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon--${name} ${className}`}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
