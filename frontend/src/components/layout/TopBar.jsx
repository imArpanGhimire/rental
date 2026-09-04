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
  UserCog,
} from "lucide-react";

import Logo from "../ui/Logo";

import { useAuth } from "../../features/auth/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

import {
  useMyVisitRequests,
  useOwnerVisitRequests,
  useUpdateVisitRequestStatus,
} from "../../features/requests/hooks/useVisitRequests.js";

/* =========================================================
   LOGOUT MODAL
========================================================= */

function LogoutConfirmModal({ onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-ink/45 backdrop-blur-[6px] px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-stone bg-bg shadow-[0_24px_70px_rgba(20,20,26,0.22)]">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl tracking-tight text-ink">
                Log out?
              </p>

              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                You'll need to log in again to access your account.
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/45 transition-all duration-200 hover:bg-ivory hover:text-ink"
              aria-label="Cancel"
            >
              <X size={17} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-7 flex gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-stone bg-bg py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:border-ink/20 hover:bg-ivory"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-ink py-2.5 text-sm font-semibold text-ivory transition-all duration-200 hover:-translate-y-px hover:opacity-90"
            >
              Log out
            </button>
          </div>
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
  const updateStatus = useUpdateVisitRequestStatus();

  // Tracks which specific request is mid-update, so only that row's
  // buttons disable/show a loading state instead of the whole panel.
  const [updatingId, setUpdatingId] = useState(null);

  function handleRespond(e, requestId, status) {
    e.stopPropagation();

    if (!requestId || updateStatus.isPending) return;

    setUpdatingId(requestId);

    updateStatus.mutate(
      { id: requestId, status },
      {
        onSettled: () => setUpdatingId(null),
      },
    );
  }

  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-[10000] w-[370px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-stone bg-bg shadow-[0_20px_55px_rgba(20,20,26,0.15)]">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-3 border-b border-stone px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brass-light text-brass">
            <Bell size={16} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="font-display text-[15px] tracking-tight text-text">
              Notifications
            </h3>

            <p className="mt-0.5 text-[11px] text-text/45">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount === 1 ? "" : "s"
                  }`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-brass transition-colors hover:bg-brass-light hover:text-ink"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* CONTENT */}

      <div className="max-h-[430px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brass-light">
              <Bell size={19} className="text-brass" strokeWidth={1.8} />
            </div>

            <p className="mt-4 text-sm font-semibold text-text">
              No notifications
            </p>

            <p className="mt-1 text-xs text-text/45">
              New activity will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const isPendingRequest = notification.type === "pending";
            const requestId = notification.request?._id;
            const isUpdatingThis = updatingId === requestId;

            return (
              <div
                key={notification.key}
                className={`group flex w-full gap-3.5 border-b border-stone px-5 py-4 text-left transition-all duration-200 last:border-b-0 ${
                  notification.unread
                    ? "bg-brass-light/25 hover:bg-brass-light/45"
                    : "bg-transparent hover:bg-ivory"
                }`}
              >
                {/* ICON */}

                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    notification.type === "accepted"
                      ? "bg-green-100 text-green-700"
                      : notification.type === "declined"
                        ? "bg-red-100 text-red-700"
                        : "bg-brass-light text-brass"
                  }`}
                >
                  {notification.type === "accepted" ? (
                    <Check size={16} strokeWidth={2} />
                  ) : notification.type === "declined" ? (
                    <X size={16} strokeWidth={2} />
                  ) : (
                    <CalendarDays size={16} strokeWidth={1.8} />
                  )}
                </span>

                {/* TEXT + ACTIONS */}

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onOpenNotification(notification)}
                    className="block w-full text-left"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-[13px] font-semibold leading-snug text-text">
                        {notification.title}
                      </span>

                      {notification.unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                      )}
                    </span>

                    <span className="mt-1 block text-xs leading-relaxed text-text/52">
                      {notification.message}
                    </span>

                    <span className="mt-2.5 flex items-center gap-1.5 text-[10px] text-text/35">
                      <Clock size={10} strokeWidth={1.8} />
                      {notification.date}
                    </span>
                  </button>

                  {/* ACCEPT / DECLINE — only for the owner's pending requests */}

                  {isPendingRequest && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUpdatingThis}
                        onClick={(e) => handleRespond(e, requestId, "accepted")}
                        className="flex-1 rounded-lg bg-ink py-1.5 text-[11px] font-semibold text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {isUpdatingThis ? "..." : "Accept"}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingThis}
                        onClick={(e) => handleRespond(e, requestId, "declined")}
                        className="flex-1 rounded-lg border border-stone py-1.5 text-[11px] font-semibold text-text/70 transition-colors hover:bg-ivory disabled:opacity-50"
                      >
                        {isUpdatingThis ? "..." : "Decline"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
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
      className={`group flex h-9 w-9 items-center justify-center rounded-full border border-stone bg-bg text-ink/55 transition-all duration-200 hover:border-ink/20 hover:bg-ivory hover:text-ink ${className}`}
    >
      {isDark ? (
        <Sun
          size={16}
          strokeWidth={1.8}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
      ) : (
        <Moon
          size={16}
          strokeWidth={1.8}
          className="transition-transform duration-300 group-hover:-rotate-12"
        />
      )}
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
    <>
      <header className="sticky top-0 z-[9999] border-b border-stone/80 bg-bg/95 backdrop-blur-xl">
        {/* ===================================================
            MAIN HEADER
        =================================================== */}

        <div className="mx-auto flex h-[68px] w-full items-center gap-4 px-4 sm:px-6 md:h-[72px] md:px-10 lg:px-[82px]">
          {/* =================================================
              LOGO
          ================================================= */}

          <div className="flex min-w-0 items-center">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex shrink-0 items-center text-ink no-underline"
            >
              <Logo />
            </NavLink>
          </div>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="ml-4 hidden items-center gap-1 rounded-full border border-stone/70 bg-bg/70 p-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-[13px] font-medium no-underline transition-all duration-200 ${
                    isActive
                      ? "bg-ink text-ivory shadow-sm"
                      : "text-ink/55 hover:bg-ivory hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {isLoading ? (
              <>
                <div className="h-9 w-9 animate-pulse rounded-full bg-ivory" />
                <div className="h-9 w-9 animate-pulse rounded-full bg-ivory" />
              </>
            ) : isAuthenticated ? (
              <>
                {/* =========================================
                    THEME
                ========================================= */}

                <ThemeToggleButton className="hidden sm:flex" />

                {/* =========================================
                    NOTIFICATIONS
                ========================================= */}

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
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                      notificationsOpen
                        ? "border-ink/20 bg-ink text-ivory shadow-sm"
                        : "border-stone bg-bg text-ink/55 hover:border-ink/20 hover:bg-ivory hover:text-ink"
                    }`}
                  >
                    <Bell
                      size={17}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:-rotate-6"
                    />

                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex min-h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-bg bg-brass px-1 text-[9px] font-bold leading-none text-ivory">
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

                {/* =========================================
                    DESKTOP USER MENU
                ========================================= */}

                <div className="relative hidden sm:block" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen((value) => !value);

                      setNotificationsOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    title={user?.name}
                    className={`group flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 transition-all duration-200 ${
                      menuOpen
                        ? "border-ink/20 bg-ivory"
                        : "border-transparent hover:border-stone hover:bg-ivory/60"
                    }`}
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user?.name || "Profile"}
                        className="h-8 w-8 rounded-full object-cover border border-brass/30"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/30 bg-brass-light text-[11px] font-bold tracking-wide text-ink">
                        {initials}
                      </span>
                    )}

                    <span className="hidden max-w-[100px] truncate text-[12px] font-medium text-ink/65 lg:block">
                      {user?.name}
                    </span>

                    <ChevronDown
                      size={13}
                      strokeWidth={2}
                      className={`text-ink/35 transition-transform duration-200 ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-[10000] w-60 overflow-hidden rounded-2xl border border-stone bg-bg shadow-[0_20px_55px_rgba(20,20,26,0.15)]">
                      {/* USER HEADER */}

                      <div className="border-b border-stone bg-ivory/35 px-4 py-4">
                        <div className="flex items-center gap-3">
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user?.name || "Profile"}
                              className="h-10 w-10 shrink-0 rounded-xl object-cover border border-brass/30"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brass/30 bg-brass-light text-xs font-bold text-ink">
                              {initials}
                            </span>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                              {user?.name}
                            </p>

                            <p className="mt-0.5 text-[11px] capitalize text-ink/45">
                              {role}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* DASHBOARD */}

                      <div className="p-1.5">
                        <NavLink
                          to={`/${role}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink/65 no-underline transition-colors hover:bg-ivory hover:text-ink"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ivory text-ink/50">
                            <LayoutDashboard size={14} strokeWidth={1.8} />
                          </span>
                          Dashboard
                        </NavLink>

                        {/* SETTINGS */}

                        <NavLink
                          to={`/${role}/settings`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink/65 no-underline transition-colors hover:bg-ivory hover:text-ink"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ivory text-ink/50">
                            <UserCog size={14} strokeWidth={1.8} />
                          </span>
                          Personal information
                        </NavLink>

                        <div className="my-1 border-t border-stone" />

                        {/* LOGOUT */}

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            setConfirmOpen(true);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-[#B5502E] transition-colors hover:bg-[#B5502E]/[0.06]"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B5502E]/[0.07]">
                            <LogOut size={14} strokeWidth={1.8} />
                          </span>
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* =========================================
                    MOBILE USER AVATAR
                ========================================= */}

                <div className="sm:hidden">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user?.name || "Profile"}
                      className="h-9 w-9 rounded-full object-cover border border-brass/30"
                    />
                  ) : (
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/30 bg-brass-light text-[10px] font-bold tracking-wide text-ink"
                      aria-label={user?.name}
                    >
                      {initials}
                    </span>
                  )}
                </div>

                {/* =========================================
                    MOBILE MENU BUTTON
                ========================================= */}

                <button
                  type="button"
                  aria-label={
                    mobileMenuOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                  aria-expanded={mobileMenuOpen}
                  onClick={toggleMobileMenu}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 md:hidden ${
                    mobileMenuOpen
                      ? "border-ink/20 bg-ink text-ivory"
                      : "border-stone bg-bg text-ink/60 hover:bg-ivory hover:text-ink"
                  }`}
                >
                  {mobileMenuOpen ? (
                    <X size={18} strokeWidth={1.8} />
                  ) : (
                    <Menu size={18} strokeWidth={1.8} />
                  )}
                </button>
              </>
            ) : (
              <>
                {/* =========================================
                    THEME
                ========================================= */}

                <ThemeToggleButton className="hidden sm:flex" />

                {/* =========================================
                    LOGIN
                ========================================= */}

                <NavLink
                  to="/login"
                  className="rounded-full px-3 py-2 text-[13px] font-medium text-ink/55 no-underline transition-colors hover:bg-ivory hover:text-ink"
                >
                  Log in
                </NavLink>

                {/* =========================================
                    REGISTER
                ========================================= */}

                <NavLink
                  to="/register"
                  className="hidden items-center rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-ivory no-underline shadow-sm transition-all duration-200 hover:-translate-y-px hover:opacity-90 sm:flex"
                >
                  List your property
                </NavLink>

                {/* =========================================
                    MOBILE MENU
                ========================================= */}

                <button
                  type="button"
                  aria-label={
                    mobileMenuOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                  aria-expanded={mobileMenuOpen}
                  onClick={toggleMobileMenu}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 md:hidden ${
                    mobileMenuOpen
                      ? "border-ink/20 bg-ink text-ivory"
                      : "border-stone bg-bg text-ink/60 hover:bg-ivory hover:text-ink"
                  }`}
                >
                  {mobileMenuOpen ? (
                    <X size={18} strokeWidth={1.8} />
                  ) : (
                    <Menu size={18} strokeWidth={1.8} />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

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
            className="fixed inset-0 top-[68px] z-[9997] bg-ink/10 backdrop-blur-[2px] md:hidden"
          />

          {/* MENU PANEL */}

          <div className="absolute left-0 right-0 top-[68px] z-[9998] border-b border-stone bg-bg shadow-[0_20px_45px_rgba(20,20,26,0.12)] md:hidden">
            <nav className="px-4 py-4 sm:px-6">
              {/* THEME */}

              <div className="mb-2 flex min-h-[50px] items-center justify-between rounded-xl px-4">
                <div>
                  <p className="text-sm font-medium text-ink">Appearance</p>

                  <p className="mt-0.5 text-[11px] text-ink/40">
                    Switch between light and dark mode
                  </p>
                </div>

                <ThemeToggleButton />
              </div>

              {/* NAVIGATION */}

              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex min-h-[48px] items-center rounded-xl px-4 text-sm font-medium no-underline transition-all duration-200 ${
                        isActive
                          ? "bg-ink font-semibold text-ivory shadow-sm"
                          : "text-ink/65 hover:bg-ivory hover:text-ink"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* AUTHENTICATED OPTIONS */}

              {isAuthenticated && (
                <>
                  <div className="my-3 border-t border-stone" />

                  {/* USER */}

                  <div className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user?.name || "Profile"}
                        className="h-9 w-9 rounded-xl object-cover border border-brass/30"
                      />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brass/30 bg-brass-light text-[10px] font-bold text-ink">
                        {initials}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {user?.name}
                      </p>

                      <p className="mt-0.5 text-[11px] capitalize text-ink/40">
                        {role}
                      </p>
                    </div>
                  </div>

                  {/* PERSONAL INFORMATION */}

                  <NavLink
                    to={`/${role}/settings`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-sm font-medium text-ink/65 no-underline transition-colors hover:bg-ivory hover:text-ink"
                  >
                    <UserCog size={17} strokeWidth={1.8} />
                    Personal information
                  </NavLink>

                  {/* DASHBOARD */}

                  <NavLink
                    to={`/${role}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-sm font-medium text-ink/65 no-underline transition-colors hover:bg-ivory hover:text-ink"
                  >
                    <LayoutDashboard size={17} strokeWidth={1.8} />
                    Dashboard
                  </NavLink>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setConfirmOpen(true);
                    }}
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium text-[#B5502E] transition-colors hover:bg-[#B5502E]/[0.06]"
                  >
                    <LogOut size={17} strokeWidth={1.8} />
                    Log out
                  </button>
                </>
              )}

              {/* UNAUTHENTICATED OPTIONS */}

              {!isAuthenticated && (
                <>
                  <div className="my-3 border-t border-stone" />

                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center justify-center rounded-xl border border-stone text-sm font-medium text-ink no-underline transition-all hover:bg-ivory"
                  >
                    Log in
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 flex min-h-[48px] items-center justify-center rounded-xl bg-ink text-sm font-semibold text-ivory no-underline shadow-sm transition-opacity hover:opacity-90"
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
    </>
  );
}
