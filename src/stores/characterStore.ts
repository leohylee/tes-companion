"use client"

import { create } from "zustand"
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

interface ExtendedCharacterState extends CharacterState {
  loading: boolean
  error: string | null
}

interface ExtendedCharacterActions extends CharacterActions {
  fetchCharacters: () => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const initialState: ExtendedCharacterState = {
  characters: [],
  selectedCharacterId: null,
  loading: false,
  error: null,
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

export const useCharacterStore = create<ExtendedCharacterState & ExtendedCharacterActions>()(
  (set, get) => ({
    ...initialState,

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchCharacters: async () => {
      set({ loading: true, error: null })
      try {
        const res = await fetch("/api/characters")
        if (!res.ok) {
          throw new Error("Failed to fetch characters")
        }
        const characters = await res.json()
        set({ characters, loading: false })
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
      }
    },

    addCharacter: async (character) => {
      set({ loading: true, error: null })
      try {
        const res = await fetch("/api/characters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(character),
        })
        if (!res.ok) {
          throw new Error("Failed to create character")
        }
        const newCharacter = await res.json()
        set((state) => ({
          characters: [...state.characters, newCharacter],
          selectedCharacterId: newCharacter.id,
          loading: false,
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
      }
    },

    updateCharacter: async (id, updates) => {
      // Optimistic update
      const previousCharacters = get().characters
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }))

      try {
        const res = await fetch(`/api/characters/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        if (!res.ok) {
          throw new Error("Failed to update character")
        }
        const updatedCharacter = await res.json()
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? updatedCharacter : c
          ),
        }))
      } catch (error) {
        // Rollback on error
        set({ characters: previousCharacters, error: (error as Error).message })
      }
    },

    removeCharacter: async (id) => {
      // Optimistic update
      const previousState = {
        characters: get().characters,
        selectedCharacterId: get().selectedCharacterId,
      }
      set((state) => ({
        characters: state.characters.filter((c) => c.id !== id),
        selectedCharacterId:
          state.selectedCharacterId === id ? null : state.selectedCharacterId,
      }))

      try {
        const res = await fetch(`/api/characters/${id}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          throw new Error("Failed to delete character")
        }
      } catch (error) {
        // Rollback on error
        set({ ...previousState, error: (error as Error).message })
      }
    },

    selectCharacter: (id) => {
      set({ selectedCharacterId: id })
    },

    addSkill: async (characterId, skillId) => {
      const character = get().characters.find((c) => c.id === characterId)
      if (!character) return

      const newSkill: Skill = {
        id: skillId, // Use skillId as id
        skillId,
      }
      const updatedSkills = [...character.skills, newSkill]

      // Optimistic update
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId ? { ...c, skills: updatedSkills } : c
        ),
      }))

      try {
        const res = await fetch(`/api/characters/${characterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills: updatedSkills }),
        })
        if (!res.ok) {
          throw new Error("Failed to add skill")
        }
      } catch (error) {
        // Rollback - refetch characters
        get().fetchCharacters()
        set({ error: (error as Error).message })
      }
    },

    removeSkill: async (characterId, skillId) => {
      const character = get().characters.find((c) => c.id === characterId)
      if (!character) return

      const updatedSkills = character.skills.filter((s) => s.id !== skillId)

      // Optimistic update
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId ? { ...c, skills: updatedSkills } : c
        ),
      }))

      try {
        const res = await fetch(`/api/characters/${characterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills: updatedSkills }),
        })
        if (!res.ok) {
          throw new Error("Failed to remove skill")
        }
      } catch (error) {
        // Rollback - refetch characters
        get().fetchCharacters()
        set({ error: (error as Error).message })
      }
    },

    toggleMaster: async (characterId) => {
      const character = get().characters.find((c) => c.id === characterId)
      if (!character) return

      const newIsMaster = !character.isMaster

      // Optimistic update
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === characterId ? { ...c, isMaster: newIsMaster } : c
        ),
      }))

      try {
        const res = await fetch(`/api/characters/${characterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isMaster: newIsMaster }),
        })
        if (!res.ok) {
          throw new Error("Failed to toggle master")
        }
      } catch (error) {
        // Rollback - refetch characters
        get().fetchCharacters()
        set({ error: (error as Error).message })
      }
    },

    resetState: () => {
      set(initialState)
    },
  })
)
