const variants = {
  primary: "bg-brass text-white hover:opacity-90",

  outline:
    "border border-stone text-text hover:bg-brass-light hover:text-brass hover:border-brass",

  ghost: "text-text hover:bg-brass-light hover:text-brass",

  dark: "bg-ink text-ivory hover:opacity-90",
};

export default function Button({
  children,
  variant = "primary",
  pill = false,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-2.5
        text-sm
        font-semibold
        tracking-normal
        transition-[background-color,border-color,color,opacity]
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${pill ? "rounded-full" : "rounded-[14px]"}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
