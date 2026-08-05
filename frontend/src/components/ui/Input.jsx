import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs uppercase tracking-wide text-text/60">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`border border-stone bg-transparent px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-brass placeholder:text-text/30 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
