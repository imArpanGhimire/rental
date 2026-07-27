import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar({ links = [] }) {
  const location = useLocation();

  return (
    <nav className="w-48 border-r border-stone py-6">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className="relative block px-4 py-2 text-sm"
          >
            {isActive && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-y-0 left-0 w-0.5 bg-brass"
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            )}
            <span className={isActive ? "text-brass" : "text-text/70"}>
              {link.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}