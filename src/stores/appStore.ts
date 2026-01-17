"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ToolId = "overland-maps"
export type ReferenceId = "initial-setup" | "campaign-stages" | "day-phases" | "combat"
export type ViewId = ToolId | ReferenceId

export interface NavItem {
  id: ViewId
  name: string
  icon: string
}

export const tools: NavItem[] = [
  { id: "overland-maps", name: "Overland Maps", icon: "🗺️" },
]

export const references: NavItem[] = [
  { id: "initial-setup", name: "Initial Setup", icon: "🎮" },
  { id: "campaign-stages", name: "Campaign Stages", icon: "📜" },
  { id: "day-phases", name: "Day Phases", icon: "☀️" },
  { id: "combat", name: "Combat", icon: "⚔️" },
]

interface AppState {
  currentView: ViewId
  sidebarOpen: boolean
}

interface AppActions {
  setCurrentView: (viewId: ViewId) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      currentView: "overland-maps",
      sidebarOpen: true,

      setCurrentView: (viewId) => set({ currentView: viewId }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "tes-companion-app-store",
    }
  )
)
