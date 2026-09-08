import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(function PasswordInput(
  { label, error, className = "", id, name, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const inputId = id || name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold text-[#2b2d31]/58 dark:text-white/55"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          className={`
            h-11 w-full rounded-[13px] border border-black/[0.09]
            bg-white/55 px-3.5 pr-11 text-[13px] text-[#202226]
            outline-none transition-[border-color,background-color,box-shadow]
            placeholder:text-[#2b2d31]/28
            hover:bg-white/70
            focus:border-black/20 focus:bg-white
            focus:shadow-[0_0_0_3px_rgba(20,23,31,0.055)]
            dark:border-white/[0.09] dark:bg-white/[0.035]
            dark:text-white dark:placeholder:text-white/24
            dark:hover:bg-white/[0.05]
            dark:focus:border-white/20 dark:focus:bg-white/[0.055]
            dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]
            ${className}
          `}
          {...props}
        />

        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="
            absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2
            items-center justify-center rounded-lg text-[#2b2d31]/38
            transition-colors hover:bg-black/[0.045] hover:text-[#202226]
            dark:text-white/38 dark:hover:bg-white/[0.06] dark:hover:text-white
          "
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff size={15} strokeWidth={1.8} />
          ) : (
            <Eye size={15} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {error && (
        <span className="text-[10px] leading-4 text-rose-600 dark:text-rose-300">
          {error}
        </span>
      )}
    </div>
  );
});

export default PasswordInput;
