"use client"

import { useState } from "react"
import Image from "next/image"
import {
  useCharacterStore,
  RACES,
  CLASSES,
  getRaceImagePath,
  getClassImagePath,
} from "@/stores/characterStore"
import { Character } from "@/types"

interface CharacterViewerProps {
  character: Character
}

export function CharacterViewer({ character }: CharacterViewerProps) {
  const { addSkill, removeSkill, toggleMaster } = useCharacterStore()
  const [newSkillName, setNewSkillName] = useState("")
  const [showAddSkill, setShowAddSkill] = useState(false)

  const raceName = RACES.find((r) => r.id === character.race)?.name || character.race
  const className = CLASSES.find((c) => c.id === character.classId)?.name || character.classId

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return
    addSkill(character.id, { name: newSkillName.trim() })
    setNewSkillName("")
    setShowAddSkill(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header with Name */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-tes-gold">{character.name}</h1>
        <p className="text-tes-parchment/70">
          {raceName} {className}
          {character.isMaster && (
            <span className="ml-2 rounded bg-tes-gold/20 px-2 py-0.5 text-xs text-tes-gold">
              Master
            </span>
          )}
        </p>
      </div>

      {/* Images Section */}
      <div className="mb-8 flex gap-6">
        {/* Race Image */}
        <div className="flex-1">
          <p className="mb-2 text-sm text-tes-parchment/50">Race</p>
          <div className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
            <Image
              src={getRaceImagePath(character.race, character.raceVariant)}
              alt={raceName}
              width={400}
              height={600}
              className="h-auto w-full"
            />
            <div className="bg-tes-dark/80 p-3">
              <p className="text-center font-medium text-tes-parchment">
                {raceName}
              </p>
            </div>
          </div>
        </div>

        {/* Class Image */}
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-tes-parchment/50">Class</p>
            <button
              onClick={() => toggleMaster(character.id)}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                character.isMaster
                  ? "bg-tes-gold text-tes-dark"
                  : "bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
              }`}
            >
              {character.isMaster ? "Master" : "Novice"}
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
            <Image
              src={getClassImagePath(character.classId, character.isMaster)}
              alt={className}
              width={400}
              height={600}
              className="h-auto w-full"
            />
            <div className="bg-tes-dark/80 p-3">
              <p className="text-center font-medium text-tes-parchment">
                {className}
                {character.isMaster && " (Master)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="rounded-lg border border-tes-gold/20 bg-tes-dark/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-tes-gold">Skills</h2>
          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="rounded bg-tes-gold/20 px-3 py-1 text-sm text-tes-gold hover:bg-tes-gold/30"
          >
            + Add Skill
          </button>
        </div>

        {/* Add Skill Form */}
        {showAddSkill && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Enter skill name..."
              className="flex-1 rounded bg-tes-darker px-3 py-2 text-sm text-tes-parchment placeholder:text-tes-parchment/30 focus:outline-none focus:ring-1 focus:ring-tes-gold"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSkill()
                if (e.key === "Escape") {
                  setShowAddSkill(false)
                  setNewSkillName("")
                }
              }}
            />
            <button
              onClick={() => {
                setShowAddSkill(false)
                setNewSkillName("")
              }}
              className="rounded bg-tes-parchment/10 px-3 py-2 text-sm text-tes-parchment/70 hover:bg-tes-parchment/20"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSkill}
              disabled={!newSkillName.trim()}
              className="rounded bg-tes-gold/20 px-4 py-2 text-sm text-tes-gold hover:bg-tes-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}

        {/* Skills List */}
        {character.skills.length === 0 ? (
          <p className="py-4 text-center text-sm text-tes-parchment/50">
            No skills learned yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {character.skills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-2 rounded bg-tes-darker px-3 py-2"
              >
                <span className="text-sm text-tes-parchment">{skill.name}</span>
                <button
                  onClick={() => removeSkill(character.id, skill.id)}
                  className="text-red-500/50 transition-colors hover:text-red-500 group-hover:text-red-500/80"
                  title="Remove skill"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
