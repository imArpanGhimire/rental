import { Link } from "react-router-dom";
import { Sun, Moon, Globe } from "lucide-react";
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

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-stone">
      <Link to="/" className="font-display text-xl text-text">
        Rentora
      </Link>

      <div className="flex items-center gap-3">
        <button onClick={toggleLang} aria-label="Toggle language">
          <Globe size={18} className="text-text/70" />
        </button>
        <button onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? (
            <Moon size={18} className="text-text/70" />
          ) : (
            <Sun size={18} className="text-text/70" />
          )}
        </button>

        {user ? (
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="outline">Log in</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
