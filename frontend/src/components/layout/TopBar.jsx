import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  LogOut,
  X,
  Menu,
  ChevronDown,
  Bell,
  Check,
  Clock,
  CalendarDays,
  Sun,
  Moon,
} from "lucide-react";

import Logo from "../ui/Logo";

import { useAuth } from "../../features/auth/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

import {
  useMyVisitRequests,
  useOwnerVisitRequests,
} from "../../features/requests/hooks/useVisitRequests.js";

/* =========================================================
   LOGOUT MODAL
========================================================= */

function LogoutConfirmModal({ onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-ink/50 backdrop-blur-md px-4">
      <div className="bg-bg rounded-2xl w-full max-w-sm p-6 relative shadow-[0_24px_64px_rgba(20,20,26,0.28)]">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-ivory transition-colors"
          aria-label="Cancel"
        >
          <X size={16} />
        </button>

        <p className="font-display text-lg text-ink mb-2">Log out?</p>

        <p className="text-sm text-ink/60 mb-6">
          You'll need to log in again to access your account.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-stone text-ink text-sm font-medium py-2.5 rounded-full hover:bg-ivory transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-ink text-ivory text-sm font-semibold py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Log out
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* =========================================================
   NOTIFICATION STORAGE
========================================================= */

function getSeenNotificationKeys(userId) {
  if (!userId) return new Set();

  try {
    const stored = localStorage.getItem(`rentora-notifications-seen-${userId}`);

    if (!stored) return new Set();

    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

function saveSeenNotificationKeys(userId, keys) {
  if (!userId) return;

  try {
    localStorage.setItem(
      `rentora-notifications-seen-${userId}`,
      JSON.stringify([...keys]),
    );
  } catch {
    // Ignore localStorage errors.
  }
}

/* =========================================================
   NOTIFICATION PANEL
========================================================= */

function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAllRead,
  onOpenNotification,
}) {
  return (
    <div className="absolute right-0 top-full mt-3 w-[360px] max-w-[calc(100vw-24px)] bg-bg border border-stone rounded-2xl shadow-[0_20px_60px_rgba(20,20,26,0.18)] overflow-hidden z-[10000]">
      <div className="px-4 py-3.5 border-b border-stone flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base text-text">Notifications</h3>

          <p className="text-[11px] text-text/45 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs font-medium text-brass hover:text-ink transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto w-11 h-11 rounded-full bg-brass-light flex items-center justify-center mb-3">
              <Bell size={18} className="text-brass" />
            </div>

            <p className="text-sm font-medium text-text">No notifications</p>

            <p className="text-xs text-text/45 mt-1">
              New activity will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.key}
              type="button"
              onClick={() => onOpenNotification(notification)}
              className={`w-full text-left px-4 py-3.5 flex gap-3 border-b border-stone last:border-b-0 hover:bg-ivory transition-colors ${
                notification.unread ? "bg-brass-light/35" : "bg-transparent"
              }`}
            >
              <span
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  notification.type === "accepted"
                    ? "bg-green-100 text-green-700"
                    : notification.type === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-brass-light text-brass"
                }`}
              >
                {notification.type === "accepted" ? (
                  <Check size={16} />
                ) : notification.type === "declined" ? (
                  <X size={16} />
                ) : (
                  <CalendarDays size={16} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-text">
                    {notification.title}
                  </span>

                  {notification.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#c0533e] shrink-0 mt-1.5" />
                  )}
                </span>

                <span className="block text-xs text-text/55 mt-1 leading-relaxed">
                  {notification.message}
                </span>

                <span className="flex items-center gap-1.5 text-[10px] text-text/35 mt-2">
                  <Clock size={10} />
                  {notification.date}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================
   THEME TOGGLE
========================================================= */

function ThemeToggleButton({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center justify-center w-9 h-9 rounded-full border border-stone text-ink hover:bg-brass-light hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

/* =========================================================
   TOP BAR
========================================================= */

export default function TopBar() {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [seenKeys, setSeenKeys] = useState(() =>
    getSeenNotificationKeys(user?.id || user?._id),
  );

  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  const userId = user?.id || user?._id;

  /* =======================================================
     VISIT REQUEST QUERIES
  ======================================================= */

  const ownerRequestsQuery = useOwnerVisitRequests({
    enabled: isAuthenticated && role === "owner",
  });

  const renterRequestsQuery = useMyVisitRequests({
    enabled: isAuthenticated && role === "renter",
  });

  const ownerRequests = role === "owner" ? ownerRequestsQuery.requests : [];

  const renterRequests = role === "renter" ? renterRequestsQuery.requests : [];

  /* =======================================================
     RESET SEEN NOTIFICATIONS WHEN ACCOUNT CHANGES
  ======================================================= */

  useEffect(() => {
    setSeenKeys(getSeenNotificationKeys(userId));
  }, [userId]);

  /* =======================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* =======================================================
     PREVENT BODY SCROLL WHILE MOBILE MENU IS OPEN
  ======================================================= */

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const notifications = useMemo(() => {
    if (!isAuthenticated) return [];

    if (role === "owner") {
      return ownerRequests
        .map((request) => {
          const propertyTitle = request.property?.title || "your property";

          const renterName = request.renter?.name || "A renter";

          const key = `owner:${request._id}:${request.status}`;

          return {
            key,

            type:
              request.status === "accepted"
                ? "accepted"
                : request.status === "declined"
                  ? "declined"
                  : "pending",

            title:
              request.status === "pending"
                ? "New visit request"
                : `Visit request ${request.status}`,

            message: `${renterName} requested a visit for ${propertyTitle}.`,

            date: request.createdAt
              ? new Date(request.createdAt).toLocaleDateString()
              : "Recently",

            unread: !seenKeys.has(key),

            request,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.request.createdAt || 0) -
            new Date(a.request.createdAt || 0),
        );
    }

    if (role === "renter") {
      return renterRequests
        .filter(
          (request) =>
            request.status === "accepted" || request.status === "declined",
        )
        .map((request) => {
          const propertyTitle =
            request.property?.title || "your requested property";

          const key = `renter:${request._id}:${request.status}`;

          return {
            key,

            type: request.status,

            title:
              request.status === "accepted"
                ? "Visit request accepted"
                : "Visit request declined",

            message: `Your visit request for ${propertyTitle} was ${request.status}.`,

            date: request.createdAt
              ? new Date(request.createdAt).toLocaleDateString()
              : "Recently",

            unread: !seenKeys.has(key),

            request,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.request.createdAt || 0) -
            new Date(a.request.createdAt || 0),
        );
    }

    return [];
  }, [isAuthenticated, role, ownerRequests, renterRequests, seenKeys]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  function markAllNotificationsRead() {
    const next = new Set(seenKeys);

    notifications.forEach((notification) => {
      next.add(notification.key);
    });

    setSeenKeys(next);

    saveSeenNotificationKeys(userId, next);
  }

  function openNotification(notification) {
    const next = new Set(seenKeys);

    next.add(notification.key);

    setSeenKeys(next);

    saveSeenNotificationKeys(userId, next);

    setNotificationsOpen(false);

    const propertyId = notification.request?.property?._id;

    if (propertyId) {
      navigate(`/listings/${propertyId}`);
      return;
    }

    if (role === "owner") {
      navigate("/owner");
    } else {
      navigate("/renter");
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    await logout();

    setConfirmOpen(false);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);

    navigate("/");
  };

  /* =======================================================
     NAVIGATION ITEMS
  ======================================================= */

  const navItems = [
    {
      to: "/",
      label: "Browse",
    },

    ...(role === "owner"
      ? [
          {
            to: "/owner/listings",
            label: "My Listings",
          },
          {
            to: "/owner/listings/new",
            label: "Add Listing",
          },
        ]
      : []),

    ...(role === "renter"
      ? [
          {
            to: "/renter/saved",
            label: "Saved",
          },
        ]
      : []),
  ];

  /* =======================================================
     USER INITIALS
  ======================================================= */

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  /* =======================================================
     MOBILE MENU TOGGLE
  ======================================================= */

  const toggleMobileMenu = () => {
    setMobileMenuOpen((value) => !value);

    setMenuOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-[9999] bg-bg/90 backdrop-blur-md shadow-[0_1px_0_rgba(20,20,26,0.06),0_12px_24px_-16px_rgba(20,20,26,0.12)]">
      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div className="flex items-center gap-3 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-10 lg:px-[82px] py-3.5 sm:py-4 lg:py-5">
        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="flex-1 flex items-center min-w-0">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-ink no-underline shrink-0"
          >
            <Logo />
          </NavLink>
        </div>

        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <nav className="hidden md:flex gap-0.5 bg-ivory p-1 rounded-full shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-full text-sm font-medium no-underline transition-all duration-200 ${
                  isActive
                    ? "bg-ink text-ivory font-semibold shadow-[0_4px_12px_rgba(20,20,26,0.18)]"
                    : "text-ink/60 hover:text-ink hover:bg-white hover:shadow-[0_1px_3px_rgba(20,20,26,0.08)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          {isLoading ? (
            <>
              <div className="w-9 h-9 rounded-full bg-ivory animate-pulse" />

              <div className="w-9 h-9 rounded-full bg-ivory animate-pulse" />
            </>
          ) : isAuthenticated ? (
            <>
              {/* =============================================
                  THEME TOGGLE
              ============================================= */}

              <ThemeToggleButton className="hidden sm:flex" />

              {/* =============================================
                  NOTIFICATIONS
              ============================================= */}

              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  onClick={() => {
                    setNotificationsOpen((value) => !value);

                    setMenuOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 ${
                    notificationsOpen
                      ? "border-brass bg-brass-light text-brass"
                      : "border-stone text-ink hover:bg-brass-light hover:-translate-y-0.5"
                  }`}
                >
                  <Bell size={16} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#c0533e] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <NotificationPanel
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAllRead={markAllNotificationsRead}
                    onOpenNotification={openNotification}
                  />
                )}
              </div>

              {/* =============================================
                  DESKTOP USER MENU
              ============================================= */}

              <div className="relative hidden sm:block" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen((value) => !value);

                    setNotificationsOpen(false);

                    setMobileMenuOpen(false);
                  }}
                  title={user?.name}
                  className="flex items-center gap-1 pl-0.5 pr-1.5 py-0.5 rounded-full hover:bg-ivory transition-colors"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold text-ink bg-gradient-to-br from-brass-light to-brass shadow-[0_0_0_2px_#ffffff,0_0_0_3px_var(--color-stone)]">
                    {initials}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-ink/40 transition-transform duration-200 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-bg border border-stone rounded-2xl shadow-lg overflow-hidden z-[10000]">
                    <div className="px-4 py-3 border-b border-stone">
                      <p className="text-sm font-semibold text-ink truncate">
                        {user?.name}
                      </p>

                      <p className="text-xs text-ink/50 capitalize">{role}</p>
                    </div>

                    <NavLink
                      to={`/${role}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-ivory transition-colors"
                    >
                      <LayoutDashboard size={15} className="text-ink/50" />
                      Dashboard
                    </NavLink>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setConfirmOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#c0533e] hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                )}
              </div>

              {/* =============================================
                  MOBILE USER AVATAR
              ============================================= */}

              <div className="sm:hidden">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold text-ink bg-gradient-to-br from-brass-light to-brass shadow-[0_0_0_2px_#ffffff,0_0_0_3px_var(--color-stone)]"
                  aria-label={user?.name}
                >
                  {initials}
                </span>
              </div>

              {/* =============================================
                  MOBILE MENU BUTTON
              ============================================= */}

              <button
                type="button"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileMenuOpen}
                onClick={toggleMobileMenu}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-stone text-ink bg-bg hover:bg-ivory active:scale-95 transition-all"
              >
                {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </>
          ) : (
            <>
              {/* =============================================
                  THEME TOGGLE
              ============================================= */}

              <ThemeToggleButton className="hidden sm:flex" />

              {/* =============================================
                  LOGIN
              ============================================= */}

              <NavLink
                to="/login"
                className="text-sm font-medium text-ink/65 no-underline hover:text-ink transition-colors"
              >
                Log in
              </NavLink>

              {/* =============================================
                  REGISTER DESKTOP
              ============================================= */}

              <NavLink
                to="/register"
                className="hidden sm:flex items-center gap-1.5 bg-ink text-ivory rounded-full px-4 py-2.5 text-sm font-semibold no-underline hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
              >
                List your property
              </NavLink>

              {/* =============================================
                  MOBILE MENU BUTTON
              ============================================= */}

              <button
                type="button"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileMenuOpen}
                onClick={toggleMobileMenu}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-stone text-ink bg-bg hover:bg-ivory active:scale-95 transition-all"
              >
                {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {mobileMenuOpen && (
        <>
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close mobile navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[64px] bg-ink/10 backdrop-blur-[1px] md:hidden z-[9997]"
          />

          {/* MENU PANEL */}

          <div className="absolute left-0 right-0 top-full md:hidden bg-bg border-t border-stone shadow-[0_20px_40px_rgba(20,20,26,0.12)] z-[9998]">
            <nav className="px-4 sm:px-6 py-4">
              {/* THEME TOGGLE */}

              <div className="flex items-center justify-between px-4 min-h-[48px] mb-1">
                <span className="text-sm font-medium text-ink/70">Theme</span>
                <ThemeToggleButton />
              </div>

              {/* MAIN NAVIGATION */}

              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center min-h-[48px] px-4 rounded-xl text-sm font-medium no-underline transition-colors ${
                        isActive
                          ? "bg-ink text-ivory font-semibold"
                          : "text-ink/70 hover:bg-ivory hover:text-ink active:bg-ivory"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* AUTHENTICATED USER OPTIONS */}

              {isAuthenticated && (
                <>
                  <div className="my-3 border-t border-stone" />

                  {/* USER INFO */}

                  <div className="px-4 py-2.5 mb-1">
                    <p className="text-sm font-semibold text-ink truncate">
                      {user?.name}
                    </p>

                    <p className="text-xs text-ink/50 capitalize mt-0.5">
                      {role}
                    </p>
                  </div>

                  {/* DASHBOARD */}

                  <NavLink
                    to={`/${role}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-sm font-medium text-ink/70 hover:bg-ivory hover:text-ink active:bg-ivory no-underline"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </NavLink>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);

                      setConfirmOpen(true);
                    }}
                    className="w-full flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-sm font-medium text-[#c0533e] hover:bg-red-50 active:bg-red-50 transition-colors"
                  >
                    <LogOut size={17} />
                    Log out
                  </button>
                </>
              )}

              {/* UNAUTHENTICATED USER OPTIONS */}

              {!isAuthenticated && (
                <>
                  <div className="my-3 border-t border-stone" />

                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center min-h-[48px] px-4 rounded-xl text-sm font-medium text-ink border border-stone hover:bg-ivory no-underline"
                  >
                    Log in
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center min-h-[48px] px-4 rounded-xl text-sm font-semibold bg-ink text-ivory hover:opacity-90 no-underline mt-2"
                  >
                    List your property
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </>
      )}

      {/* =====================================================
          LOGOUT MODAL
      ===================================================== */}

      {confirmOpen && (
        <LogoutConfirmModal
          onConfirm={handleLogout}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </header>
  );
}
