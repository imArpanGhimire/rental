import { motion } from "framer-motion";

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
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
      disabled={disabled}
      className={`px-5 py-3 text-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        pill ? "rounded-full" : "rounded-xl"
      } ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
