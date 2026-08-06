// frontend/src/components/layout/AppShell.jsx
import TopBar from "./TopBar.jsx";

export default function AppShell({ children }) {
  return (
    <div className="app-backdrop">
      <TopBar />
      <div className="app-shell px-6 py-8">{children}</div>
    </div>
  );
}
