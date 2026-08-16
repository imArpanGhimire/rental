import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";

const neighborhoods = ["Baneshwor", "Patan", "Boudha", "Jhamsikhel", "Kalanki"];

const support = [
  { label: "Help center", to: "/help" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
];

export default function Footer() {
  const { isAuthenticated, role } = useAuth();

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
        {/* BRAND */}
        <div className="footer__brand">
          <div className="footer__logo">Rentora</div>

          <p className="footer__tagline">
            Rental search for the Kathmandu valley, built around the map — find
            a place, not just a listing.
          </p>
        </div>

        <div className="footer__cols">
          {/* =================================================
              FIND RENT IN
              THESE ARE PLAIN TEXT — NOT LINKS
          ================================================= */}
          <div>
            <div className="footer__col-title">Find rent in</div>

            <div className="footer__col-list">
              {neighborhoods.map((area) => (
                <p key={area} className="footer__location">
                  {area}
                </p>
              ))}
            </div>
          </div>

          {/* =================================================
              COMPANY
              THESE ARE ACTUAL LINKS
          ================================================= */}
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

          {/* =================================================
              SUPPORT
              THESE ARE ACTUAL LINKS
          ================================================= */}
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

      {/* =====================================================
          BOTTOM
      ===================================================== */}
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Rentora. Built in Kathmandu.</span>

        <a
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
