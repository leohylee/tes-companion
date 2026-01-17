"use client"

import { useState, useRef } from "react"
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch"

const pages = [
  { id: 1, name: "Page 1", src: "/references/enemy-skills/enemy-skills-reference-p1.jpg" },
  { id: 2, name: "Page 2", src: "/references/enemy-skills/enemy-skills-reference-p2.jpg" },
]

export function EnemySkills() {
  const [currentPage, setCurrentPage] = useState(0)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  const handlePageChange = (index: number) => {
    setCurrentPage(index)
    transformRef.current?.resetTransform()
  }

  return (
    <div className="relative h-full w-full bg-tes-darker">
      {/* Page Tabs */}
      <div className="absolute left-4 top-4 z-20 flex gap-2">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => handlePageChange(index)}
            className={`rounded-lg px-4 py-2 text-sm font-medium shadow-lg backdrop-blur transition-colors ${
              currentPage === index
                ? "bg-tes-gold text-tes-darker"
                : "bg-tes-dark/90 text-tes-parchment hover:bg-tes-dark"
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Image Viewer */}
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
      >
        <TransformComponent
          wrapperClass="!h-full !w-full"
          contentClass="!h-full !w-full !flex !items-center !justify-center"
        >
          <img
            src={pages[currentPage].src}
            alt={pages[currentPage].name}
            className="max-h-full max-w-full object-contain"
            draggable={false}
          />
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

      {/* Page Navigation Arrows */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="rounded-lg bg-tes-dark/80 px-4 py-2 text-tes-gold hover:bg-tes-dark disabled:opacity-30"
        >
          ← Prev
        </button>
        <span className="flex items-center text-tes-parchment/70">
          {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage === pages.length - 1}
          className="rounded-lg bg-tes-dark/80 px-4 py-2 text-tes-gold hover:bg-tes-dark disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
