"use client"

export function CampaignStages() {
  return (
    <div className="h-full overflow-auto bg-tes-darker p-6">
      <h2 className="mb-4 text-xl font-bold text-tes-gold">Campaign Stages</h2>

      <SubSection title="Start of Session">
        <BulletList
          items={[
            "Adventurers start all sessions with full HP and no bonus HP, zero tenacity, no drained dice and nothing in Cooldown (retain items and stored XP from previous session)",
            "Select difficulty – this does not need to be the same difficulty as the previous sessions",
            "Re-create all card decks (common items, legendary items, side quests, delves, encounters) as per initial setup. The only things not reset are the Adventurer skill lines and dice, obtained items, the stored XP and the Cooldown stat",
            "Read initial Guild Quest in Gazetteer (Axx). Set Party Token on starting town location",
            "Day 1 – Must perform a Town Encounter at initial town. No Overland Move phase on Day 1",
            "Endgame (session 3) may have its own rules as defined in the Gazetteer",
          ]}
        />
      </SubSection>

      <SubSection title="Progress Through Session">
        <BulletList
          items={[
            "Focus on Guild Quest primarily. Progress Guild Quest as per details in Gazetteer",
            "Travel to Peaceful, Conflict and Unstable locations to complete Side / Guild Quests, to gain XP + Items",
            "Pick up Side Quests at towns and complete for XP",
            "Side Quests do not have to be completed, and can be discarded at any time (max 4 held at any time)",
            <>
              <strong>Gain Items</strong> – each Adventurer can have up to 4 Ready items and up to 8 Pack items at any time, but only 8 items max. Can swap between Ready and Pack at End of Day phase or at Start of Battle only
            </>,
            "During battle can only use Ready Items. At other times, can use Ready or Pack Items freely",
            "When new Item gained, even during battle, can put in Ready slot and move a different Item to Pack",
            "Can have multiple Weapon Items Ready, but must choose which to use per Engage step",
            "Can only have one Armour Item with particular Trait (body area) Ready at any time",
            "Weapons and Armour can be Overtaxed to give more benefit (both normal and Overtax ability are triggered in this case). After Overtaxing, Item is discarded",
          ]}
        />
      </SubSection>

      <SubSection title="End of Session">
        <BulletList
          items={[
            "Succeeding the full Guild Quest for the region by the end of day 12 ends the session",
            "Complete the day's Reward Phase, but skip the End of Day Phase",
            "Session 1: Read the Guild Quest's Epilogue. From the options presented, select the Session 2 Quest to determine the Session 2 province and Guild",
            "Session 2: Read the Guild Quest's Epilogue to introduce the Endgame. This will be in the same province as where Session 2 took place",
            "Discard all uncompleted Side Quests",
            "Discard all set-aside cards with persistent effects and cross out any logged persistent effects. Persistent effects last only for the session, unless stated",
            "Discard any pet cards that have HP chips on them",
            "Discard any active enchantment cards and expended items (e.g. empty potions). Any other Item cards are retained",
          ]}
        />
      </SubSection>

      <SubSection title="Guild Assist (once per campaign, not during Endgame) (p51)">
        <p className="mb-2 italic text-tes-parchment/60">Can be triggered either during a battle (at the end of a round), or during the End of Day Phase</p>

        <p className="mb-2 font-semibold text-tes-gold">Each Adventurer:</p>
        <BulletList
          items={[
            "Heal to full HP",
            "Remove all fatigue and status dice from the Cooldown",
            "Recover any number of exhausted or drained skill dice",
            "Draw one common and one legendary Item and keep both",
          ]}
        />

        <p className="mb-2 mt-4 font-semibold text-tes-gold">The party as a whole:</p>
        <BulletList
          items={[
            "If in battle, set round counter to any number",
            "If in battle, place any revived Adventurers on any unoccupied hex",
            "If out of battle, move party token up to 6 hexes on the overland map",
            'Add "Guild Assist" keyword to campaign journal',
            "CANNOT gain the keyword from the guild quest during this session",
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
