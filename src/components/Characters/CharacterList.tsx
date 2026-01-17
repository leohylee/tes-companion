"use client"

import { useCharacterStore, RACES, CLASSES } from "@/stores/characterStore"

interface CharacterListProps {
  onCreateNew: () => void
}

export function CharacterList({ onCreateNew }: CharacterListProps) {
  const { characters, selectedCharacterId, selectCharacter, removeCharacter } =
    useCharacterStore()

  const getRaceName = (raceId: string) =>
    RACES.find((r) => r.id === raceId)?.name || raceId

  const getClassName = (classId: string) =>
    CLASSES.find((c) => c.id === classId)?.name || classId

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-tes-gold/20 px-4 py-3">
        <span className="font-medium text-tes-gold">Characters</span>
        <button
          onClick={onCreateNew}
          className="rounded bg-tes-gold/20 px-2 py-1 text-xs text-tes-gold hover:bg-tes-gold/30"
        >
          + New
        </button>
      </div>

      {/* Character List */}
      <div className="flex-1 overflow-auto p-2">
        {characters.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-tes-parchment/50">
            No characters yet
          </p>
        ) : (
          <div className="space-y-1">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => selectCharacter(character.id)}
                className={`group cursor-pointer rounded px-3 py-2 transition-colors ${
                  selectedCharacterId === character.id
                    ? "bg-tes-gold/20 text-tes-gold"
                    : "text-tes-parchment hover:bg-tes-gold/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{character.name}</p>
                    <p className="truncate text-xs opacity-70">
                      {getRaceName(character.race)} {getClassName(character.classId)}
                      {character.isMaster && " (Master)"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCharacter(character.id)
                    }}
                    className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
                    title="Delete character"
                  >
                    <span className="text-red-500 hover:text-red-400">×</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
