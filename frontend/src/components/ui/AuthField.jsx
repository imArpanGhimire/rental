import { forwardRef } from "react";

const AuthField = forwardRef(function AuthField(
  { label, error, className = "", id, name, ...props },
  ref,
) {
  const inputId = id || name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="
            text-xs
            font-medium
            !text-white/75
          "
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        name={name}
        className={`
          h-11 w-full
          rounded-[13px]

          border border-white/[0.09]
          bg-white/[0.055]

          px-3.5
          text-[13px]
          text-white

          outline-none

          transition-[border-color,background-color,box-shadow]

          placeholder:text-white/30

          hover:bg-white/[0.07]

          focus:border-white/20
          focus:bg-white/[0.075]
          focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]

          ${className}
        `}
        {...props}
      />

      {error && (
        <span className="text-[10px] leading-4 text-rose-300">{error}</span>
      )}
    </div>
  );
});

export default AuthField;
