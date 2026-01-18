"use client"

import { useState, useEffect } from "react"
import { Campaign, Character } from "@/types"
import { useCharacterStore } from "@/stores/characterStore"
import { CampaignOverview } from "./CampaignOverview"
import { CampaignMap } from "./CampaignMap"
import { CharacterViewer } from "@/components/Characters/CharacterViewer"

interface CampaignViewerProps {
  campaign: Campaign
  onBack: () => void
}

type TabType = "overview" | "map" | string // "overview", "map", or character ID

export function CampaignViewer({ campaign, onBack }: CampaignViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const { characters } = useCharacterStore()

  // Get characters in this campaign
  const campaignCharacters = campaign.characterIds
    .map((id) => characters.find((c) => c.id === id))
    .filter((c): c is Character => c !== undefined)

  // Reset to overview if active character tab is removed
  useEffect(() => {
    if (activeTab !== "overview" && activeTab !== "map" && !campaign.characterIds.includes(activeTab)) {
      setActiveTab("overview")
    }
  }, [activeTab, campaign.characterIds])

  const activeCharacter =
    activeTab !== "overview" && activeTab !== "map"
      ? campaignCharacters.find((c) => c.id === activeTab)
      : null

  return (
    <div className="flex h-full flex-col bg-tes-darker">
      {/* Header with Back button and Tabs */}
      <div className="flex items-center gap-4 border-b border-tes-gold/20 px-6 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-tes-parchment/50 hover:text-tes-parchment"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="h-4 w-px bg-tes-gold/20" />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* Overview Tab */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-tes-gold/20 text-tes-gold"
                : "text-tes-parchment/60 hover:bg-tes-gold/10 hover:text-tes-parchment"
            }`}
          >
            Overview
          </button>

          {/* Map Tab */}
          <button
            onClick={() => setActiveTab("map")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "map"
                ? "bg-tes-gold/20 text-tes-gold"
                : "text-tes-parchment/60 hover:bg-tes-gold/10 hover:text-tes-parchment"
            }`}
          >
            Map
          </button>

          {/* Divider */}
          {campaignCharacters.length > 0 && (
            <div className="mx-2 h-4 w-px bg-tes-gold/20" />
          )}

          {/* Character Tabs */}
          {campaignCharacters.map((character) => (
            <button
              key={character.id}
              onClick={() => setActiveTab(character.id)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === character.id
                  ? "bg-tes-gold/20 text-tes-gold"
                  : "text-tes-parchment/60 hover:bg-tes-gold/10 hover:text-tes-parchment"
              }`}
            >
              {character.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={`flex-1 overflow-auto ${activeTab !== "map" ? "pt-4" : ""}`}>
        {activeTab === "overview" ? (
          <CampaignOverview campaign={campaign} characters={campaignCharacters} />
        ) : activeTab === "map" ? (
          <CampaignMap campaign={campaign} />
        ) : activeCharacter ? (
          <CharacterViewer character={activeCharacter} hideHeader />
        ) : null}
      </div>
    </div>
  )
}
