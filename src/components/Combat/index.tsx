"use client"

import { useState, useRef } from "react"
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch"

type TabId = "rounds" | "enemy-skills"

const tabs: { id: TabId; name: string }[] = [
  { id: "rounds", name: "Rounds Reference" },
  { id: "enemy-skills", name: "Enemy Skills" },
]

export function Combat() {
  const [activeTab, setActiveTab] = useState<TabId>("rounds")

  return (
    <div className="flex h-full w-full flex-col bg-tes-darker">
      {/* Tabs */}
      <div className="flex border-b border-tes-gold/20 bg-tes-dark/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-tes-gold bg-tes-gold/10 text-tes-gold"
                : "text-tes-parchment/70 hover:bg-tes-gold/5 hover:text-tes-parchment"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "rounds" && <RoundsReference />}
        {activeTab === "enemy-skills" && <EnemySkillsReference />}
      </div>
    </div>
  )
}

// ============ ROUNDS REFERENCE ============
function RoundsReference() {
  const [startOfBattleOpen, setStartOfBattleOpen] = useState(false)

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold text-tes-gold">Combat Rounds</h2>

      <CollapsibleSection
        title="Start of Battle"
        isOpen={startOfBattleOpen}
        onToggle={() => setStartOfBattleOpen(!startOfBattleOpen)}
      >
        <BulletList
          items={[
            "Select First Player (cannot change during battle)",
            "Each Adventurer chooses initial Battle Form and which items to Ready (up to 4)",
            "Calculate EP (total XP × No of players). NOTE: EP in end-Session battle is fixed (p56)",
            <>
              <strong>Set up battle mat (p57). Note Battle Objective (p86):</strong>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li><strong>Conquer:</strong> remove all enemies</li>
                <li><strong>Eliminate X:</strong> remove the X enemy</li>
                <li><strong>Survey:</strong> Gather number of Skyshards (default 3) and successfully reach end of round to succeed</li>
                <li><strong>Uncover:</strong> As per Survey, but can choose to retreat at end of round or continue, and party gains 1XP per recovered Skyshard regardless of success or not (assuming at least one Adventurer survives)</li>
              </ul>
            </>,
          ]}
        />
      </CollapsibleSection>

      <div className="rounded-lg border border-tes-gold/20 bg-tes-dark/30 p-4">
        <NumberedList
          items={[
            {
              title: "Start of Round",
              content: (
                <BulletList
                  items={[
                    "Increase Round Counter by 1, or set to 1 if first round",
                    <>
                      <strong>If reached Fatigue Round:</strong>
                      <ul className="ml-4 mt-1 list-disc space-y-1">
                        <li>Each Adventurer adds 1 Overfatigue die to their Cooldown</li>
                        <li>Each Adventurer then receives 1 True Damage per Overfatigue die they have</li>
                      </ul>
                    </>,
                  ]}
                />
              ),
            },
            {
              title: "Adventurer Turns (first player, then clockwise)",
              content: (
                <BulletList
                  items={[
                    <><strong>Start of Turn</strong></>,
                    <><strong>Recovery</strong> – recover up to your Cooldown stat of dice from your Cooldown (overfatigue – cycle to end of Cooldown; other dice - discard / place back on mat)</>,
                    <>
                      <strong>Actions (in any order):</strong>
                      <ul className="ml-4 mt-1 list-disc space-y-1">
                        <li><strong>Move</strong> (up to Stamina stat). Can take a second Move only if no Engage actions taken</li>
                        <li>
                          <strong>Engage:</strong>
                          <ul className="ml-4 mt-1 list-disc space-y-1">
                            <li>Receive 1 light fatigue (skip if first engage of the turn; receive 2 if playing Expert level)</li>
                            <li>Choose Battle Form and weapon to use (if weapon items available) – also choose if to overtax</li>
                            <li>Declare Target</li>
                            <li>Gather & Roll Dice (Stamina stat limit +/− Magicka stat limit)</li>
                            <li>Resolve Dice: For each die, choose whether to use (p60) or simply exhaust if unused</li>
                            <li>Check for units' reactions</li>
                          </ul>
                        </li>
                        <li><strong>Class Abilities</strong> (once per ability). To change Battle Form costs 1 light fatigue</li>
                        <li><strong>Explore</strong> (Delve only. Cannot Explore and Move on same turn. Only 1 Explore per turn. Can't explore further if all Skyshards found)</li>
                      </ul>
                    </>,
                    <><strong>End of Turn</strong></>,
                  ]}
                />
              ),
            },
            {
              title: "Companion Turns (players choose order)",
              content: (
                <BulletList
                  items={[
                    "Move up to two hexes (players choose where to move)",
                    "Perform attacks & abilities",
                  ]}
                />
              ),
            },
            {
              title: "Enemy Turns (in order of Enemy level, highest first, players decide on ties)",
              content: (
                <BulletList
                  items={[
                    <><strong>Start of Turn</strong></>,
                    <><strong>Move</strong> up to 2 hexes towards nearest target</>,
                    <>
                      <strong>Engage Target(s):</strong>
                      <ul className="ml-4 mt-1 list-disc space-y-1">
                        <li>Determine Target(s)</li>
                        <li>Roll enemy combat dice</li>
                        <li>Resolve roll & skills against all targets. This may trigger Armour Item of target (choose to use / Overtax before applying damage) (Defeated Adventurer? See p67)</li>
                        <li>Units react</li>
                      </ul>
                    </>,
                    <><strong>End of Turn</strong></>,
                  ]}
                />
              ),
            },
            {
              title: "End of Round",
              content: (
                <BulletList
                  items={[
                    "If battle objectives complete, end battle",
                    "Can choose to Retreat (end battle) or exercise Guild Assist",
                  ]}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

// ============ ENEMY SKILLS REFERENCE ============
function EnemySkillsReference() {
  const [currentPage, setCurrentPage] = useState(0)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  const pages = [
    { id: 1, name: "Page 1", src: "/references/enemy-skills/enemy-skills-reference-p1.jpg" },
    { id: 2, name: "Page 2", src: "/references/enemy-skills/enemy-skills-reference-p2.jpg" },
  ]

  const handlePageChange = (index: number) => {
    setCurrentPage(index)
    transformRef.current?.resetTransform()
  }

  return (
    <div className="relative h-full w-full">
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

// ============ HELPER COMPONENTS ============
function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="mb-6 rounded-lg border border-tes-gold/20 bg-tes-dark/30">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="text-lg font-semibold text-tes-parchment">{title}</h3>
        <svg
          className={`h-5 w-5 text-tes-gold transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-tes-gold/10 px-4 py-3 text-sm text-tes-parchment/80">
          {children}
        </div>
      )}
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-lg font-semibold text-tes-parchment">{title}</h3>
      <div className="text-sm text-tes-parchment/80">{children}</div>
    </div>
  )
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  return (
    <ol className="ml-4 list-decimal space-y-4">
      {items.map((item, i) => (
        <li key={i}>
          <span className="font-semibold text-tes-gold">{item.title}</span>
          <div className="mt-1">{item.content}</div>
        </li>
      ))}
    </ol>
  )
}
