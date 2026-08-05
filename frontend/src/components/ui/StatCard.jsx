import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon, onClick }) {
  const Wrapper = onClick ? motion.button : motion.div;
  return (
    <Wrapper
      onClick={onClick}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3 }}
      whileTap={onClick ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={`border border-stone rounded-2xl p-5 flex items-center gap-4 bg-bg text-left w-full ${
        onClick ? "cursor-pointer hover:border-brass" : ""
      }`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-brass-light flex items-center justify-center text-brass shrink-0">
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-2xl font-display font-medium text-text leading-none">{value}</p>
        <p className="text-xs text-text/60 mt-1.5">{label}</p>
      </div>
    </Wrapper>
  );
}