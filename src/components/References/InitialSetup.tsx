"use client"

export function InitialSetup() {
  return (
    <div className="h-full overflow-auto bg-tes-darker p-6">
      <h2 className="mb-4 text-xl font-bold text-tes-gold">Initial Game Setup</h2>

      <SubSection title="Setup Components (p12)">
        <BulletList
          items={[
            "Select one province. Place appropriate overland map & Gazetteer",
            "Add all general and all province specific enemies to bags",
            "Add Skill lines to Skill bag. If playing true solo, remove duplicates",
            <>
              <strong>Create overland decks:</strong>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Add all 8 province specific Peaceful encounter cards to 4 randomly selected General Peaceful encounter cards and shuffle to form the Peaceful encounter deck</li>
                <li>Add all 8 province specific Conflict encounter cards to 4 randomly selected General Conflict encounter cards and shuffle to form the Conflict encounter deck</li>
              </ul>
            </>,
            <>
              <strong>Delve deck:</strong>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Set aside any special province specific delve cards labelled "SP-" (the Gazetteer "Delve Feature" section will explain how and when these cards are used)</li>
                <li>Shuffle all general delve cards + other province specific delve cards to form Delve deck</li>
              </ul>
            </>,
            "Shuffle all Common Item cards and shuffle all Legendary Item cards to form separate Item decks",
            "Set party XP dial to 2 (or 1 if playing Jailbreak scenario to start), and leave Day dial unset for now",
          ]}
        />
      </SubSection>

      <SubSection title="Create Adventurers (p13 & p19)">
        <BulletList
          items={[
            "Select Party Difficulty level: Apprentice, Adept, Expert",
            <>
              <strong>Each player selects the following:</strong>
              <ul className="ml-4 mt-1 list-disc space-y-1">
                <li>Race sheet of their choosing and the corresponding race chip</li>
                <li>Combat Skill line card and combat skill token</li>
                <li>One starting Skill line card (and corresponding circular skill token) of their choosing and 2 first level skill dice of that skill</li>
                <li>
                  <strong>Player mat, adding the following:</strong>
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li>Circular Health, Stamina, Magicka and Combat tokens. Add square tokens next to Stamina and Magicka based on stats on race sheet. Set Health token to correct value based on race health stat</li>
                    <li>Add Health chips under adventure chip equal to race health stat</li>
                    <li>Add number of Combat skill dice based on race combat stat</li>
                    <li>Peg in Cooldown based on race cooldown stat</li>
                    <li>Pegs in 0 on both Experience and Tenacity tracks</li>
                    <li>Peg in Battle Form (choose any, but probably matching starting skill battle form)</li>
                  </ul>
                </li>
                <li>Select a Class sheet - possibly play through the Jailbreak scenario to limit class selection if desired</li>
              </ul>
            </>,
          ]}
        />
      </SubSection>

      <SubSection title="Select a Guild Quest (p13)">
        <BulletList
          items={[
            "Randomly select 3 guild cards. Review the short description on each card and, if desired, the quest session snapshot of each quest in the initial province Gazetteer (quest complexity & general description). Select a single guild.",
          ]}
        />
      </SubSection>
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
