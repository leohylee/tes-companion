"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ToolId = "overland-maps" | "enemy-skills"

export interface Tool {
  id: ToolId
  name: string
  icon: string
}

export const tools: Tool[] = [
  { id: "overland-maps", name: "Overland Maps", icon: "🗺️" },
  { id: "enemy-skills", name: "Enemy Skills", icon: "⚔️" },
]

interface AppState {
  currentTool: ToolId
  sidebarOpen: boolean
}

interface AppActions {
  setCurrentTool: (toolId: ToolId) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      currentTool: "overland-maps",
      sidebarOpen: true,

      setCurrentTool: (toolId) => set({ currentTool: toolId }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "tes-companion-app-store",
    }
  )
)
