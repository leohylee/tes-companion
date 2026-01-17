"use client"

import { Sidebar } from "@/components/Layout/Sidebar"
import { OverlandMap } from "@/components/OverlandMap"
import { EnemySkills } from "@/components/EnemySkills"
import { useAppStore } from "@/stores/appStore"

export default function Home() {
  const { currentTool, sidebarOpen } = useAppStore()

  return (
    <main className="h-screen w-screen overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div
        className="h-full transition-all"
        style={{ marginLeft: sidebarOpen ? "180px" : "0" }}
      >
        {currentTool === "overland-maps" && <OverlandMap />}
        {currentTool === "enemy-skills" && <EnemySkills />}
      </div>
    </main>
  )
}
