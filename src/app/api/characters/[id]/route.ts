import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { connectDB } from "@/lib/db/connect"
import { Character } from "@/lib/db/models/Character"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/characters/[id] - Get single character
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await connectDB()

    const character = await Character.findOne({
      _id: id,
      userId: session.user.id,
    }).lean()

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 })
    }

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error fetching character:", error)
    return NextResponse.json(
      { error: "Failed to fetch character" },
      { status: 500 }
    )
  }
}

// PUT /api/characters/[id] - Update character
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    await connectDB()

    // Transform skills if present (convert from frontend format)
    if (updates.skills) {
      updates.skills = updates.skills.map((s: { skillId: string }) => ({
        skillId: s.skillId,
      }))
    }

    const character = await Character.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updates },
      { new: true }
    ).lean()

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 })
    }

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error updating character:", error)
    return NextResponse.json(
      { error: "Failed to update character" },
      { status: 500 }
    )
  }
}

// DELETE /api/characters/[id] - Delete character
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await connectDB()

    const result = await Character.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!result) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Character deleted" })
  } catch (error) {
    console.error("Error deleting character:", error)
    return NextResponse.json(
      { error: "Failed to delete character" },
      { status: 500 }
    )
  }
}
