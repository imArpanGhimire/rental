import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

import { useAuth } from "../features/auth/AuthContext.jsx";

// Neighborhoods link to your properties page filtered by area.
// Adjust the query param name if your search page uses something else.
const neighborhoods = ["Baneshwor", "Patan", "Boudha", "Jhamsikhel", "Kalanki"];

const support = [
  { label: "Help center", to: "/help" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
];

export default function Footer() {
  const { isAuthenticated, role } = useAuth();

  // Owner already logged in -> straight to the create-listing form.
  // Everyone else (logged out, or logged in as a renter) -> register/upgrade.
  const listPropertyTo =
    isAuthenticated && role === "owner" ? "/owner/listings/new" : "/register";

  const company = [
    { label: "About", to: "/about" },
    { label: "How it works", to: "/how-it-works" },
    { label: "List your property", to: listPropertyTo },
  ];

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">Rentora</div>
          <p className="footer__tagline">
            Rental search for the Kathmandu valley, built around the map —
            find a place, not just a listing.
          </p>
        </div>

        <div className="footer__cols">
          <div>
            <div className="footer__col-title">Explore</div>
            <div className="footer__col-list">
              {neighborhoods.map((area) => (
                <Link
                  key={area}
                  to={`/properties?location=${area}`}
                  className="footer__link"
                >
                  <MapPin size={12} className="footer__pin" />
                  {area}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Company</div>
            <div className="footer__col-list">
              {company.map((item) => (
                <Link key={item.label} to={item.to} className="footer__link">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Support</div>
            <div className="footer__col-list">
              {support.map((item) => (
                <Link key={item.label} to={item.to} className="footer__link">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Rentora. Built in Kathmandu.</span>
        
          href="https://github.com/imArpanGhimire/rental"
          target="_blank"
          rel="noreferrer"
        >
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}