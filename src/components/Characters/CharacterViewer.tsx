"use client"

import { useState } from "react"
import Image from "next/image"
import {
  useCharacterStore,
  RACES,
  CLASSES,
  SKILLS,
  getRaceImagePath,
  getClassImagePath,
  getSkillImagePath,
} from "@/stores/characterStore"
import { Character, SkillId, SkillPage } from "@/types"

interface CharacterViewerProps {
  character: Character
}

export function CharacterViewer({ character }: CharacterViewerProps) {
  const { addSkill, removeSkill, toggleMaster } = useCharacterStore()
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0)
  const [skillPage, setSkillPage] = useState<SkillPage>(1)

  const raceName = RACES.find((r) => r.id === character.race)?.name || character.race
  const className = CLASSES.find((c) => c.id === character.classId)?.name || character.classId

  // Get skills the character doesn't have yet
  const availableSkills = SKILLS.filter(
    (skill) => !character.skills.some((s) => s.skillId === skill.id)
  )

  const handleAddSkill = (skillId: SkillId) => {
    addSkill(character.id, skillId)
    setShowAddSkill(false)
    // Select the newly added skill
    setSelectedSkillIndex(character.skills.length)
    setSkillPage(1)
  }

  const getSkillName = (skillId: SkillId) =>
    SKILLS.find((s) => s.id === skillId)?.name || skillId

  const currentSkill = character.skills[selectedSkillIndex]

  // Reset selected skill index if it's out of bounds
  if (selectedSkillIndex >= character.skills.length && character.skills.length > 0) {
    setSelectedSkillIndex(character.skills.length - 1)
  }

  return (
    <div className="mx-auto max-w-6xl">
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

      {/* Images Section - Race, Class, and Skill side by side */}
      <div className="flex items-start gap-6">
        {/* Race Image */}
        <div>
          <p className="mb-2 text-sm text-tes-parchment/50">Race</p>
          <div className="inline-block overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
            <Image
              src={getRaceImagePath(character.race, character.raceVariant)}
              alt={raceName}
              width={400}
              height={600}
              className="max-h-[calc(100vh-250px)] w-auto"
            />
            <div className="bg-tes-dark/80 p-3">
              <p className="text-center font-medium text-tes-parchment">
                {raceName}
              </p>
            </div>
          </div>
        </div>

        {/* Class Image */}
        <div>
          <div className="mb-2 flex items-center gap-2">
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
          <div className="inline-block overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
            <Image
              src={getClassImagePath(character.classId, character.isMaster)}
              alt={className}
              width={400}
              height={600}
              className="max-h-[calc(100vh-250px)] w-auto"
            />
            <div className="bg-tes-dark/80 p-3">
              <p className="text-center font-medium text-tes-parchment">
                {className}
                {character.isMaster && " (Master)"}
              </p>
            </div>
          </div>
        </div>

        {/* Skill Section */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <p className="text-sm text-tes-parchment/50">Skill</p>
            {availableSkills.length > 0 && (
              <button
                onClick={() => setShowAddSkill(!showAddSkill)}
                className="rounded bg-tes-gold/20 px-2 py-1 text-xs text-tes-gold hover:bg-tes-gold/30"
              >
                + Add
              </button>
            )}
            {currentSkill && (
              <button
                onClick={() => {
                  removeSkill(character.id, currentSkill.id)
                  if (selectedSkillIndex > 0) {
                    setSelectedSkillIndex(selectedSkillIndex - 1)
                  }
                  setSkillPage(1)
                }}
                className="rounded bg-red-600/20 px-2 py-1 text-xs text-red-400 hover:bg-red-600/30"
              >
                Remove
              </button>
            )}
          </div>

          {/* Add Skill Modal */}
          {showAddSkill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-lg bg-tes-dark p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-tes-gold">Select a skill to learn</h3>
                  <button
                    onClick={() => setShowAddSkill(false)}
                    className="text-tes-parchment/50 hover:text-tes-parchment"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => handleAddSkill(skill.id)}
                      className="group overflow-hidden rounded-lg border-2 border-transparent bg-tes-darker transition-all hover:border-tes-gold/50"
                    >
                      <Image
                        src={getSkillImagePath(skill.id, 1)}
                        alt={skill.name}
                        width={150}
                        height={200}
                        className="h-auto w-full"
                      />
                      <div className="p-2">
                        <p className="text-center text-xs text-tes-parchment">
                          {skill.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {character.skills.length === 0 ? (
            <div className="flex min-h-[calc(100vh-250px)] w-48 items-center justify-center rounded-lg border border-dashed border-tes-gold/30 bg-tes-dark/30">
              <p className="text-center text-sm text-tes-parchment/50">
                No skills yet
              </p>
            </div>
          ) : (
            <div className="inline-flex flex-col">
              {/* Current Skill Display */}
              {currentSkill && (
                <>
                  {/* Skill Tabs */}
                  {character.skills.length > 1 && (
                    <div className="mb-2 flex w-0 min-w-full gap-1 overflow-x-auto">
                      {character.skills.map((skill, index) => (
                        <button
                          key={skill.id}
                          onClick={() => {
                            setSelectedSkillIndex(index)
                            setSkillPage(1)
                          }}
                          className={`whitespace-nowrap rounded px-2 py-1 text-xs transition-colors ${
                            selectedSkillIndex === index
                              ? "bg-tes-gold text-tes-dark"
                              : "bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
                          }`}
                        >
                          {getSkillName(skill.skillId)}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
                  <Image
                    src={getSkillImagePath(currentSkill.skillId, skillPage)}
                    alt={getSkillName(currentSkill.skillId)}
                    width={400}
                    height={600}
                    className={`w-auto ${character.skills.length > 1 ? "max-h-[calc(100vh-320px)]" : "max-h-[calc(100vh-290px)]"}`}
                  />
                  <div className="bg-tes-dark/80 p-3">
                    <p className="text-center font-medium text-tes-parchment">
                      {getSkillName(currentSkill.skillId)}
                    </p>
                    {/* Page Navigation */}
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSkillPage(1)}
                        disabled={skillPage === 1}
                        className={`rounded px-2 py-1 text-xs transition-colors ${
                          skillPage === 1
                            ? "bg-tes-gold/10 text-tes-parchment/30"
                            : "bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
                        }`}
                      >
                        ← Page 1
                      </button>
                      <span className="text-xs text-tes-parchment/50">
                        {skillPage} / 2
                      </span>
                      <button
                        onClick={() => setSkillPage(2)}
                        disabled={skillPage === 2}
                        className={`rounded px-2 py-1 text-xs transition-colors ${
                          skillPage === 2
                            ? "bg-tes-gold/10 text-tes-parchment/30"
                            : "bg-tes-gold/20 text-tes-gold hover:bg-tes-gold/30"
                        }`}
                      >
                        Page 2 →
                      </button>
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
