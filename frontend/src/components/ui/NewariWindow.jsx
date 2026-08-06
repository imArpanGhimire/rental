export default function NewariWindow({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pediment */}
      <path d="M14 40 L100 8 L186 40" stroke="currentColor" strokeWidth="1.25" />
      <path d="M30 40 L100 18 L170 40" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="100" cy="8" r="3" stroke="currentColor" strokeWidth="1" />

      {/* Outer frame (double line) */}
      <rect x="10" y="40" width="180" height="180" stroke="currentColor" strokeWidth="1.25" />
      <rect x="16" y="46" width="168" height="168" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />

      {/* Side pillars */}
      <rect x="0" y="40" width="10" height="180" stroke="currentColor" strokeWidth="1" />
      <rect x="190" y="40" width="10" height="180" stroke="currentColor" strokeWidth="1" />
      <circle cx="5" cy="130" r="2.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="195" cy="130" r="2.5" stroke="currentColor" strokeWidth="1" />

      {/* Lattice (jali) grid */}
      <g stroke="currentColor" strokeWidth="0.75" opacity="0.85">
        <line x1="20" y1="56" x2="20" y2="204" />
        <line x1="52" y1="56" x2="52" y2="204" />
        <line x1="84" y1="56" x2="84" y2="204" />
        <line x1="116" y1="56" x2="116" y2="204" />
        <line x1="148" y1="56" x2="148" y2="204" />
        <line x1="180" y1="56" x2="180" y2="204" />

        <line x1="20" y1="56" x2="180" y2="56" />
        <line x1="20" y1="76" x2="180" y2="76" />
        <line x1="20" y1="96" x2="180" y2="96" />
        <line x1="20" y1="116" x2="180" y2="116" />
        <line x1="20" y1="136" x2="180" y2="136" />
        <line x1="20" y1="156" x2="180" y2="156" />
        <line x1="20" y1="176" x2="180" y2="176" />
        <line x1="20" y1="204" x2="180" y2="204" />
      </g>

      {/* Base ledge */}
      <rect x="4" y="220" width="192" height="8" stroke="currentColor" strokeWidth="1" />
      <line x1="14" y1="228" x2="14" y2="238" stroke="currentColor" strokeWidth="1" />
      <line x1="186" y1="228" x2="186" y2="238" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
