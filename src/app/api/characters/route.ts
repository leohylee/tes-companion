import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { connectDB } from "@/lib/db/connect"
import { Character } from "@/lib/db/models/Character"

// GET /api/characters - List all characters for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const characters = await Character.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean()

    // Transform _id to id for frontend compatibility
    const transformedCharacters = characters.map((char) => ({
      id: char._id.toString(),
      name: char.name,
      race: char.race,
      raceVariant: char.raceVariant,
      classId: char.classId,
      isMaster: char.isMaster,
      skills: char.skills.map((s) => ({
        id: s.skillId, // Use skillId as id for simplicity
        skillId: s.skillId,
      })),
    }))

    return NextResponse.json(transformedCharacters)
  } catch (error) {
    console.error("Error fetching characters:", error)
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    )
  }
}

// POST /api/characters - Create a new character
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, race, raceVariant, classId, isMaster, skills } = body

    if (!name || !race || !classId) {
      return NextResponse.json(
        { error: "Name, race, and class are required" },
        { status: 400 }
      )
    }

    await connectDB()

    const character = await Character.create({
      userId: session.user.id,
      name,
      race,
      raceVariant: raceVariant || 1,
      classId,
      isMaster: isMaster || false,
      skills: skills || [],
    })

    return NextResponse.json(
      {
        id: character._id.toString(),
        name: character.name,
        race: character.race,
        raceVariant: character.raceVariant,
        classId: character.classId,
        isMaster: character.isMaster,
        skills: character.skills.map((s) => ({
          id: s.skillId,
          skillId: s.skillId,
        })),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating character:", error)
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 }
    )
  }
}
