"use client"

import { useState, useCallback, useEffect } from "react"

interface ReferenceImagesProps {
  images: string[]
}

interface ImageState {
  isExpanded: boolean
  position: { x: number; y: number }
}

export function ReferenceImages({ images }: ReferenceImagesProps) {
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({})
  const [draggingImage, setDraggingImage] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Initialize positions for each image
  useEffect(() => {
    const initialStates: Record<string, ImageState> = {}
    images.forEach((img, index) => {
      if (!imageStates[img]) {
        initialStates[img] = {
          isExpanded: false,
          position: { x: 16, y: 80 + index * 60 },
        }
      }
    })
    if (Object.keys(initialStates).length > 0) {
      setImageStates((prev) => ({ ...prev, ...initialStates }))
    }
  }, [images])

  const toggleExpand = (imagePath: string) => {
    setImageStates((prev) => ({
      ...prev,
      [imagePath]: {
        ...prev[imagePath],
        isExpanded: !prev[imagePath]?.isExpanded,
      },
    }))
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, imagePath: string) => {
      if ((e.target as HTMLElement).closest("button")) return
      e.preventDefault()
      e.stopPropagation()

      setDraggingImage(imagePath)
      setDragOffset({
        x: e.clientX - (imageStates[imagePath]?.position.x || 0),
        y: e.clientY - (imageStates[imagePath]?.position.y || 0),
      })
    },
    [imageStates]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingImage) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      setImageStates((prev) => ({
        ...prev,
        [draggingImage]: {
          ...prev[draggingImage],
          position: { x: Math.max(0, newX), y: Math.max(0, newY) },
        },
      }))
    },
    [draggingImage, dragOffset]
  )

  const handleMouseUp = useCallback(() => {
    setDraggingImage(null)
  }, [])

  useEffect(() => {
    if (draggingImage) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggingImage, handleMouseMove, handleMouseUp])

  if (images.length === 0) return null

  return (
    <>
      {images.map((imagePath, index) => {
        const state = imageStates[imagePath] || {
          isExpanded: false,
          position: { x: 16, y: 80 + index * 60 },
        }
        const fileName = imagePath.split("/").pop()?.replace(".png", "") || `Reference ${index + 1}`

        return (
          <div
            key={imagePath}
            className={`fixed z-30 select-none rounded-lg bg-tes-dark/95 shadow-xl backdrop-blur transition-all ${
              draggingImage === imagePath ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              left: state.position.x,
              top: state.position.y,
              width: state.isExpanded ? "auto" : "48px",
              maxWidth: state.isExpanded ? "80vw" : "48px",
              maxHeight: state.isExpanded ? "80vh" : "48px",
            }}
            onMouseDown={(e) => handleMouseDown(e, imagePath)}
          >
            {/* Collapsed view - thumbnail */}
            {!state.isExpanded && (
              <button
                onClick={() => toggleExpand(imagePath)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-tes-gold/30 hover:border-tes-gold"
                title={`Expand ${fileName}`}
              >
                <img
                  src={imagePath}
                  alt={fileName}
                  className="h-10 w-10 rounded object-cover"
                  draggable={false}
                />
              </button>
            )}

            {/* Expanded view */}
            {state.isExpanded && (
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-tes-gold/20 px-3 py-2">
                  <span className="text-sm font-medium text-tes-gold">{fileName}</span>
                  <button
                    onClick={() => toggleExpand(imagePath)}
                    className="rounded p-1 text-tes-parchment/70 hover:bg-tes-gold/20 hover:text-tes-parchment"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Image */}
                <div className="overflow-auto p-2">
                  <img
                    src={imagePath}
                    alt={fileName}
                    className="max-h-[70vh] max-w-[75vw] rounded"
                    draggable={false}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
