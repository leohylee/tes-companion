"use client"

import { Marker } from "@/types"
import { markerIcons } from "@/data/maps"
import { useMapStore } from "@/stores/mapStore"

interface MarkerLayerProps {
  markers: Marker[]
}

const markerColors: Record<string, string> = {
  visited: "#22C55E",
  quest: "#EAB308",
  poi: "#3B82F6",
  danger: "#EF4444",
  camp: "#A855F7",
}

export function MarkerLayer({ markers }: MarkerLayerProps) {
  const { removeMarker } = useMapStore()

  return (
    <div className="pointer-events-none absolute inset-0">
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="pointer-events-auto absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-xs font-bold shadow-md transition-transform hover:scale-125"
          style={{
            left: `${marker.position.x}%`,
            top: `${marker.position.y}%`,
            backgroundColor: markerColors[marker.type] || "#888",
            color: "#000",
          }}
          title={marker.label || marker.type}
          onClick={(e) => {
            e.stopPropagation()
            removeMarker(marker.id)
          }}
        >
          {markerIcons[marker.type] || "•"}
        </div>
      ))}
    </div>
  )
}
