import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, Heart, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MobileBottomNav({ role }) {
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    { to: "/", icon: Home, label: t("nav.home", "Home") },
    { to: "/", icon: Search, label: t("nav.explore", "Explore") },
    {
      to: role === "owner" ? "/owner/listings" : "/renter/saved",
      icon: Heart,
      label: t("nav.saved", "Saved"),
    },
    { to: "/messages", icon: MessageCircle, label: t("nav.messages", "Messages") },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-ink text-ivory flex items-center justify-around py-2.5 z-40">
      {items.map(({ to, icon: Icon, label }, i) => {
        const active = location.pathname === to;
        return (
          <NavLink
            key={i}
            to={to}
            className="relative flex flex-col items-center gap-1 px-3 py-1"
          >
            {active && (
              <motion.span
                layoutId="bottom-nav-pill"
                className="absolute -top-2.5 w-1 h-1 rounded-full bg-brass"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <Icon size={20} className={active ? "text-brass" : "text-ivory/60"} />
            <span className={`text-[10px] ${active ? "text-brass" : "text-ivory/60"}`}>
              {label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}