import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-ink/45 backdrop-blur-[6px] px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-stone bg-bg shadow-[0_24px_70px_rgba(20,20,26,0.22)]">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl tracking-tight text-ink">
                {t("topbar.logout.title")}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                {t("topbar.logout.description")}
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/45 transition-all duration-200 hover:bg-ivory hover:text-ink"
              aria-label={t("common.cancel")}
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
              {t("common.cancel")}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-ink py-2.5 text-sm font-semibold text-ivory transition-all duration-200 hover:-translate-y-px hover:opacity-90"
            >
              {t("auth.logout")}
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
  const { t } = useTranslation();
  const updateStatus = useUpdateVisitRequestStatus();
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
    <div
      className="
        absolute right-0 top-[calc(100%+10px)] z-[99999]
        w-[360px] max-w-[calc(100vw-24px)] overflow-hidden
        rounded-[22px] border border-black/10
        bg-gradient-to-b from-[#f3f2ee] via-[#ecebe7] to-[#dfded9]
        shadow-[0_24px_70px_rgba(20,23,31,0.18)]
        backdrop-blur-xl
        dark:border-white/10
        dark:from-[#1c1f26] dark:via-[#181b20] dark:to-[#121419]
      "
    >
      {/* soft ambient highlight */}
      <div
        className="
          pointer-events-none absolute -right-16 -top-20 h-48 w-48
          rounded-full bg-white/55 blur-3xl dark:bg-white/[0.035]
        "
      />

      {/* HEADER */}
      <div className="relative border-b border-black/10 px-4 pb-3.5 pt-4 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                border border-black/10 bg-white/55 text-[#26282d]
                shadow-[0_8px_24px_rgba(20,23,31,0.07)]
                dark:border-white/10 dark:bg-white/[0.06] dark:text-white
              "
            >
              <Bell size={16} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2b2d31]/45 dark:text-white/40">
                {t("topbar.notifications.activity")}
              </p>

              <h3 className="mt-0.5 font-display text-[17px] font-bold tracking-[-0.035em] text-[#1f2125] dark:text-white">
                {t("topbar.notifications.title")}
              </h3>

              <p className="mt-0.5 text-[11px] leading-4 text-[#2b2d31]/55 dark:text-white/50">
                {unreadCount > 0
                  ? t("topbar.notifications.unread", { count: unreadCount })
                  : t("topbar.notifications.caughtUp")}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="
                shrink-0 rounded-full border border-black/10 bg-white/45
                px-2.5 py-1.5 text-[10px] font-semibold text-[#2b2d31]/70
                transition-colors hover:bg-white/75 hover:text-[#14161a]
                dark:border-white/10 dark:bg-white/[0.05]
                dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white
              "
            >
              {t("topbar.notifications.markAllRead")}
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative max-h-[390px] overflow-y-auto p-2.5">
        {notifications.length === 0 ? (
          <div
            className="
              rounded-[18px] border border-black/10 bg-white/40 px-6 py-9
              text-center shadow-[0_12px_35px_rgba(20,23,31,0.05)]
              dark:border-white/10 dark:bg-white/[0.035]
            "
          >
            <div
              className="
                mx-auto flex h-10 w-10 items-center justify-center rounded-xl
                border border-black/10 bg-white/60 text-[#2b2d31]
                dark:border-white/10 dark:bg-white/[0.06] dark:text-white/80
              "
            >
              <Bell size={17} strokeWidth={1.8} />
            </div>

            <p className="mt-3 font-display text-[14px] font-semibold tracking-[-0.02em] text-[#1f2125] dark:text-white">
              {t("topbar.notifications.emptyTitle")}
            </p>

            <p className="mt-1 text-[11px] leading-4 text-[#2b2d31]/50 dark:text-white/45">
              {t("topbar.notifications.emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const isPendingRequest = notification.type === "pending";
              const requestId = notification.request?._id;
              const isUpdatingThis = updatingId === requestId;

              return (
                <div
                  key={notification.key}
                  className={`
                    relative overflow-hidden rounded-[17px] border px-3.5 py-3
                    transition-colors duration-200
                    ${
                      notification.unread
                        ? "border-black/10 bg-white/62 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.07] dark:hover:bg-white/[0.09]"
                        : "border-black/[0.07] bg-white/32 hover:bg-white/55 dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
                    }
                  `}
                >
                  {notification.unread && (
                    <span className="absolute right-3.5 top-3.5 h-1.5 w-1.5 rounded-full bg-[#2f3136] dark:bg-white/70" />
                  )}

                  <div className="flex gap-3 pr-3">
                    <span
                      className={`
                        mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-xl border
                        ${
                          notification.type === "accepted"
                            ? "border-emerald-700/10 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300"
                            : notification.type === "declined"
                              ? "border-red-700/10 bg-red-50/80 text-red-700 dark:border-red-400/15 dark:bg-red-400/10 dark:text-red-300"
                              : "border-black/10 bg-white/60 text-[#2b2d31] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/75"
                        }
                      `}
                    >
                      {notification.type === "accepted" ? (
                        <Check size={16} strokeWidth={2} />
                      ) : notification.type === "declined" ? (
                        <X size={16} strokeWidth={2} />
                      ) : (
                        <CalendarDays size={16} strokeWidth={1.8} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onOpenNotification(notification)}
                        className="block w-full text-left"
                      >
                        <span className="block pr-3 text-[12.5px] font-semibold leading-[1.35rem] text-[#202226] dark:text-white/90">
                          {notification.title}
                        </span>

                        <span className="mt-1 block text-[12px] leading-[1.55] text-[#2b2d31]/58 dark:text-white/50">
                          {notification.message}
                        </span>

                        <span className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[#2b2d31]/38 dark:text-white/35">
                          <Clock size={10} strokeWidth={1.8} />
                          {notification.date}
                        </span>
                      </button>

                      {isPendingRequest && (
                        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            disabled={isUpdatingThis}
                            onClick={(e) =>
                              handleRespond(e, requestId, "accepted")
                            }
                            className="
                              rounded-xl bg-[#202226] px-2.5 py-1.5 text-[10px]
                              font-semibold text-white transition-colors
                              hover:bg-[#303238] disabled:cursor-not-allowed disabled:opacity-50
                              dark:bg-white dark:text-[#16181c] dark:hover:bg-white/90
                            "
                          >
                            {isUpdatingThis ? "..." : t("requests.accept")}
                          </button>

                          <button
                            type="button"
                            disabled={isUpdatingThis}
                            onClick={(e) =>
                              handleRespond(e, requestId, "declined")
                            }
                            className="
                              rounded-xl border border-black/10 bg-white/45 px-3 py-2
                              text-[11px] font-semibold text-[#2b2d31]/70
                              transition-colors hover:bg-white/75 hover:text-[#14161a]
                              disabled:cursor-not-allowed disabled:opacity-50
                              dark:border-white/10 dark:bg-white/[0.04]
                              dark:text-white/65 dark:hover:bg-white/[0.08]
                              dark:hover:text-white
                            "
                          >
                            {isUpdatingThis ? "..." : t("requests.decline")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   THEME TOGGLE
========================================================= */

function ThemeToggleButton({ className = "" }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? t("topbar.theme.switchLight") : t("topbar.theme.switchDark")
      }
      title={
        isDark ? t("topbar.theme.switchLight") : t("topbar.theme.switchDark")
      }
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
   LANGUAGE TOGGLE
========================================================= */

function LanguageToggle({ className = "" }) {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage?.startsWith("ne") ? "ne" : "en";

  function changeLanguage(language) {
    i18n.changeLanguage(language);
  }

  return (
    <div
      className={`flex h-9 items-center rounded-full border border-stone bg-bg p-1 ${className}`}
      aria-label={t("language.language")}
    >
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        aria-pressed={currentLanguage === "en"}
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
          currentLanguage === "en"
            ? "bg-ink text-ivory"
            : "text-ink/45 hover:text-ink"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("ne")}
        aria-pressed={currentLanguage === "ne"}
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
          currentLanguage === "ne"
            ? "bg-ink text-ivory"
            : "text-ink/45 hover:text-ink"
        }`}
      >
        नेपाली
      </button>
    </div>
  );
}

/* =========================================================
   TOP BAR
========================================================= */

export default function TopBar() {
  const { t, i18n } = useTranslation();
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
          const propertyTitle =
            request.property?.title || t("topbar.notifications.yourProperty");

          const renterName =
            request.renter?.name || t("topbar.notifications.aRenter");

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
                ? t("topbar.notifications.newVisitRequest")
                : t("topbar.notifications.visitRequestStatus", {
                    status: t(`requests.status.${request.status}`),
                  }),

            message: t("topbar.notifications.ownerRequestMessage", {
              renterName,
              propertyTitle,
            }),

            date: request.createdAt
              ? new Date(request.createdAt).toLocaleDateString(
                  i18n.resolvedLanguage?.startsWith("ne") ? "ne-NP" : "en-US",
                )
              : t("common.recently"),

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
            request.property?.title ||
            t("topbar.notifications.yourRequestedProperty");

          const key = `renter:${request._id}:${request.status}`;

          return {
            key,

            type: request.status,

            title:
              request.status === "accepted"
                ? t("topbar.notifications.visitAccepted")
                : t("topbar.notifications.visitDeclined"),

            message: t("topbar.notifications.renterRequestMessage", {
              propertyTitle,
              status: t(`requests.status.${request.status}`),
            }),

            date: request.createdAt
              ? new Date(request.createdAt).toLocaleDateString(
                  i18n.resolvedLanguage?.startsWith("ne") ? "ne-NP" : "en-US",
                )
              : t("common.recently"),

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
  }, [
    isAuthenticated,
    role,
    ownerRequests,
    renterRequests,
    seenKeys,
    t,
    i18n.resolvedLanguage,
  ]);

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
      label: t("nav.browse"),
    },

    ...(role === "owner"
      ? [
          {
            to: "/owner/listings",
            label: t("nav.myListings"),
          },
          {
            to: "/owner/listings/new",
            label: t("nav.addListing"),
          },
        ]
      : []),

    ...(role === "renter"
      ? [
          {
            to: "/renter/saved",
            label: t("nav.saved"),
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

        <div className="mx-auto flex h-[68px] w-full max-w-[1280px] items-center gap-4 px-4 sm:px-6 md:h-[72px]">
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
                <LanguageToggle className="hidden md:flex" />

                {/* =========================================
                    NOTIFICATIONS
                ========================================= */}

                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    aria-label={t("topbar.notifications.title")}
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
                        alt={user?.name || t("common.profile")}
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
                    <div
                      className="
                        absolute right-0 top-[calc(100%+10px)] z-[99999]
                        w-[278px] max-w-[calc(100vw-24px)] overflow-hidden
                        rounded-[22px] border border-black/[0.08]
                        bg-gradient-to-b from-[#f3f2ee] via-[#ebeae6] to-[#dfded9]
                        shadow-[0_24px_70px_rgba(20,23,31,0.17)]
                        backdrop-blur-xl
                        dark:border-white/[0.08]
                        dark:from-[#1c1f26] dark:via-[#181b20] dark:to-[#121419]
                      "
                    >
                      <div className="relative overflow-hidden border-b border-black/[0.06] px-4 py-4 dark:border-white/[0.07]">
                        <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/45 blur-2xl dark:bg-white/[0.025]" />

                        <p className="relative text-[9px] font-semibold uppercase tracking-[0.16em] text-[#2b2d31]/38 dark:text-white/35">
                          {t("topbar.account.label")}
                        </p>

                        <div className="relative mt-3 flex items-center gap-3">
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user?.name || t("common.profile")}
                              className="
                                h-11 w-11 shrink-0 rounded-[14px] object-cover
                                border border-black/[0.08]
                                shadow-[0_8px_22px_rgba(20,23,31,0.08)]
                                dark:border-white/[0.09] dark:shadow-none
                              "
                            />
                          ) : (
                            <span
                              className="
                                flex h-11 w-11 shrink-0 items-center justify-center
                                rounded-[14px] border border-black/[0.07]
                                bg-white/55 text-xs font-bold text-[#202226]
                                shadow-[0_8px_22px_rgba(20,23,31,0.06)]
                                dark:border-white/[0.08] dark:bg-white/[0.05]
                                dark:text-white dark:shadow-none
                              "
                            >
                              {initials}
                            </span>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-[14px] font-bold tracking-[-0.02em] text-[#202226] dark:text-white">
                              {user?.name}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-full border border-black/[0.07] bg-white/45 px-2 py-0.5 text-[9px] font-semibold capitalize text-[#2b2d31]/50 dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white/45">
                                {t(`roles.${role}`, role)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5">
                        <p className="px-2 pb-1.5 pt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/32 dark:text-white/30">
                          {t("topbar.account.workspace")}
                        </p>

                        <NavLink
                          to={`/${role}`}
                          onClick={() => setMenuOpen(false)}
                          className="
                            group flex items-center gap-3 rounded-[15px] px-2.5 py-2.5
                            text-[12px] font-semibold text-[#2b2d31]/66 no-underline
                            transition-colors hover:bg-white/60 hover:text-[#17191d]
                            dark:text-white/60 dark:hover:bg-white/[0.055] dark:hover:text-white
                          "
                        >
                          <span
                            className="
                              flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
                              border border-black/[0.06] bg-white/50 text-[#2b2d31]/48
                              transition-colors group-hover:bg-white/80 group-hover:text-[#202226]
                              dark:border-white/[0.07] dark:bg-white/[0.035]
                              dark:text-white/45 dark:group-hover:bg-white/[0.07]
                              dark:group-hover:text-white
                            "
                          >
                            <LayoutDashboard size={14} strokeWidth={1.8} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block">{t("nav.dashboard")}</span>
                            <span className="mt-0.5 block text-[9px] font-medium text-[#2b2d31]/34 dark:text-white/30">
                              {t("topbar.account.openWorkspace")}
                            </span>
                          </span>
                        </NavLink>

                        <NavLink
                          to={`/${role}/settings`}
                          onClick={() => setMenuOpen(false)}
                          className="
                            group mt-1 flex items-center gap-3 rounded-[15px] px-2.5 py-2.5
                            text-[12px] font-semibold text-[#2b2d31]/66 no-underline
                            transition-colors hover:bg-white/60 hover:text-[#17191d]
                            dark:text-white/60 dark:hover:bg-white/[0.055] dark:hover:text-white
                          "
                        >
                          <span
                            className="
                              flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
                              border border-black/[0.06] bg-white/50 text-[#2b2d31]/48
                              transition-colors group-hover:bg-white/80 group-hover:text-[#202226]
                              dark:border-white/[0.07] dark:bg-white/[0.035]
                              dark:text-white/45 dark:group-hover:bg-white/[0.07]
                              dark:group-hover:text-white
                            "
                          >
                            <UserCog size={14} strokeWidth={1.8} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block">
                              {t("nav.personalInformation")}
                            </span>
                            <span className="mt-0.5 block text-[9px] font-medium text-[#2b2d31]/34 dark:text-white/30">
                              {t("topbar.account.profileDetails")}
                            </span>
                          </span>
                        </NavLink>

                        <div className="my-2 border-t border-black/[0.06] dark:border-white/[0.07]" />

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            setConfirmOpen(true);
                          }}
                          className="
                            group flex w-full items-center gap-3 rounded-[15px]
                            px-2.5 py-2.5 text-left text-[12px] font-semibold
                            text-[#a4472a] transition-colors hover:bg-[#B5502E]/[0.065]
                            dark:text-[#e28a68] dark:hover:bg-[#d97a54]/[0.09]
                          "
                        >
                          <span
                            className="
                              flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
                              border border-[#B5502E]/10 bg-[#B5502E]/[0.055]
                              transition-colors group-hover:bg-[#B5502E]/[0.09]
                              dark:border-[#d97a54]/15 dark:bg-[#d97a54]/[0.07]
                              dark:group-hover:bg-[#d97a54]/[0.12]
                            "
                          >
                            <LogOut size={14} strokeWidth={1.8} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block">{t("auth.logout")}</span>
                            <span className="mt-0.5 block text-[9px] font-medium text-current opacity-55">
                              {t("topbar.account.signOutDescription")}
                            </span>
                          </span>
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
                      alt={user?.name || t("common.profile")}
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
                      ? t("topbar.mobile.closeMenu")
                      : t("topbar.mobile.openMenu")
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
                <LanguageToggle className="hidden md:flex" />

                {/* =========================================
                    LOGIN
                ========================================= */}

                <NavLink
                  to="/login"
                  className="rounded-full px-3 py-2 text-[13px] font-medium text-ink/55 no-underline transition-colors hover:bg-ivory hover:text-ink"
                >
                  {t("auth.login.button")}
                </NavLink>

                {/* =========================================
                    REGISTER
                ========================================= */}

                <NavLink
                  to="/register"
                  className="hidden items-center rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-ivory no-underline shadow-sm transition-all duration-200 hover:-translate-y-px hover:opacity-90 sm:flex"
                >
                  {t("nav.listYourProperty")}
                </NavLink>

                {/* =========================================
                    MOBILE MENU
                ========================================= */}

                <button
                  type="button"
                  aria-label={
                    mobileMenuOpen
                      ? t("topbar.mobile.closeMenu")
                      : t("topbar.mobile.openMenu")
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
            aria-label={t("topbar.mobile.closeNavigation")}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[68px] z-[9997] bg-ink/10 backdrop-blur-[2px] md:hidden"
          />

          {/* MENU PANEL */}

          <div className="absolute left-0 right-0 top-[68px] z-[9998] border-b border-stone bg-bg shadow-[0_20px_45px_rgba(20,20,26,0.12)] md:hidden">
            <nav className="px-4 py-4 sm:px-6">
              {/* THEME */}

              <div className="mb-2 flex min-h-[50px] items-center justify-between rounded-xl px-4">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {t("topbar.theme.appearance")}
                  </p>

                  <p className="mt-0.5 text-[11px] text-ink/40">
                    {t("topbar.theme.description")}
                  </p>
                </div>

                <ThemeToggleButton />
              </div>

              {/* LANGUAGE */}

              <div className="mb-2 flex min-h-[50px] items-center justify-between rounded-xl px-4">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {t("language.language")}
                  </p>

                  <p className="mt-0.5 text-[11px] text-ink/40">
                    {t("language.description")}
                  </p>
                </div>

                <LanguageToggle />
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
                        alt={user?.name || t("common.profile")}
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
                        {t(`roles.${role}`, role)}
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
                    {t("nav.personalInformation")}
                  </NavLink>

                  {/* DASHBOARD */}

                  <NavLink
                    to={`/${role}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-sm font-medium text-ink/65 no-underline transition-colors hover:bg-ivory hover:text-ink"
                  >
                    <LayoutDashboard size={17} strokeWidth={1.8} />
                    {t("nav.dashboard")}
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
                    {t("auth.logout")}
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
                    {t("auth.login.button")}
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 flex min-h-[48px] items-center justify-center rounded-xl bg-ink text-sm font-semibold text-ivory no-underline shadow-sm transition-opacity hover:opacity-90"
                  >
                    {t("nav.listYourProperty")}
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
