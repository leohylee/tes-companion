"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  CharacterState,
  CharacterActions,
  Character,
  Skill,
  RaceId,
  ClassId,
  RaceVariant,
  SkillId,
  SkillPage,
} from "@/types"

const initialState: CharacterState = {
  characters: [],
  selectedCharacterId: null,
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Race display names
export const RACES: { id: RaceId; name: string }[] = [
  { id: "argonian", name: "Argonian" },
  { id: "breton", name: "Breton" },
  { id: "dark-elf", name: "Dark Elf" },
  { id: "high-elf", name: "High Elf" },
  { id: "imperial", name: "Imperial" },
  { id: "khajiit", name: "Khajiit" },
  { id: "nord", name: "Nord" },
  { id: "orc", name: "Orc" },
  { id: "redguard", name: "Redguard" },
  { id: "wood-elf", name: "Wood Elf" },
]

// Class display names
export const CLASSES: { id: ClassId; name: string }[] = [
  { id: "acrobat", name: "Acrobat" },
  { id: "archer", name: "Archer" },
  { id: "bard", name: "Bard" },
  { id: "dragonknight", name: "Dragonknight" },
  { id: "healer", name: "Healer" },
  { id: "knight", name: "Knight" },
  { id: "necromancer", name: "Necromancer" },
  { id: "nightblade", name: "Nightblade" },
  { id: "pilgrim", name: "Pilgrim" },
  { id: "rogue", name: "Rogue" },
  { id: "scout", name: "Scout" },
  { id: "sorcerer", name: "Sorcerer" },
  { id: "spellsword", name: "Spellsword" },
  { id: "templar", name: "Templar" },
  { id: "warden", name: "Warden" },
]

// Helper functions to get image paths
export function getRaceImagePath(raceId: RaceId, variant: RaceVariant): string {
  return `/images/races/${raceId}-${variant}.png`
}

export function getClassImagePath(classId: ClassId, isMaster: boolean): string {
  return `/images/classes/${classId}-${isMaster ? "master" : "novice"}.png`
}

// Skill display names
export const SKILLS: { id: SkillId; name: string }[] = [
  { id: "acrobatics", name: "Acrobatics" },
  { id: "bow", name: "Bow" },
  { id: "daedric-summoning", name: "Daedric Summoning" },
  { id: "destruction-staff", name: "Destruction Staff" },
  { id: "heavy-armor", name: "Heavy Armor" },
  { id: "one-hand-and-shield", name: "One Hand and Shield" },
  { id: "restoring-light", name: "Restoring Light" },
  { id: "shadow", name: "Shadow" },
  { id: "speech", name: "Speech" },
  { id: "two-handed", name: "Two Handed" },
]

export function getSkillImagePath(skillId: SkillId, page: SkillPage): string {
  return `/images/skills/${skillId}-${page}.png`
}

export const useCharacterStore = create<CharacterState & CharacterActions>()(
  persist(
    (set) => ({
      ...initialState,

      addCharacter: (character) => {
        const newCharacter: Character = {
          ...character,
          id: generateId(),
        }
        set((state) => ({
          characters: [...state.characters, newCharacter],
          selectedCharacterId: newCharacter.id,
        }))
      },

      updateCharacter: (id, updates) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }))
      },

      removeCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
          selectedCharacterId:
            state.selectedCharacterId === id ? null : state.selectedCharacterId,
        }))
      },

      selectCharacter: (id) => {
        set({ selectedCharacterId: id })
      },

      addSkill: (characterId, skillId) => {
        const newSkill: Skill = {
          id: generateId(),
          skillId,
        }
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === characterId
              ? { ...c, skills: [...c.skills, newSkill] }
              : c
          ),
        }))
      },

      removeSkill: (characterId, skillId) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === characterId
              ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) }
              : c
          ),
        }))
      },

      toggleMaster: (characterId) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === characterId ? { ...c, isMaster: !c.isMaster } : c
          ),
        }))
      },

      resetState: () => {
        set(initialState)
      },
    }),
    {
      name: "tes-companion-character-store",
    }
  )
)
