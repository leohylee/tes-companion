"use client"

import { useState } from "react"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"
import { useMapStore } from "@/stores/mapStore"

export function ControlPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTokenMenu, setShowTokenMenu] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [tokenLabel, setTokenLabel] = useState("")

  const {
    currentDay,
    tokens,
    addToken,
    nextDay,
    prevDay,
    removeToken,
  } = useMapStore()

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setSelectedIcon(emojiData.emoji)
  }

  const handleAddToken = () => {
    if (!selectedIcon) return

    addToken({
      position: { x: 50, y: 50 },
      icon: selectedIcon,
      label: tokenLabel || "Token",
      color: "#C9A959",
    })
    setShowTokenMenu(false)
    setSelectedIcon(null)
    setTokenLabel("")
  }

  const handleCancel = () => {
    setShowTokenMenu(false)
    setSelectedIcon(null)
    setTokenLabel("")
  }

  return (
    <div className="w-72 rounded-lg bg-tes-dark/90 shadow-xl backdrop-blur">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-tes-gold"
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

      {isExpanded && (
        <div className="border-t border-tes-gold/20 p-4">
          {/* Day Tracker */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-tes-parchment/70">Day</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevDay}
                  className="rounded bg-tes-gold/20 px-2 py-1 text-xs text-tes-gold hover:bg-tes-gold/30"
                >
                  −
                </button>
                <span className="min-w-[3rem] rounded bg-tes-gold/20 px-2 py-1 text-center font-bold text-tes-gold">
                  {currentDay}
                </span>
                <button
                  onClick={nextDay}
                  className="rounded bg-tes-gold/20 px-2 py-1 text-xs text-tes-gold hover:bg-tes-gold/30"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Tokens */}
          <div className="mb-4">
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
                      onEmojiClick={handleEmojiSelect}
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
                          if (e.key === "Escape") handleCancel()
                        }}
                      />
                    </div>
                    <p className="mb-2 text-xs text-tes-parchment/30">Click emoji to change</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
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

            {tokens.length > 0 && (
              <div className="space-y-1">
                {tokens.map((token) => (
                  <div
                    key={token.id}
                    className="flex items-center justify-between rounded bg-tes-darker px-2 py-1"
                  >
                    <span>
                      {token.icon} {token.label}
                    </span>
                    <button
                      onClick={() => removeToken(token.id)}
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
  )
}
