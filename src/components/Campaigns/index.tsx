"use client"

import { useState, useEffect } from "react"
import { CampaignListView } from "./CampaignListView"
import { CampaignViewer } from "./CampaignViewer"
import { CampaignCreator } from "./CampaignCreator"
import { useCampaignStore } from "@/stores/campaignStore"
import { useCharacterStore } from "@/stores/characterStore"

export function Campaigns() {
  const [showCreator, setShowCreator] = useState(false)
  const { selectedCampaignId, campaigns, fetchCampaigns, selectCampaign, loading } = useCampaignStore()
  const { fetchCharacters } = useCharacterStore()

  useEffect(() => {
    fetchCampaigns()
    fetchCharacters()
  }, [fetchCampaigns, fetchCharacters])

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId)

  // If a campaign is selected, show the full campaign viewer
  if (selectedCampaign) {
    return (
      <CampaignViewer
        campaign={selectedCampaign}
        onBack={() => selectCampaign(null)}
      />
    )
  }

  // Otherwise show the campaigns list view
  return (
    <>
      <CampaignListView
        campaigns={campaigns}
        loading={loading}
        onSelectCampaign={selectCampaign}
        onCreateNew={() => setShowCreator(true)}
      />
      {showCreator && <CampaignCreator onClose={() => setShowCreator(false)} />}
    </>
  )
}
