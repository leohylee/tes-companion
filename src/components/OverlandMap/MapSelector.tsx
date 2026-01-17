"use client"

import { useState } from "react"
import { useMapStore } from "@/stores/mapStore"
import { mapList } from "@/data/maps"

export function MapSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentMapId, setCurrentMap } = useMapStore()

  const currentMap = mapList.find((m) => m.id === currentMapId)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-tes-dark/90 px-4 py-2 text-tes-gold shadow-lg backdrop-blur transition hover:bg-tes-dark"
      >
        <span className="font-medium">{currentMap?.name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-tes-dark/95 py-2 shadow-xl backdrop-blur">
          {mapList.map((map) => (
            <button
              key={map.id}
              onClick={() => {
                setCurrentMap(map.id)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left transition hover:bg-tes-gold/20 ${
                map.id === currentMapId
                  ? "bg-tes-gold/10 text-tes-gold"
                  : "text-tes-parchment"
              }`}
            >
              {map.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
