"use client"

import { useState, useCallback, useEffect, RefObject } from "react"
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { Token, Position } from "@/types"

interface TokenLayerProps {
  tokens: Token[]
  onTokenMove: (tokenId: string, position: Position) => void
  transformRef: RefObject<ReactZoomPanPinchRef | null>
}

export function TokenLayer({ tokens, onTokenMove, transformRef }: TokenLayerProps) {
  const [draggingToken, setDraggingToken] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, tokenId: string) => {
      e.stopPropagation()
      e.preventDefault()

      const token = tokens.find((t) => t.id === tokenId)
      if (!token) return

      // Calculate offset from token center to mouse position
      const rect = e.currentTarget.parentElement?.getBoundingClientRect()
      if (!rect) return

      setDraggingToken(tokenId)
      setDragOffset({
        x: e.clientX,
        y: e.clientY,
      })
    },
    [tokens]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingToken) return

      const token = tokens.find((t) => t.id === draggingToken)
      if (!token) return

      // Get the map container
      const mapContainer = document.querySelector('[data-map-container]')
      if (!mapContainer) return

      const rect = mapContainer.getBoundingClientRect()
      const scale = transformRef.current?.instance?.transformState?.scale || 1

      // Calculate new position as percentage
      const deltaX = (e.clientX - dragOffset.x) / scale
      const deltaY = (e.clientY - dragOffset.y) / scale

      const newX = token.position.x + (deltaX / rect.width) * 100
      const newY = token.position.y + (deltaY / rect.height) * 100

      // Clamp to map bounds
      const clampedX = Math.max(0, Math.min(100, newX))
      const clampedY = Math.max(0, Math.min(100, newY))

      onTokenMove(draggingToken, { x: clampedX, y: clampedY })
      setDragOffset({ x: e.clientX, y: e.clientY })
    },
    [draggingToken, dragOffset, tokens, onTokenMove, transformRef]
  )

  const handleMouseUp = useCallback(() => {
    setDraggingToken(null)
  }, [])

  useEffect(() => {
    if (draggingToken) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggingToken, handleMouseMove, handleMouseUp])

  return (
    <div className="pointer-events-none absolute inset-0" data-map-container>
      {tokens.map((token) => (
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
          onMouseDown={(e) => handleMouseDown(e, token.id)}
        >
          {token.icon}
        </div>
      ))}
    </div>
  )
}
