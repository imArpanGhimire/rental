import { forwardRef } from "react";

const AuthField = forwardRef(function AuthField(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-ink/60 font-medium">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full border border-stone rounded-lg px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brass placeholder:text-ink/30 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default AuthField;
