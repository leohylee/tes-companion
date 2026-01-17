import { MapInfo, MapId } from "@/types"

export const maps: Record<MapId, MapInfo> = {
  "black-marsh": {
    id: "black-marsh",
    name: "Black Marsh",
    imagePath: "/maps/black-marsh.jpg",
    referenceImages: ["/references/black-marsh.png"],
  },
  "cyrodiil": {
    id: "cyrodiil",
    name: "Cyrodiil",
    imagePath: "/maps/cyrodiil.jpg",
    referenceImages: ["/references/cyrodiil-1.png", "/references/cyrodiil-2.png"],
  },
  "eastern-skyrim": {
    id: "eastern-skyrim",
    name: "Eastern Skyrim",
    imagePath: "/maps/eastern-skyrim.jpg",
    referenceImages: ["/references/skyrim.png"],
  },
  "high-rock": {
    id: "high-rock",
    name: "High Rock",
    imagePath: "/maps/high-rock.jpg",
    referenceImages: ["/references/high-rock.png"],
  },
  "morrowind": {
    id: "morrowind",
    name: "Morrowind",
    imagePath: "/maps/morrowind.jpg",
    referenceImages: ["/references/morrowind.png"],
  },
  "valenwood": {
    id: "valenwood",
    name: "Valenwood",
    imagePath: "/maps/valenwood.jpg",
    referenceImages: ["/references/valenwood-1.png", "/references/valenwood-2.png"],
  },
  "western-skyrim": {
    id: "western-skyrim",
    name: "Western Skyrim",
    imagePath: "/maps/western-skyrim.jpg",
    referenceImages: ["/references/skyrim.png"],
  },
}

export const mapList = Object.values(maps)

export const defaultTokenIcons = [
  { icon: "🏃", label: "Party" },
  { icon: "⚔️", label: "Combat" },
  { icon: "🏠", label: "Home" },
  { icon: "🎯", label: "Target" },
  { icon: "👤", label: "NPC" },
  { icon: "🐉", label: "Dragon" },
  { icon: "💀", label: "Enemy" },
  { icon: "🏰", label: "Castle" },
]

export const markerIcons: Record<string, string> = {
  visited: "✓",
  quest: "!",
  poi: "★",
  danger: "⚠",
  camp: "🏕",
}

export const dayColors = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#EAB308", // yellow
  "#F97316", // orange
  "#EF4444", // red
  "#A855F7", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F59E0B", // amber
]
