import TopBar from "./TopBar.jsx";

export default function AppShell({
  children,
  sidebar = null,
  centeredContent = false,
}) {
  return (
    <div className="app-backdrop">
      <TopBar />

      <div className="app-shell px-6 py-8">
        {sidebar ? (
          centeredContent ? (
            <>
              {/* =================================================
                  CENTERED PAGE LAYOUT

                  On large screens the sidebar sits outside the
                  centered content area, so it doesn't push the
                  actual page content toward the right.

                  On medium screens we keep the normal layout
                  because there isn't enough horizontal room.
              ================================================= */}

              <div className="md:flex md:gap-6 xl:relative xl:block">
                {/* SIDEBAR */}

                <div
                  className="
                    hidden
                    md:block
                    md:shrink-0
                    xl:absolute
                    xl:right-full
                    xl:top-0
                    xl:mr-6
                  "
                >
                  {sidebar}
                </div>

                {/* PAGE CONTENT */}

                <div
                  className="
                    min-w-0
                    flex-1
                    xl:w-full
                  "
                >
                  {children}
                </div>
              </div>
            </>
          ) : (
            /* =================================================
               NORMAL SIDEBAR LAYOUT
            ================================================= */

            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="hidden md:block">{sidebar}</div>

              <div className="min-w-0 flex-1">{children}</div>
            </div>
          )
        ) : (
          children
        )}
      </div>
    </div>
  );
}
