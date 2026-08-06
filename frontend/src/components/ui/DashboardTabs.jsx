import { useState } from "react";

export default function DashboardTabs({ tabs = [], children }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex gap-6 border-b border-stone mb-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`pb-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              active === tab.id
                ? "border-brass text-brass font-medium"
                : "border-transparent text-text/50 hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab?.id === tabs[0]?.id ? (
        children
      ) : (
        <p className="text-sm text-text/50 py-8 text-center">Coming soon.</p>
      )}
    </div>
  );
}