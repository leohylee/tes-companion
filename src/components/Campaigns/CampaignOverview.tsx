"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Campaign, Character, MapId } from "@/types"
import { RACES, CLASSES, getRaceImagePath } from "@/stores/characterStore"
import { useCampaignStore } from "@/stores/campaignStore"
import { mapList } from "@/data/maps"

interface CampaignOverviewProps {
  campaign: Campaign
  characters: Character[]
}

export function CampaignOverview({ campaign, characters }: CampaignOverviewProps) {
  const { updateCampaign } = useCampaignStore()
  const [newQuest, setNewQuest] = useState("")
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Local state for all editable fields
  const [localGuild, setLocalGuild] = useState(campaign.guild || "")
  const [localOverland, setLocalOverland] = useState(campaign.overland || "")
  const [localDay, setLocalDay] = useState(campaign.day || 1)
  const [localPartyXp, setLocalPartyXp] = useState(campaign.partyXp || 1)
  const [localCharacterHp, setLocalCharacterHp] = useState<Record<string, number>>(campaign.characterHp || {})
  const [localCharacterXp, setLocalCharacterXp] = useState<Record<string, number>>(campaign.characterXp || {})
  const [localGuildQuests, setLocalGuildQuests] = useState<string[]>(campaign.guildQuests || [])

  // Sync local state only when switching campaigns
  useEffect(() => {
    setLocalGuild(campaign.guild || "")
    setLocalOverland(campaign.overland || "")
    setLocalDay(campaign.day || 1)
    setLocalPartyXp(campaign.partyXp || 1)
    setLocalCharacterHp(campaign.characterHp || {})
    setLocalCharacterXp(campaign.characterXp || {})
    setLocalGuildQuests(campaign.guildQuests || [])
    setIsDirty(false)
  }, [campaign.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const getRaceName = (raceId: string) =>
    RACES.find((r) => r.id === raceId)?.name || raceId

  const getClassName = (classId: string) =>
    CLASSES.find((c) => c.id === classId)?.name || classId

  // All handlers now only update local state
  const handleOverlandChange = (mapId: string) => {
    setLocalOverland(mapId)
    setIsDirty(true)
  }

  const handleGuildChange = (guild: string) => {
    setLocalGuild(guild)
    setIsDirty(true)
  }

  const handleDayChange = (delta: number) => {
    const newDay = Math.max(1, localDay + delta)
    setLocalDay(newDay)
    setIsDirty(true)
  }

  const handlePartyXpChange = (delta: number) => {
    const newXp = Math.max(1, localPartyXp + delta)
    setLocalPartyXp(newXp)
    setIsDirty(true)
  }

  const handleCharacterHpChange = (characterId: string, delta: number) => {
    const currentHp = localCharacterHp[characterId] || 0
    const newHp = Math.max(0, currentHp + delta)
    setLocalCharacterHp({ ...localCharacterHp, [characterId]: newHp })
    setIsDirty(true)
  }

  const handleCharacterXpChange = (characterId: string, delta: number) => {
    const currentXp = localCharacterXp[characterId] || 0
    const newXp = Math.max(0, currentXp + delta)
    setLocalCharacterXp({ ...localCharacterXp, [characterId]: newXp })
    setIsDirty(true)
  }

  const handleAddQuest = () => {
    if (newQuest.trim()) {
      setLocalGuildQuests([...localGuildQuests, newQuest.trim()])
      setNewQuest("")
      setIsDirty(true)
    }
  }

  const handleRemoveQuest = (index: number) => {
    setLocalGuildQuests(localGuildQuests.filter((_, i) => i !== index))
    setIsDirty(true)
  }

  // Save all changes to database
  const handleSave = async () => {
    setSaving(true)
    try {
      await updateCampaign(campaign.id, {
        day: localDay,
        partyXp: localPartyXp,
        characterHp: localCharacterHp,
        characterXp: localCharacterXp,
        overland: (localOverland || null) as MapId | null,
        guild: localGuild,
        guildQuests: localGuildQuests,
      })
      setIsDirty(false)
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header with Title and Save Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-tes-gold">{campaign.name}</h1>
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isDirty
              ? "bg-tes-gold text-tes-dark hover:bg-tes-gold/90"
              : "bg-tes-gold/20 text-tes-gold/50 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : isDirty ? "Save" : "Saved"}
        </button>
      </div>

      {/* Party Overview - Character Cards Grid */}
      <h2 className="mb-4 mt-6 text-xl font-semibold text-tes-gold">Party Members</h2>

      {characters.length === 0 ? (
        <p className="text-tes-parchment/50">No characters in this campaign</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30"
            >
              <Image
                src={getRaceImagePath(character.race, character.raceVariant)}
                alt={character.name}
                width={200}
                height={300}
                className="h-48 w-full object-cover object-top"
              />
              <div className="p-3">
                <h3 className="font-medium text-tes-parchment">{character.name}</h3>
                <p className="text-sm text-tes-parchment/70">
                  {getRaceName(character.race)} {getClassName(character.classId)}
                </p>
                {character.isMaster && (
                  <span className="mt-1 inline-block rounded bg-tes-gold/20 px-2 py-0.5 text-xs text-tes-gold">
                    Master
                  </span>
                )}
                <p className="mt-1 text-xs text-tes-parchment/50">
                  {character.skills.length} skill
                  {character.skills.length !== 1 ? "s" : ""}
                </p>
                {/* HP Tracker */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="w-8 text-xs text-tes-parchment/70">HP:</span>
                  <button
                    onClick={() => handleCharacterHpChange(character.id, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium text-tes-parchment">
                    {localCharacterHp[character.id] || 0}
                  </span>
                  <button
                    onClick={() => handleCharacterHpChange(character.id, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
                  >
                    +
                  </button>
                </div>
                {/* XP Tracker */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="w-8 text-xs text-tes-parchment/70">XP:</span>
                  <button
                    onClick={() => handleCharacterXpChange(character.id, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium text-tes-parchment">
                    {localCharacterXp[character.id] || 0}
                  </span>
                  <button
                    onClick={() => handleCharacterXpChange(character.id, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Horizontal Divider */}
      <hr className="my-8 border-tes-gold/20" />

      {/* Campaign Log */}
      <h2 className="mb-4 text-xl font-semibold text-tes-gold">Campaign Log</h2>

      <div className="space-y-4">
        {/* Day Tracker */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm text-tes-parchment/70">Day</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDayChange(-1)}
              disabled={localDay <= 1}
              className="flex h-8 w-8 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              -
            </button>
            <span className="min-w-[3rem] text-center text-lg font-medium text-tes-parchment">
              {localDay}
            </span>
            <button
              onClick={() => handleDayChange(1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
            >
              +
            </button>
          </div>
        </div>

        {/* Party XP Tracker */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm text-tes-parchment/70">Party XP</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePartyXpChange(-1)}
              disabled={localPartyXp <= 1}
              className="flex h-8 w-8 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              -
            </button>
            <span className="min-w-[3rem] text-center text-lg font-medium text-tes-parchment">
              {localPartyXp}
            </span>
            <button
              onClick={() => handlePartyXpChange(1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
            >
              +
            </button>
          </div>
        </div>

        {/* Overland */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm text-tes-parchment/70">Overland</label>
          <select
            value={localOverland}
            onChange={(e) => handleOverlandChange(e.target.value)}
            className="flex-1 rounded-lg border border-tes-gold/20 bg-tes-dark px-3 py-2 text-tes-parchment focus:border-tes-gold/50 focus:outline-none"
          >
            <option value="">Select a map...</option>
            {mapList.map((map) => (
              <option key={map.id} value={map.id}>
                {map.name}
              </option>
            ))}
          </select>
        </div>

        {/* Guild */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-sm text-tes-parchment/70">Guild</label>
          <input
            type="text"
            value={localGuild}
            onChange={(e) => handleGuildChange(e.target.value)}
            placeholder="Enter guild name..."
            className="flex-1 rounded-lg border border-tes-gold/20 bg-tes-dark px-3 py-2 text-tes-parchment placeholder-tes-parchment/30 focus:border-tes-gold/50 focus:outline-none"
          />
        </div>

        {/* Guild Quests */}
        <div className="flex items-start gap-4">
          <label className="w-24 pt-2 text-sm text-tes-parchment/70">Guild Quests</label>
          <div className="flex-1">
            {/* Quest List */}
            <div className="mb-2 flex flex-wrap gap-2">
              {localGuildQuests.map((quest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded bg-tes-gold/20 px-2 py-1"
                >
                  <span className="text-sm text-tes-gold">{quest}</span>
                  <button
                    onClick={() => handleRemoveQuest(index)}
                    className="ml-1 text-tes-gold/50 hover:text-tes-gold"
                  >
                    ×
                  </button>
                </div>
              ))}
              {localGuildQuests.length === 0 && (
                <span className="text-sm text-tes-parchment/30">No quests added</span>
              )}
            </div>

            {/* Add Quest Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuest}
                onChange={(e) => setNewQuest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddQuest()}
                placeholder="e.g. B1, C2, D3..."
                className="flex-1 rounded-lg border border-tes-gold/20 bg-tes-dark px-3 py-2 text-sm text-tes-parchment placeholder-tes-parchment/30 focus:border-tes-gold/50 focus:outline-none"
              />
              <button
                onClick={handleAddQuest}
                disabled={!newQuest.trim()}
                className="rounded-lg bg-tes-gold/20 px-3 py-2 text-sm text-tes-gold hover:bg-tes-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
