export default function Logo({ name = 'Rentora', variant = 'dark', className = '' }) {
  const isLight = variant === 'light';
  return (
    <div className={`flex items-center gap-2 ${isLight ? 'text-ivory' : 'text-ink'} ${className}`}>
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <path d="M4 24V12l10-8 10 8v12" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M11 24v-8h6v8" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
      <span className="font-display text-lg font-bold tracking-[-0.015em]">{name}</span>
    </div>
  );
}
