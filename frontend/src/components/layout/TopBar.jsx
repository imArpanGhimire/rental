import { Link } from "react-router-dom";
import { Sun, Moon, Globe, Bell } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button.jsx";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ne" : "en");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : null;

  return (
    <header className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-stone">
      <Link to="/" className="font-display text-lg sm:text-xl text-text tracking-tight">
        Rentora
      </Link>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={toggleLang}
          aria-label="Toggle language"
          className="w-9 h-9 rounded-full flex items-center justify-center text-text/60 hover:bg-brass-light hover:text-text transition-colors"
        >
          <Globe size={16} />
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-full flex items-center justify-center text-text/60 hover:bg-brass-light hover:text-text transition-colors"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {user && (
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-text/60 hover:bg-brass-light hover:text-text transition-colors"
          >
            <Bell size={16} />
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-2 pl-1">
            <div className="w-9 h-9 rounded-full bg-ink text-ivory text-xs font-medium flex items-center justify-center shrink-0">
              {initials}
            </div>
            <Button variant="ghost" onClick={logout} className="hidden sm:inline-flex">
              Log out
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button variant="outline" pill>Log in</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
