export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs uppercase tracking-wide bg-brass-light text-text ${className}`}
    >
      {children}
    </span>
  );
}
