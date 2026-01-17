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
