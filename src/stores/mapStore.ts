"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MapState, MapActions, MapId, Token, Marker } from "@/types"

const initialState: MapState = {
  currentMapId: "eastern-skyrim",
  tokens: [],
  markers: [],
  currentDay: 1,
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export const useMapStore = create<MapState & MapActions>()(
  persist(
    (set) => ({
      ...initialState,

      // Map selection
      setCurrentMap: (mapId: MapId) => {
        set({ currentMapId: mapId })
      },

      // Token management
      addToken: (token) => {
        const newToken: Token = {
          ...token,
          id: generateId(),
        }
        set((state) => ({
          tokens: [...state.tokens, newToken],
        }))
      },

      updateTokenPosition: (tokenId, position) => {
        set((state) => ({
          tokens: state.tokens.map((t) =>
            t.id === tokenId ? { ...t, position } : t
          ),
        }))
      },

      removeToken: (tokenId) => {
        set((state) => ({
          tokens: state.tokens.filter((t) => t.id !== tokenId),
        }))
      },

      updateToken: (tokenId, updates) => {
        set((state) => ({
          tokens: state.tokens.map((t) =>
            t.id === tokenId ? { ...t, ...updates } : t
          ),
        }))
      },

      // Marker management
      addMarker: (marker) => {
        const newMarker: Marker = {
          ...marker,
          id: generateId(),
        }
        set((state) => ({
          markers: [...state.markers, newMarker],
        }))
      },

      removeMarker: (markerId) => {
        set((state) => ({
          markers: state.markers.filter((m) => m.id !== markerId),
        }))
      },

      // Day tracking
      nextDay: () => {
        set((state) => ({
          currentDay: state.currentDay + 1,
        }))
      },

      prevDay: () => {
        set((state) => ({
          currentDay: Math.max(1, state.currentDay - 1),
        }))
      },

      setDay: (day) => {
        set({ currentDay: Math.max(1, day) })
      },

      // Reset
      resetState: () => {
        set(initialState)
      },
    }),
    {
      name: "tes-companion-map-store",
    }
  )
)
