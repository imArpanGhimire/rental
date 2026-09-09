import { Building2, KeyRound } from "lucide-react";

export default function RoleToggle({ value, onChange }) {
  const options = [
    {
      value: "renter",
      label: "Renter",
      helper: "Find and save homes",
      icon: KeyRound,
    },
    {
      value: "owner",
      label: "Owner",
      helper: "List and manage property",
      icon: Building2,
    },
  ];

  return (
    <div className="mb-5">
      <p className="mb-2 text-[11px] font-semibold !text-white/75">
        Account type
      </p>

      <div
        role="radiogroup"
        aria-label="Account type"
        className="grid grid-cols-2 gap-2"
      >
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`
                flex min-w-0 items-center gap-2.5 rounded-[15px] border
                px-3 py-3 text-left transition-colors
                ${
                  selected
                    ? "border-[#202226] bg-[#202226] text-white dark:border-white dark:bg-white dark:text-[#17191d]"
                    : "border-black/[0.08] bg-white/45 text-[#202226] hover:bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.055]"
                }
              `}
            >
              <span
                className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
                  border
                  ${
                    selected
                      ? "border-white/10 bg-white/[0.08] dark:border-black/[0.08] dark:bg-black/[0.045]"
                      : "border-black/[0.06] bg-white/55 text-[#2b2d31]/48 dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-white/45"
                  }
                `}
              >
                <Icon size={14} strokeWidth={1.8} />
              </span>

              <span className="min-w-0">
                <span className="block text-[12px] font-semibold">
                  {option.label}
                </span>

                <span
                  className={`mt-0.5 block truncate text-[9px] font-medium ${
                    selected
                      ? "text-white/55 dark:text-[#17191d]/50"
                      : "text-[#2b2d31]/36 dark:text-white/45"
                  }`}
                >
                  {option.helper}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
