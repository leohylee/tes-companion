"use client"

import { Sidebar } from "@/components/Layout/Sidebar"
import { OverlandMap } from "@/components/OverlandMap"
import { Characters } from "@/components/Characters"
import { InitialSetup } from "@/components/References/InitialSetup"
import { CampaignStages } from "@/components/References/CampaignStages"
import { DayPhases } from "@/components/References/DayPhases"
import { Combat } from "@/components/Combat"
import { useAppStore } from "@/stores/appStore"

export default function Home() {
  const { currentView, sidebarOpen } = useAppStore()

  return (
    <main className="h-screen w-screen overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div
        className="h-full transition-all"
        style={{ marginLeft: sidebarOpen ? "180px" : "0" }}
      >
        {/* Tools */}
        {currentView === "overland-maps" && <OverlandMap />}
        {currentView === "characters" && <Characters />}

        {/* References */}
        {currentView === "initial-setup" && <InitialSetup />}
        {currentView === "campaign-stages" && <CampaignStages />}
        {currentView === "day-phases" && <DayPhases />}
        {currentView === "combat" && <Combat />}
      </div>
    </main>
  )
}
