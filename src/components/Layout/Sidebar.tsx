"use client"

import { useAppStore, tools, references, ViewId } from "@/stores/appStore"

export function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, toggleSidebar } = useAppStore()

  const NavButton = ({ id, name, icon }: { id: ViewId; name: string; icon: string }) => (
    <button
      onClick={() => setCurrentView(id)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        currentView === id
          ? "bg-tes-gold/20 text-tes-gold"
          : "text-tes-parchment/70 hover:bg-tes-gold/10 hover:text-tes-parchment"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{name}</span>
    </button>
  )

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 z-50 -translate-y-1/2 rounded-r-lg bg-tes-dark/90 p-2 text-tes-gold shadow-lg backdrop-blur transition-all hover:bg-tes-dark"
        style={{ left: sidebarOpen ? "180px" : "0" }}
      >
        <svg
          className={`h-5 w-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[180px] bg-tes-dark/95 shadow-xl backdrop-blur transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tes-gold/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="TES Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-sm font-bold text-tes-gold">TES Companion</h1>
              <p className="text-xs text-tes-parchment/50">Betrayal of the Second Era</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded p-1 text-tes-parchment/50 hover:bg-tes-gold/20 hover:text-tes-gold"
            title="Collapse sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto">
          {/* Tools Section */}
          <nav className="p-2">
            <p className="mb-2 px-2 text-xs font-medium uppercase text-tes-parchment/40">Tools</p>
            <ul className="space-y-1">
              {tools.map((item) => (
                <li key={item.id}>
                  <NavButton {...item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* References Section */}
          <nav className="p-2 pt-0">
            <p className="mb-2 px-2 text-xs font-medium uppercase text-tes-parchment/40">References</p>
            <ul className="space-y-1">
              {references.map((item) => (
                <li key={item.id}>
                  <NavButton {...item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
