import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, X, ChevronDown } from 'lucide-react';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import { useAuth } from '../../features/auth/AuthContext.jsx';

function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 honey-lift">
      <div className="bg-bg rounded-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-ivory transition-colors"
          aria-label="Cancel"
        >
          <X size={16} />
        </button>

        <p className="font-display text-lg text-ink mb-2">Log out?</p>
        <p className="text-sm text-ink/60 mb-6">You'll need to log in again to access your account.</p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-stone text-ink text-sm font-medium py-2.5 rounded-full hover:bg-ivory transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-ink text-ivory text-sm font-semibold py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopBar() {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setConfirmOpen(false);
    navigate('/');
  };

  const navItems = [
    { to: '/', label: 'Browse' },
    ...(role === 'owner'
      ? [
          { to: '/owner/listings', label: 'My Listings' },
          { to: '/owner/listings/new', label: 'Add Listing' },
        ]
      : []),
    ...(role === 'renter' ? [{ to: '/renter/saved', label: 'Saved' }] : []),
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-6 px-8 py-3.5 bg-white/80 backdrop-blur-md shadow-[0_1px_0_rgba(20,20,26,0.06),0_12px_24px_-16px_rgba(20,20,26,0.12)]">
      <NavLink to="/" className="flex items-center gap-2 text-ink no-underline shrink-0">
        <Logo />
      </NavLink>

      <nav className="flex gap-0.5 bg-ivory p-1 rounded-full">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `px-4.5 py-2.5 rounded-full text-sm font-medium no-underline transition-all duration-200 ${
                isActive
                  ? 'bg-ink text-ivory font-semibold shadow-[0_4px_12px_rgba(20,20,26,0.18)]'
                  : 'text-ink/60 hover:text-ink hover:bg-white hover:shadow-[0_1px_3px_rgba(20,20,26,0.08)]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        {isLoading ? (
          <>
            <div className="w-9 h-9 rounded-full bg-ivory animate-pulse" />
            <div className="w-9 h-9 rounded-full bg-ivory animate-pulse" />
          </>
        ) : isAuthenticated ? (
          <>
            <button
              aria-label="Notifications"
              className="relative flex items-center justify-center w-9 h-9 rounded-full border border-stone hover:bg-brass-light hover:-translate-y-0.5 transition-all duration-200"
            >
              <Icon name="bell" size={16} />
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#c0533e] shadow-[0_0_0_2px_#ffffff]" />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                title={user?.name}
                className="flex items-center gap-1 pl-0.5 pr-1.5 py-0.5 rounded-full hover:bg-ivory transition-colors"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold text-ink bg-gradient-to-br from-brass-light to-brass shadow-[0_0_0_2px_#ffffff,0_0_0_3px_var(--color-stone)]">
                  {initials}
                </span>
                <ChevronDown size={14} className={`text-ink/40 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-bg border border-stone rounded-2xl shadow-lg overflow-hidden animate-[hint-drop_200ms_var(--ease-honey-soft)_both]">
                  <div className="px-4 py-3 border-b border-stone">
                    <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
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
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-sm font-medium text-ink/65 no-underline hover:opacity-100 transition-opacity"
            >
              Log in
            </NavLink>
            <NavLink
              to="/register"
              className="flex items-center gap-1.5 bg-ink text-ivory rounded-full px-4 py-2.5 text-sm font-semibold no-underline hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
            >
              List your property
            </NavLink>
            <button
              aria-label="Notifications"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-stone hover:bg-brass-light hover:-translate-y-0.5 transition-all duration-200"
            >
              <Icon name="bell" size={16} />
            </button>
          </>
        )}
      </div>

      {confirmOpen && (
        <LogoutConfirmModal onConfirm={handleLogout} onCancel={() => setConfirmOpen(false)} />
      )}
    </header>
  );
}
