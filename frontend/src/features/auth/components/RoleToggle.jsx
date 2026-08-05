// Simple segmented control for choosing account type at registration.
// value: 'owner' | 'renter', onChange: (role) => void
export default function RoleToggle({ value, onChange }) {
  const options = [
    { value: "renter", label: "I'm a Renter" },
    { value: "owner", label: "I'm an Owner" },
  ];
  return (
    <div role="radiogroup" aria-label="Account type" className="flex gap-2 mb-5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
            value === opt.value
              ? "bg-ink text-ivory border-ink"
              : "bg-transparent text-ink/70 border-stone hover:border-ink/40"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
