// frontend/src/components/layout/TopBar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function TopBar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
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
    <header className="topbar">
      <NavLink to="/" className="topbar__logo-link">
        <Logo />
      </NavLink>

      <nav className="topbar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `topbar__link ${isActive ? 'is-active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="topbar__user">
        {isAuthenticated ? (
          <>
            {role === 'renter' && (
              <NavLink to="/renter" className="topbar__link">Dashboard</NavLink>
            )}
            {role === 'owner' && (
              <NavLink to="/owner" className="topbar__link">Dashboard</NavLink>
            )}
            <div className="topbar__avatar" aria-hidden="true">{initials}</div>
            <span className="topbar__username">{user?.name}</span>
            <button className="topbar__logout" onClick={handleLogout}>
              <Icon name="close" size={14} />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="topbar__link">Log in</NavLink>
            <NavLink to="/register" className="btn-dark topbar__cta">List your property</NavLink>
          </>
        )}
        <button className="topbar__bell" aria-label="Notifications">
          <Icon name="bell" size={16} />
        </button>
      </div>
    </header>
  );
}
