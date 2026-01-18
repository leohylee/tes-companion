"use client"

import { useState } from "react"
import Image from "next/image"
import { useCampaignStore } from "@/stores/campaignStore"
import { useCharacterStore, RACES, CLASSES, getRaceImagePath } from "@/stores/characterStore"

interface CampaignCreatorProps {
  onClose: () => void
}

export function CampaignCreator({ onClose }: CampaignCreatorProps) {
  const { addCampaign } = useCampaignStore()
  const { characters } = useCharacterStore()
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const getRaceName = (raceId: string) =>
    RACES.find((r) => r.id === raceId)?.name || raceId

  const getClassName = (classId: string) =>
    CLASSES.find((c) => c.id === classId)?.name || classId

  const toggleCharacter = (characterId: string) => {
    setSelectedCharacterIds((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter((id) => id !== characterId)
      }
      // Enforce max 4 characters
      if (prev.length >= 4) {
        return prev
      }
      return [...prev, characterId]
    })
  }

  const handleCreate = async () => {
    if (selectedCharacterIds.length === 0) return
    setLoading(true)
    await addCampaign(selectedCharacterIds)
    setLoading(false)
    onClose()
  }

  const canCreate = selectedCharacterIds.length >= 1 && selectedCharacterIds.length <= 4

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-tes-dark shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tes-gold/20 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-tes-gold">Start New Campaign</h2>
            <p className="text-sm text-tes-parchment/50">
              Select characters for your party
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-tes-parchment/50 hover:text-tes-parchment"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-tes-parchment/70">
              Select 1-4 characters for your party
            </p>
            <span className="text-sm text-tes-gold">
              {selectedCharacterIds.length}/4 selected
            </span>
          </div>

          {characters.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-tes-parchment/50">
                No characters available. Create characters first.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {characters.map((character) => {
                const isSelected = selectedCharacterIds.includes(character.id)
                const isDisabled = !isSelected && selectedCharacterIds.length >= 4

                return (
                  <button
                    key={character.id}
                    onClick={() => toggleCharacter(character.id)}
                    disabled={isDisabled}
                    className={`group overflow-hidden rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-tes-gold bg-tes-gold/10"
                        : isDisabled
                        ? "cursor-not-allowed border-transparent opacity-50"
                        : "border-transparent hover:border-tes-gold/50"
                    }`}
                  >
                    <div className="relative">
                      <Image
                        src={getRaceImagePath(character.race, character.raceVariant)}
                        alt={character.name}
                        width={200}
                        height={300}
                        className="h-40 w-full object-cover object-top"
                      />
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-tes-gold">
                          <span className="text-sm font-bold text-tes-dark">
                            {selectedCharacterIds.indexOf(character.id) + 1}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bg-tes-darker p-3">
                      <p className="truncate font-medium text-tes-parchment">
                        {character.name}
                      </p>
                      <p className="truncate text-xs text-tes-parchment/70">
                        {getRaceName(character.race)} {getClassName(character.classId)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-tes-gold/20 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded bg-tes-parchment/10 px-4 py-2 text-sm text-tes-parchment/70 hover:bg-tes-parchment/20"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate || loading}
            className="rounded bg-tes-gold/20 px-6 py-2 text-sm text-tes-gold hover:bg-tes-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  )
}
