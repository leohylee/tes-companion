"use client"

import { create } from "zustand"
import { Campaign, CampaignState, CampaignActions } from "@/types"

interface ExtendedCampaignState extends CampaignState {
  loading: boolean
  error: string | null
}

interface ExtendedCampaignActions extends CampaignActions {
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const initialState: ExtendedCampaignState = {
  campaigns: [],
  selectedCampaignId: null,
  loading: false,
  error: null,
}

export const useCampaignStore = create<ExtendedCampaignState & ExtendedCampaignActions>()(
  (set, get) => ({
    ...initialState,

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchCampaigns: async () => {
      set({ loading: true, error: null })
      try {
        const res = await fetch("/api/campaigns")
        if (!res.ok) {
          throw new Error("Failed to fetch campaigns")
        }
        const campaigns = await res.json()
        // Ensure all campaigns have default values for new fields
        const normalizedCampaigns = campaigns.map((c: Campaign) => ({
          ...c,
          day: c.day || 1,
          partyXp: c.partyXp || 1,
          characterHp: c.characterHp || {},
          characterXp: c.characterXp || {},
          overland: c.overland || null,
          mapTokens: c.mapTokens || [],
          mapMarkers: c.mapMarkers || [],
          guild: c.guild || "",
          guildQuests: c.guildQuests || [],
          startDate: c.startDate || "",
          endDate: c.endDate || "",
          difficulty: c.difficulty || "",
          journal: c.journal || "",
        }))
        set({ campaigns: normalizedCampaigns, loading: false })
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
      }
    },

    addCampaign: async (characterIds) => {
      set({ loading: true, error: null })
      try {
        const res = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ characterIds }),
        })
        if (!res.ok) {
          throw new Error("Failed to create campaign")
        }
        const newCampaign = await res.json()
        set((state) => ({
          campaigns: [newCampaign, ...state.campaigns],
          selectedCampaignId: newCampaign.id,
          loading: false,
        }))
      } catch (error) {
        set({ error: (error as Error).message, loading: false })
      }
    },

    updateCampaign: async (id, updates) => {
      // Optimistic update
      const previousCampaigns = get().campaigns
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }))

      try {
        const res = await fetch(`/api/campaigns/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        if (!res.ok) {
          throw new Error("Failed to update campaign")
        }
        const updatedCampaign = await res.json()
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? updatedCampaign : c
          ),
        }))
      } catch (error) {
        // Rollback on error
        set({ campaigns: previousCampaigns, error: (error as Error).message })
      }
    },

    removeCampaign: async (id) => {
      // Optimistic update
      const previousState = {
        campaigns: get().campaigns,
        selectedCampaignId: get().selectedCampaignId,
      }
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
        selectedCampaignId:
          state.selectedCampaignId === id ? null : state.selectedCampaignId,
      }))

      try {
        const res = await fetch(`/api/campaigns/${id}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          throw new Error("Failed to delete campaign")
        }
      } catch (error) {
        // Rollback on error
        set({ ...previousState, error: (error as Error).message })
      }
    },

    selectCampaign: (id) => {
      set({ selectedCampaignId: id })
    },

    resetState: () => {
      set(initialState)
    },
  })
)
