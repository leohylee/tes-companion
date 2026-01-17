"use client"

import { useState, useRef } from "react"
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch"

export function DayPhases() {
  const [showImage, setShowImage] = useState(true)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  return (
    <div className="flex h-full flex-col bg-tes-darker">
      {/* Toggle between image and text */}
      <div className="flex gap-2 border-b border-tes-gold/20 bg-tes-dark/50 p-2">
        <button
          onClick={() => setShowImage(true)}
          className={`rounded px-3 py-1.5 text-sm ${showImage ? "bg-tes-gold/20 text-tes-gold" : "text-tes-parchment/60 hover:text-tes-parchment"}`}
        >
          Quick Reference Image
        </button>
        <button
          onClick={() => setShowImage(false)}
          className={`rounded px-3 py-1.5 text-sm ${!showImage ? "bg-tes-gold/20 text-tes-gold" : "text-tes-parchment/60 hover:text-tes-parchment"}`}
        >
          Detailed Text
        </button>
      </div>

      {showImage ? (
        <div className="relative flex-1">
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
                src="/references/game-phases/game_phases_quick_reference.png"
                alt="Game Phases Quick Reference"
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
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <h2 className="mb-4 text-xl font-bold text-tes-gold">Day Phases</h2>

          <NumberedList
            items={[
              {
                title: "New Day Phase (p34)",
                content: (
                  <BulletList
                    items={[
                      "Increase day counter by 1. (If first day, set dial to 1 and do not increase)",
                      "In Sessions 1 and 2, the Campaign is failed if the Guild Quest is not completed by the end of day 12",
                    ]}
                  />
                ),
              },
              {
                title: "Overland Phase (p34) (not in Endgame, Session 3)",
                content: (
                  <BulletList
                    items={[
                      <><strong>Start of Phase.</strong> Complete any effects that trigger at this point</>,
                      <>
                        <strong>Move party.</strong> If it is day 1, you must stay in your starting town and resolve a town encounter
                        <ul className="ml-4 mt-1 list-disc space-y-1">
                          <li>Base movement of 3 hexes unless your province / other effect modifies this</li>
                          <li>You can move additional hexes at a cost of 1 fatigue for each party member per hex, up to your base overland movement</li>
                          <li>Encounters/landmarks will not stop your movement</li>
                          <li>Ending your movement on specific hexes will trigger an encounter. If you land on a spot that has multiple triggers, guild quest encounters take precedence, then side quest followed by towns or Overland encounters</li>
                        </ul>
                      </>,
                    ]}
                  />
                ),
              },
              {
                title: "Encounter Phase (not in Endgame. If on an empty hex at the end of movement, skip this phase)",
                content: (
                  <BulletList
                    items={[
                      "Guild quest encounters are dictated by your entry in your Gazetteer",
                      "Side quest encounters setup are dictated by your side quest card",
                      <>
                        <strong>Town icons</strong>, if present (not greyed out), trigger Town Encounters (p38). Each Adventurer takes up to 2 town actions:
                        <ul className="ml-4 mt-1 list-disc space-y-1">
                          <li><strong>SHOP</strong> – Take 1 of drawn item cards (draw as per town definition in Gazetteer)</li>
                          <li><strong>TRAIN</strong> – Take 1 of drawn skill lines (draw as per town definition in Gazetteer)</li>
                          <li><strong>INN</strong> – Heal to max HP. Clear whole cooldown, and recover all drained dice</li>
                          <li><strong>QUEST BOARD</strong> – Draw 2 side quests, choose up to 1. Discard unchosen (p48)</li>
                          <li><strong>GUILD KIOSK</strong> – Take unique guild town action (described on guild card)</li>
                          <li><strong>TOWN SQUARE</strong> – Specific to each town. Each Adventurer can trigger this action once per visit</li>
                          <li><strong>ALCHEMY STATION</strong> – Can refresh 1 expended potion item card (p29)</li>
                        </ul>
                      </>,
                      <>
                        <strong>Overland encounters</strong> (discard encounter card when complete):
                        <ul className="ml-4 mt-1 list-disc space-y-1">
                          <li><strong>Peaceful landmarks:</strong> draw a Peaceful encounter card</li>
                          <li><strong>Conflict landmarks:</strong> draw a Conflict encounter card</li>
                          <li><strong>Unstable landmarks:</strong> roll the unstable dice to determine the type of encounter
                            <ul className="ml-4 mt-1 list-disc space-y-1">
                              <li>Travelling Caravan result - generic town encounter (p38), caravan details in Gazetteer</li>
                              <li>Peaceful or Conflict result - draw corresponding card as normal but, if there are options, and one of the option's icon is inside a red circle, this indicates it is the unstable encounter result and must be taken</li>
                            </ul>
                          </li>
                        </ul>
                      </>,
                    ]}
                  />
                ),
              },
              {
                title: "Reward Phase (p43)",
                content: (
                  <BulletList
                    items={[
                      "Gain rewards from successful encounters (e.g. XP, items, keywords…). Increase XP dial if gained",
                      "If encounter at unstable landmark each player gains 2 Tenacity, success or fail",
                      "Untrain skills and skill lines (optional)",
                      "Gain advancements (usually by spending XP). Buy new dice for skill lines, Cooldown or Tenacity",
                      "Track quest progress, making any notes in the Party's Journal",
                    ]}
                  />
                ),
              },
              {
                title: "End of Day Phase (p45)",
                content: (
                  <BulletList
                    items={[
                      <>
                        <strong>Activate province effect</strong> (not in Endgame, Session 3). If the party had a peaceful encounter, reference the icon on the back of that encounter card. If not, draw the top peaceful encounter card and reference the icon on the bottom of the back of that card and place at the back of the peaceful deck. Refer to the Gazetteer to determine what that icon (or no icon) does in your current province
                      </>,
                      <>
                        <strong>Adventure rest:</strong>
                        <ul className="ml-4 mt-1 list-disc space-y-1">
                          <li>Heal and remove any dice from cooldown based on the difficulty (Apprentice: +2hp, -2 dice; Adept: +1hp, -1 die; Expert: as for Adept, but each Adventurer must discard an item to resolve this step. If a consumable item is discarded you can resolve the item's effect before discarding)</li>
                          <li>Exchange items between Adventurers (optional)</li>
                          <li>Can choose to exercise Guild Assist</li>
                        </ul>
                      </>,
                    ]}
                  />
                ),
              },
            ]}
          />
        </div>
      )}
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
