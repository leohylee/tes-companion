"use client"

import Image from "next/image"
import { Campaign } from "@/types"
import { useCharacterStore, RACES, CLASSES, getRaceImagePath } from "@/stores/characterStore"
import { useCampaignStore } from "@/stores/campaignStore"

interface CampaignListViewProps {
  campaigns: Campaign[]
  loading: boolean
  onSelectCampaign: (id: string) => void
  onCreateNew: () => void
}

export function CampaignListView({
  campaigns,
  loading,
  onSelectCampaign,
  onCreateNew,
}: CampaignListViewProps) {
  const { characters } = useCharacterStore()
  const { removeCampaign } = useCampaignStore()

  const getRaceName = (raceId: string) =>
    RACES.find((r) => r.id === raceId)?.name || raceId

  const getClassName = (classId: string) =>
    CLASSES.find((c) => c.id === classId)?.name || classId

  const getCampaignCharacters = (characterIds: string[]) =>
    characterIds
      .map((id) => characters.find((c) => c.id === id))
      .filter((c) => c !== undefined)

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-tes-darker">
        <p className="text-tes-parchment/50">Loading...</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-auto bg-tes-darker p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tes-gold">Campaigns</h1>
          <p className="text-tes-parchment/50">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="rounded-lg bg-tes-gold/20 px-4 py-2 text-tes-gold hover:bg-tes-gold/30"
        >
          + Start New Campaign
        </button>
      </div>

      {/* Campaign Grid */}
      {campaigns.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-tes-gold/30">
          <div className="text-center">
            <p className="text-lg text-tes-parchment/50">No campaigns yet</p>
            <button
              onClick={onCreateNew}
              className="mt-4 rounded bg-tes-gold/20 px-4 py-2 text-tes-gold hover:bg-tes-gold/30"
            >
              Start Your First Campaign
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const campaignCharacters = getCampaignCharacters(campaign.characterIds)

            return (
              <div
                key={campaign.id}
                onClick={() => onSelectCampaign(campaign.id)}
                className="group cursor-pointer overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/50 transition-all hover:border-tes-gold/50 hover:bg-tes-dark"
              >
                {/* Character Avatars */}
                <div className="flex h-32 items-center justify-center gap-1 bg-tes-darker/50 p-2">
                  {campaignCharacters.length > 0 ? (
                    campaignCharacters.map((character) => (
                      <Image
                        key={character.id}
                        src={getRaceImagePath(character.race, character.raceVariant)}
                        alt={character.name}
                        width={80}
                        height={120}
                        className="h-28 w-auto rounded object-cover object-top"
                      />
                    ))
                  ) : (
                    <p className="text-sm text-tes-parchment/30">No characters</p>
                  )}
                </div>

                {/* Campaign Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-tes-gold">{campaign.name}</h3>
                      <p className="text-sm text-tes-parchment/50">
                        {campaignCharacters.map((c) => c.name).join(", ") || "No characters"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeCampaign(campaign.id)
                      }}
                      className="rounded p-1 text-xl opacity-0 transition-opacity hover:bg-red-500/20 group-hover:opacity-100"
                      title="Delete campaign"
                    >
                      <span className="text-red-500">×</span>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-tes-parchment/30">
                    {campaign.characterIds.length} character{campaign.characterIds.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
