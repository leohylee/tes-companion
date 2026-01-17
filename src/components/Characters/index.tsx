"use client"

import { useState } from "react"
import { CharacterList } from "./CharacterList"
import { CharacterViewer } from "./CharacterViewer"
import { CharacterCreator } from "./CharacterCreator"
import { useCharacterStore } from "@/stores/characterStore"

export function Characters() {
  const [showCreator, setShowCreator] = useState(false)
  const { selectedCharacterId, characters } = useCharacterStore()

  const selectedCharacter = characters.find(
    (c) => c.id === selectedCharacterId
  )

  return (
    <div className="flex h-full w-full bg-tes-darker">
      {/* Character List - Left Side */}
      <div className="w-64 border-r border-tes-gold/20 bg-tes-dark/50">
        <CharacterList onCreateNew={() => setShowCreator(true)} />
      </div>

      {/* Main Content - Right Side */}
      <div className="flex-1 overflow-auto p-6">
        {selectedCharacter ? (
          <CharacterViewer character={selectedCharacter} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-tes-parchment/50">
                No character selected
              </p>
              <button
                onClick={() => setShowCreator(true)}
                className="mt-4 rounded bg-tes-gold/20 px-4 py-2 text-tes-gold hover:bg-tes-gold/30"
              >
                Create Character
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Character Creator Modal */}
      {showCreator && (
        <CharacterCreator onClose={() => setShowCreator(false)} />
      )}
    </div>
  )
}
