const TYPE_STYLES = {
  hostel: "bg-brass-light text-brass",
  rental: "bg-brick-light text-brick",
  flat: "bg-ivory text-ink/70",
};

export default function Badge({ children, type, className = "" }) {
  const typeClass = type
    ? (TYPE_STYLES[type] ?? TYPE_STYLES.flat)
    : "bg-brass-light text-brass";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${typeClass} ${className}`}
    >
      {children}
    </span>
  );
}
