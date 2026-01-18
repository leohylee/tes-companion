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
import { Character, SkillId } from "@/types"

interface CharacterViewerProps {
  character: Character
}

// Fixed height for all images - remaining screen height minus header, labels, and footers
const IMAGE_HEIGHT_CLASS = "h-[calc(100vh-220px)]"
const SKILL_IMAGE_HEIGHT_CLASS = "h-[calc(100vh-280px)]" // Extra space for tabs and skill name

export function CharacterViewer({ character }: CharacterViewerProps) {
  const { addSkill, removeSkill, toggleMaster } = useCharacterStore()
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0)

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
  }

  const getSkillName = (skillId: SkillId) =>
    SKILLS.find((s) => s.id === skillId)?.name || skillId

  const currentSkill = character.skills[selectedSkillIndex]

  // Reset selected skill index if it's out of bounds
  if (selectedSkillIndex >= character.skills.length && character.skills.length > 0) {
    setSelectedSkillIndex(character.skills.length - 1)
  }

  return (
    <div className="h-full overflow-hidden">
      {/* Header with Name */}
      <div className="mb-4 px-6 pt-4">
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

      {/* Images Section - Horizontally scrollable */}
      <div className="overflow-x-auto px-6 pb-6">
        <div className="flex items-start gap-6">
          {/* Race Image */}
          <div className="shrink-0">
            <p className="mb-2 text-sm text-tes-parchment/50">Race</p>
            <div className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
              <Image
                src={getRaceImagePath(character.race, character.raceVariant)}
                alt={raceName}
                width={400}
                height={600}
                className={`${IMAGE_HEIGHT_CLASS} w-auto`}
              />
              <div className="bg-tes-dark/80 p-3">
                <p className="text-center font-medium text-tes-parchment">
                  {raceName}
                </p>
              </div>
            </div>
          </div>

          {/* Class Image */}
          <div className="shrink-0">
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
            <div className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
              <Image
                src={getClassImagePath(character.classId, character.isMaster)}
                alt={className}
                width={400}
                height={600}
                className={`${IMAGE_HEIGHT_CLASS} w-auto`}
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
          <div className="shrink-0">
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
              <div className={`flex ${SKILL_IMAGE_HEIGHT_CLASS} w-48 items-center justify-center rounded-lg border border-dashed border-tes-gold/30 bg-tes-dark/30`}>
                <p className="text-center text-sm text-tes-parchment/50">
                  No skills yet
                </p>
              </div>
            ) : (
              <div>
                {/* Current Skill Display */}
                {currentSkill && (
                  <>
                    {/* Skill Tabs */}
                    {character.skills.length > 1 && (
                      <div className="mb-2 flex gap-1 overflow-x-auto">
                        {character.skills.map((skill, index) => (
                          <button
                            key={skill.id}
                            onClick={() => setSelectedSkillIndex(index)}
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
                    <div className="flex gap-1">
                      {/* Page 1 */}
                      <div className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
                        <Image
                          src={getSkillImagePath(currentSkill.skillId, 1)}
                          alt={`${getSkillName(currentSkill.skillId)} - Page 1`}
                          width={400}
                          height={600}
                          className={`${SKILL_IMAGE_HEIGHT_CLASS} w-auto`}
                        />
                        <div className="bg-tes-dark/80 p-2">
                          <p className="text-center text-xs text-tes-parchment/50">
                            Page 1
                          </p>
                        </div>
                      </div>
                      {/* Page 2 */}
                      <div className="overflow-hidden rounded-lg border border-tes-gold/20 bg-tes-dark/30">
                        <Image
                          src={getSkillImagePath(currentSkill.skillId, 2)}
                          alt={`${getSkillName(currentSkill.skillId)} - Page 2`}
                          width={400}
                          height={600}
                          className={`${SKILL_IMAGE_HEIGHT_CLASS} w-auto`}
                        />
                        <div className="bg-tes-dark/80 p-2">
                          <p className="text-center text-xs text-tes-parchment/50">
                            Page 2
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-center text-sm font-medium text-tes-parchment">
                      {getSkillName(currentSkill.skillId)}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
