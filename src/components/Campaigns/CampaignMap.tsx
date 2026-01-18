"use client"

import { useState, useEffect, useRef } from "react"
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"
import { Campaign, Token, Position, MapId } from "@/types"
import { useCampaignStore } from "@/stores/campaignStore"
import { maps } from "@/data/maps"
import { ReferenceImages } from "@/components/OverlandMap/ReferenceImages"

interface CampaignMapProps {
  campaign: Campaign
}

export function CampaignMap({ campaign }: CampaignMapProps) {
  const { updateCampaign } = useCampaignStore()
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Local state for map data
  const [localTokens, setLocalTokens] = useState<Token[]>(campaign.mapTokens || [])

  // Token creation state
  const [showTokenMenu, setShowTokenMenu] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [tokenLabel, setTokenLabel] = useState("")

  // Dragging state
  const [draggingToken, setDraggingToken] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Sync local state when switching campaigns
  useEffect(() => {
    setLocalTokens(campaign.mapTokens || [])
    setIsDirty(false)
  }, [campaign.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentMap = campaign.overland ? maps[campaign.overland as MapId] : null

  // Token handlers
  const handleAddToken = () => {
    if (!selectedIcon) return

    const newToken: Token = {
      id: `token-${Date.now()}`,
      position: { x: 50, y: 50 },
      icon: selectedIcon,
      label: tokenLabel || "Token",
      color: "#C9A959",
    }

    setLocalTokens([...localTokens, newToken])
    setShowTokenMenu(false)
    setSelectedIcon(null)
    setTokenLabel("")
    setIsDirty(true)
  }

  const handleRemoveToken = (tokenId: string) => {
    setLocalTokens(localTokens.filter((t) => t.id !== tokenId))
    setIsDirty(true)
  }

  const handleTokenMove = (tokenId: string, position: Position) => {
    setLocalTokens(
      localTokens.map((t) =>
        t.id === tokenId ? { ...t, position } : t
      )
    )
    setIsDirty(true)
  }

  // Token dragging
  const handleTokenMouseDown = (e: React.MouseEvent, tokenId: string) => {
    e.stopPropagation()
    e.preventDefault()
    setDraggingToken(tokenId)
    setDragOffset({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    if (!draggingToken) return

    const handleMouseMove = (e: MouseEvent) => {
      const token = localTokens.find((t) => t.id === draggingToken)
      if (!token) return

      const mapContainer = document.querySelector("[data-campaign-map-container]")
      if (!mapContainer) return

      const rect = mapContainer.getBoundingClientRect()
      const scale = transformRef.current?.instance?.transformState?.scale || 1

      const deltaX = (e.clientX - dragOffset.x) / scale
      const deltaY = (e.clientY - dragOffset.y) / scale

      const newX = token.position.x + (deltaX / rect.width) * 100
      const newY = token.position.y + (deltaY / rect.height) * 100

      const clampedX = Math.max(0, Math.min(100, newX))
      const clampedY = Math.max(0, Math.min(100, newY))

      handleTokenMove(draggingToken, { x: clampedX, y: clampedY })
      setDragOffset({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = () => {
      setDraggingToken(null)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [draggingToken, dragOffset, localTokens]) // eslint-disable-line react-hooks/exhaustive-deps

  // Save handler
  const handleSave = async () => {
    setSaving(true)
    try {
      await updateCampaign(campaign.id, {
        mapTokens: localTokens,
      })
      setIsDirty(false)
    } catch (error) {
      console.error("Failed to save map:", error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentMap) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg text-tes-parchment/70">No map selected</p>
          <p className="mt-2 text-sm text-tes-parchment/50">
            Select an Overland map in the Overview tab to use the campaign map.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Reference Images - Floating */}
      {currentMap.referenceImages && (
        <ReferenceImages images={currentMap.referenceImages} />
      )}

      {/* Control Panel - Top Right */}
      <div className="absolute right-4 top-4 z-20 w-72 rounded-lg bg-tes-dark/90 shadow-xl backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-tes-gold"
          >
            <span className="font-medium">Controls</span>
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isDirty
                ? "bg-tes-gold text-tes-dark hover:bg-tes-gold/90"
                : "bg-tes-gold/20 text-tes-gold/50 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : isDirty ? "Save" : "Saved"}
          </button>
        </div>

        {isExpanded && (
          <div className="border-t border-tes-gold/20 p-4">
            {/* Add Token */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-tes-parchment/70">Tokens</span>
                <button
                  onClick={() => setShowTokenMenu(!showTokenMenu)}
                  className="rounded bg-tes-gold/20 px-2 py-1 text-xs text-tes-gold hover:bg-tes-gold/30"
                >
                  + Add
                </button>
              </div>

              {showTokenMenu && (
                <div className="mb-2 rounded bg-tes-darker p-2">
                  {!selectedIcon ? (
                    <div className="flex flex-col items-center">
                      <p className="mb-2 text-xs text-tes-parchment/50">Select an icon:</p>
                      <EmojiPicker
                        onEmojiClick={(emojiData: EmojiClickData) => setSelectedIcon(emojiData.emoji)}
                        theme={Theme.DARK}
                        width="100%"
                        height={300}
                        searchPlaceHolder="Search emoji..."
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedIcon(null)}
                          className="text-2xl hover:scale-110 transition-transform"
                          title="Click to change"
                        >
                          {selectedIcon}
                        </button>
                        <input
                          type="text"
                          value={tokenLabel}
                          onChange={(e) => setTokenLabel(e.target.value)}
                          placeholder="Enter name..."
                          className="flex-1 rounded bg-tes-dark px-2 py-1 text-sm text-tes-parchment placeholder:text-tes-parchment/30 focus:outline-none focus:ring-1 focus:ring-tes-gold"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddToken()
                            if (e.key === "Escape") {
                              setShowTokenMenu(false)
                              setSelectedIcon(null)
                              setTokenLabel("")
                            }
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowTokenMenu(false)
                            setSelectedIcon(null)
                            setTokenLabel("")
                          }}
                          className="flex-1 rounded bg-tes-parchment/10 px-2 py-1 text-xs text-tes-parchment/70 hover:bg-tes-parchment/20"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddToken}
                          className="flex-1 rounded bg-tes-gold/20 px-2 py-1 text-xs text-tes-gold hover:bg-tes-gold/30"
                        >
                          Add
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Token List */}
              {localTokens.length > 0 && (
                <div className="space-y-1">
                  {localTokens.map((token) => (
                    <div
                      key={token.id}
                      className="flex items-center justify-between rounded bg-tes-darker px-2 py-1"
                    >
                      <span className="text-sm text-tes-parchment">
                        {token.icon} {token.label}
                      </span>
                      <button
                        onClick={() => handleRemoveToken(token.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Viewer */}
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
            contentClass="flex !h-full !w-full items-center justify-center"
          >
            <div
              className="relative inline-block"
              data-campaign-map-container
            >
              {/* Map Image */}
              <img
                src={currentMap.imagePath}
                alt={currentMap.name}
                className="block max-h-[90vh] max-w-full"
                draggable={false}
              />

              {/* Tokens Layer */}
              <div className="pointer-events-none absolute inset-0">
                {localTokens.map((token) => (
                  <div
                    key={token.id}
                    className={`token-draggable pointer-events-auto absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 bg-tes-dark/80 text-xl shadow-lg transition-transform select-none ${
                      draggingToken === token.id
                        ? "scale-110 cursor-grabbing"
                        : "hover:scale-110"
                    }`}
                    style={{
                      left: `${token.position.x}%`,
                      top: `${token.position.y}%`,
                      borderColor: token.color,
                    }}
                    title={token.label}
                    onMouseDown={(e) => handleTokenMouseDown(e, token.id)}
                  >
                    {token.icon}
                  </div>
                ))}
              </div>
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
    </div>
  )
}
