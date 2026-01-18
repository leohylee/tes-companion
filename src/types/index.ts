export type MapId =
  | "black-marsh"
  | "cyrodiil"
  | "eastern-skyrim"
  | "high-rock"
  | "morrowind"
  | "valenwood"
  | "western-skyrim"

export interface MapInfo {
  id: MapId
  name: string
  imagePath: string
  referenceImages?: string[]
}

export interface Position {
  x: number
  y: number
}

export interface Token {
  id: string
  position: Position
  icon: string
  label: string
  color: string
}

export interface Marker {
  id: string
  position: Position
  type: MarkerType
  label?: string
}

export type MarkerType = "visited" | "quest" | "poi" | "danger" | "camp"

export interface MapState {
  currentMapId: MapId
  tokens: Token[]
  markers: Marker[]
  currentDay: number
}

export interface MapActions {
  // Map selection
  setCurrentMap: (mapId: MapId) => void

  // Token management
  addToken: (token: Omit<Token, "id">) => void
  updateTokenPosition: (tokenId: string, position: Position) => void
  removeToken: (tokenId: string) => void
  updateToken: (tokenId: string, updates: Partial<Token>) => void

  // Marker management
  addMarker: (marker: Omit<Marker, "id">) => void
  removeMarker: (markerId: string) => void

  // Day tracking
  nextDay: () => void
  prevDay: () => void
  setDay: (day: number) => void

  // Persistence
  resetState: () => void
}

// Character Types
export type RaceId =
  | "argonian"
  | "breton"
  | "dark-elf"
  | "high-elf"
  | "imperial"
  | "khajiit"
  | "nord"
  | "orc"
  | "redguard"
  | "wood-elf"

export type ClassId =
  | "acrobat"
  | "archer"
  | "bard"
  | "dragonknight"
  | "healer"
  | "knight"
  | "necromancer"
  | "nightblade"
  | "pilgrim"
  | "rogue"
  | "scout"
  | "sorcerer"
  | "spellsword"
  | "templar"
  | "warden"

export type RaceVariant = 1 | 2 | 3 | 4

export interface Race {
  id: RaceId
  name: string
}

export interface CharacterClass {
  id: ClassId
  name: string
}

export type SkillId =
  | "acrobatics"
  | "bow"
  | "daedric-summoning"
  | "destruction-staff"
  | "heavy-armor"
  | "one-hand-and-shield"
  | "restoring-light"
  | "shadow"
  | "speech"
  | "two-handed"

export type SkillPage = 1 | 2

export interface Skill {
  id: string
  skillId: SkillId
}

export interface Character {
  id: string
  name: string
  race: RaceId
  raceVariant: RaceVariant
  classId: ClassId
  isMaster: boolean
  skills: Skill[]
}

export interface CharacterState {
  characters: Character[]
  selectedCharacterId: string | null
}

export interface CharacterActions {
  addCharacter: (character: Omit<Character, "id">) => void
  updateCharacter: (id: string, updates: Partial<Omit<Character, "id">>) => void
  removeCharacter: (id: string) => void
  selectCharacter: (id: string | null) => void
  addSkill: (characterId: string, skillId: SkillId) => void
  removeSkill: (characterId: string, skillId: string) => void
  toggleMaster: (characterId: string) => void
  resetState: () => void
}

// Campaign Types
export interface Campaign {
  id: string
  number: number
  name: string
  characterIds: string[]
  day: number
  partyXp: number
  characterHp: Record<string, number>
  characterXp: Record<string, number>
  overland: MapId | null
  guild: string
  guildQuests: string[]
  createdAt: number
}

export interface CampaignState {
  campaigns: Campaign[]
  selectedCampaignId: string | null
}

export interface CampaignActions {
  fetchCampaigns: () => Promise<void>
  addCampaign: (characterIds: string[]) => Promise<void>
  updateCampaign: (id: string, updates: Partial<Omit<Campaign, "id" | "number">>) => Promise<void>
  removeCampaign: (id: string) => Promise<void>
  selectCampaign: (id: string | null) => void
  resetState: () => void
}
