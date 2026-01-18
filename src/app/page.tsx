"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { Sidebar } from "@/components/Layout/Sidebar"
import { OverlandMap } from "@/components/OverlandMap"
import { Characters } from "@/components/Characters"
import { Campaigns } from "@/components/Campaigns"
import { InitialSetup } from "@/components/References/InitialSetup"
import { CampaignStages } from "@/components/References/CampaignStages"
import { DayPhases } from "@/components/References/DayPhases"
import { Combat } from "@/components/Combat"
import { AuthForm } from "@/components/Auth/AuthForm"
import { useAppStore } from "@/stores/appStore"
import { useCharacterStore } from "@/stores/characterStore"

export default function Home() {
  const { status } = useSession()
  const { currentView, sidebarOpen } = useAppStore()
  const { fetchCharacters } = useCharacterStore()

  // Fetch characters when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchCharacters()
    }
  }, [status, fetchCharacters])

  // Show loading state
  if (status === "loading") {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-tes-darker">
        <p className="text-tes-parchment/50">Loading...</p>
      </main>
    )
  }

  // Show auth form if not authenticated
  if (status === "unauthenticated") {
    return <AuthForm onSuccess={() => window.location.reload()} />
  }

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
        {currentView === "campaigns" && <Campaigns />}

        {/* References */}
        {currentView === "initial-setup" && <InitialSetup />}
        {currentView === "campaign-stages" && <CampaignStages />}
        {currentView === "day-phases" && <DayPhases />}
        {currentView === "combat" && <Combat />}
      </div>
    </main>
  )
}
