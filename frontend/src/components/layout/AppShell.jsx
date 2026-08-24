// frontend/src/components/layout/AppShell.jsx
import TopBar from "./TopBar.jsx";

export default function AppShell({ children, sidebar = null }) {
  return (
    <div className="app-backdrop">
      <TopBar />

      <div className="app-shell px-6 py-8">
        {sidebar ? (
          <div className="flex flex-col md:flex-row md:gap-6">
            {/* SIDEBAR — hidden on mobile; mobile nav lives in TopBar's menu */}
            <div className="hidden md:block">{sidebar}</div>

            <div className="flex-1 min-w-0">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
