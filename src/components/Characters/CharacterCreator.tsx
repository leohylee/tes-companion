"use client"

import { useState } from "react"
import Image from "next/image"
import {
  useCharacterStore,
  RACES,
  CLASSES,
  getRaceImagePath,
  getClassImagePath,
} from "@/stores/characterStore"
import { RaceId, ClassId, RaceVariant } from "@/types"

interface CharacterCreatorProps {
  onClose: () => void
}

export function CharacterCreator({ onClose }: CharacterCreatorProps) {
  const { addCharacter } = useCharacterStore()

  const [step, setStep] = useState<"name" | "race" | "class">("name")
  const [name, setName] = useState("")
  const [selectedRace, setSelectedRace] = useState<RaceId | null>(null)
  const [raceVariant, setRaceVariant] = useState<RaceVariant>(1)
  const [selectedClass, setSelectedClass] = useState<ClassId | null>(null)

  const handleCreate = () => {
    if (!name || !selectedRace || !selectedClass) return

    addCharacter({
      name,
      race: selectedRace,
      raceVariant,
      classId: selectedClass,
      isMaster: false,
      skills: [],
    })
    onClose()
  }

  const canProceed = () => {
    if (step === "name") return name.trim().length > 0
    if (step === "race") return selectedRace !== null
    if (step === "class") return selectedClass !== null
    return false
  }

  const handleNext = () => {
    if (step === "name" && canProceed()) setStep("race")
    else if (step === "race" && canProceed()) setStep("class")
    else if (step === "class" && canProceed()) handleCreate()
  }

  const handleBack = () => {
    if (step === "race") setStep("name")
    else if (step === "class") setStep("race")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-tes-dark shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tes-gold/20 px-6 py-4">
          <h2 className="text-xl font-bold text-tes-gold">Create Character</h2>
          <button
            onClick={onClose}
            className="text-tes-parchment/50 hover:text-tes-parchment"
          >
            ×
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-tes-gold/20 px-6 py-3">
          {["name", "race", "class"].map((s, i) => (
            <div
              key={s}
              className={`flex items-center ${i > 0 ? "ml-4" : ""}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  step === s
                    ? "bg-tes-gold text-tes-dark"
                    : s === "name" ||
                      (s === "race" && (step === "race" || step === "class")) ||
                      (s === "class" && step === "class")
                    ? "bg-tes-gold/30 text-tes-gold"
                    : "bg-tes-parchment/20 text-tes-parchment/50"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`ml-2 text-sm capitalize ${
                  step === s ? "text-tes-gold" : "text-tes-parchment/50"
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "name" && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-tes-parchment/70">
                  Character Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter character name..."
                  className="mt-1 w-full rounded bg-tes-darker px-4 py-3 text-lg text-tes-parchment placeholder:text-tes-parchment/30 focus:outline-none focus:ring-2 focus:ring-tes-gold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canProceed()) handleNext()
                  }}
                />
              </label>
            </div>
          )}

          {step === "race" && (
            <div>
              <p className="mb-4 text-sm text-tes-parchment/70">
                Select your race
              </p>
              <div className="grid grid-cols-5 gap-3">
                {RACES.map((race) => (
                  <button
                    key={race.id}
                    onClick={() => setSelectedRace(race.id)}
                    className={`group overflow-hidden rounded-lg border-2 transition-all ${
                      selectedRace === race.id
                        ? "border-tes-gold"
                        : "border-transparent hover:border-tes-gold/50"
                    }`}
                  >
                    <Image
                      src={getRaceImagePath(
                        race.id,
                        selectedRace === race.id ? raceVariant : 1
                      )}
                      alt={race.name}
                      width={200}
                      height={300}
                      className="h-auto w-full"
                    />
                    <div className="bg-black/60 p-2">
                      <p className="text-center text-xs font-medium text-tes-parchment">
                        {race.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Variant Selection */}
              {selectedRace && (
                <div className="mt-6">
                  <p className="mb-2 text-sm text-tes-parchment/70">
                    Choose variant
                  </p>
                  <div className="flex gap-2">
                    {([1, 2, 3, 4] as RaceVariant[]).map((v) => (
                      <button
                        key={v}
                        onClick={() => setRaceVariant(v)}
                        className={`overflow-hidden rounded border-2 transition-all ${
                          raceVariant === v
                            ? "border-tes-gold"
                            : "border-transparent hover:border-tes-gold/50"
                        }`}
                      >
                        <Image
                          src={getRaceImagePath(selectedRace, v)}
                          alt={`Variant ${v}`}
                          width={80}
                          height={120}
                          className="h-auto w-20"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "class" && (
            <div>
              <p className="mb-4 text-sm text-tes-parchment/70">
                Select your class
              </p>
              <div className="grid grid-cols-7 gap-3">
                {CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`group overflow-hidden rounded-lg border-2 transition-all ${
                      selectedClass === cls.id
                        ? "border-tes-gold"
                        : "border-transparent hover:border-tes-gold/50"
                    }`}
                  >
                    <Image
                      src={getClassImagePath(cls.id, false)}
                      alt={cls.name}
                      width={150}
                      height={225}
                      className="h-auto w-full"
                    />
                    <div className="bg-black/60 p-2">
                      <p className="text-center text-xs font-medium text-tes-parchment">
                        {cls.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-tes-gold/20 px-6 py-4">
          <button
            onClick={step === "name" ? onClose : handleBack}
            className="rounded bg-tes-parchment/10 px-4 py-2 text-sm text-tes-parchment/70 hover:bg-tes-parchment/20"
          >
            {step === "name" ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded bg-tes-gold/20 px-6 py-2 text-sm text-tes-gold hover:bg-tes-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === "class" ? "Create" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}
