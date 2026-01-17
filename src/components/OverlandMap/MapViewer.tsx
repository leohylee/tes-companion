"use client"

import { useRef } from "react"
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch"
import { useMapStore } from "@/stores/mapStore"
import { maps } from "@/data/maps"
import { TokenLayer } from "./TokenLayer"
import { MarkerLayer } from "./MarkerLayer"

export function MapViewer() {
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  const {
    currentMapId,
    tokens,
    markers,
    updateTokenPosition,
    addMarker,
  } = useMapStore()

  const currentMap = maps[currentMapId]

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    addMarker({ position: { x, y }, type: "visited" })
  }

  return (
    <div className="h-full w-full">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        doubleClick={{ disabled: true }}
        panning={{ excluded: ["token-draggable"] }}
      >
        <TransformComponent
          wrapperClass="!h-full !w-full"
          contentClass="!h-full !w-full"
        >
          <div
            className="relative h-full w-full"
            onDoubleClick={handleDoubleClick}
          >
            {/* Map Image */}
            <img
              src={currentMap.imagePath}
              alt={currentMap.name}
              className="h-full w-full object-contain"
              draggable={false}
            />

            {/* Markers Layer */}
            <MarkerLayer markers={markers} />

            {/* Tokens Layer */}
            <TokenLayer
              tokens={tokens}
              onTokenMove={updateTokenPosition}
              transformRef={transformRef}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => transformRef.current?.zoomIn()}
          className="rounded bg-tes-dark/80 px-3 py-2 text-tes-gold hover:bg-tes-dark"
        >
          +
        </button>
        <button
          onClick={() => transformRef.current?.zoomOut()}
          className="rounded bg-tes-dark/80 px-3 py-2 text-tes-gold hover:bg-tes-dark"
        >
          −
        </button>
        <button
          onClick={() => transformRef.current?.resetTransform()}
          className="rounded bg-tes-dark/80 px-3 py-2 text-xs text-tes-gold hover:bg-tes-dark"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
