import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar({ links = [] }) {
  return (
    <nav className="w-56 shrink-0 py-6 pr-4 flex flex-col gap-1">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end}>
          {({ isActive }) => (
            <motion.div
              whileHover={{ x: 2 }}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-brass-light text-brass font-medium"
                  : "text-text/60 hover:text-text hover:bg-stone/40"
              }`}
            >
              {link.icon && <link.icon size={18} className="shrink-0" />}
              <span>{link.label}</span>
              {link.badge != null && link.badge > 0 && (
                <span className="ml-auto text-[11px] bg-brass text-ivory rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {link.badge}
                </span>
              )}
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}