"use client"

import { MapViewer } from "./MapViewer"
import { ControlPanel } from "./ControlPanel"
import { MapSelector } from "./MapSelector"
import { ReferenceImages } from "./ReferenceImages"
import { useMapStore } from "@/stores/mapStore"
import { maps } from "@/data/maps"

export function OverlandMap() {
  const { currentMapId } = useMapStore()
  const currentMap = maps[currentMapId]

  return (
    <div className="relative h-full w-full bg-tes-darker">
      {/* Map Selector - Top Left */}
      <div className="absolute left-4 top-4 z-20">
        <MapSelector />
      </div>

      {/* Control Panel - Right Side */}
      <div className="absolute right-4 top-4 z-20">
        <ControlPanel />
      </div>

      {/* Reference Images - Floating */}
      {currentMap.referenceImages && (
        <ReferenceImages images={currentMap.referenceImages} />
      )}

      {/* Main Map Viewer */}
      <MapViewer />
    </div>
  )
}
