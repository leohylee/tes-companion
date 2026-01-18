import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { connectDB } from "@/lib/db/connect"
import { Campaign } from "@/lib/db/models/Campaign"
import { Character } from "@/lib/db/models/Character"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/campaigns/[id] - Get single campaign with populated characters
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await connectDB()

    const campaign = await Campaign.findOne({
      _id: id,
      userId: session.user.id,
    }).lean()

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Fetch the characters for this campaign
    const characters = await Character.find({
      _id: { $in: campaign.characterIds },
      userId: session.user.id,
    }).lean()

    const transformedCharacters = characters.map((char) => ({
      id: char._id.toString(),
      name: char.name,
      race: char.race,
      raceVariant: char.raceVariant,
      classId: char.classId,
      isMaster: char.isMaster,
      skills: char.skills.map((s) => ({
        id: s.skillId,
        skillId: s.skillId,
      })),
    }))

    return NextResponse.json({
      id: campaign._id.toString(),
      number: campaign.number,
      name: campaign.name,
      characterIds: campaign.characterIds.map((id) => id.toString()),
      day: campaign.day || 1,
      partyXp: campaign.partyXp || 1,
      characterHp: campaign.characterHp || {},
      characterXp: campaign.characterXp || {},
      overland: campaign.overland || null,
      mapTokens: campaign.mapTokens || [],
      mapMarkers: campaign.mapMarkers || [],
      guild: campaign.guild || "",
      guildQuests: campaign.guildQuests || [],
      startDate: campaign.startDate || "",
      endDate: campaign.endDate || "",
      difficulty: campaign.difficulty || "",
      journal: campaign.journal || "",
      characters: transformedCharacters,
      createdAt: campaign.createdAt?.getTime() || Date.now(),
    })
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    )
  }
}

// PUT /api/campaigns/[id] - Update campaign
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    console.log("PUT /api/campaigns/[id] - Received updates:", JSON.stringify(updates, null, 2))
    console.log("Campaign ID:", id)
    console.log("User ID:", session.user.id)

    // Validate characterIds if provided
    if (updates.characterIds) {
      if (updates.characterIds.length < 1 || updates.characterIds.length > 4) {
        return NextResponse.json(
          { error: "Campaign must have between 1 and 4 characters" },
          { status: 400 }
        )
      }
    }

    await connectDB()

    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updates },
      { new: true }
    ).lean()

    console.log("Updated campaign:", campaign ? "found" : "NOT FOUND")
    console.log("Campaign data after update:", JSON.stringify(campaign, null, 2))

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: campaign._id.toString(),
      number: campaign.number,
      name: campaign.name,
      characterIds: campaign.characterIds.map((id) => id.toString()),
      day: campaign.day || 1,
      partyXp: campaign.partyXp || 1,
      characterHp: campaign.characterHp || {},
      characterXp: campaign.characterXp || {},
      overland: campaign.overland || null,
      mapTokens: campaign.mapTokens || [],
      mapMarkers: campaign.mapMarkers || [],
      guild: campaign.guild || "",
      guildQuests: campaign.guildQuests || [],
      startDate: campaign.startDate || "",
      endDate: campaign.endDate || "",
      difficulty: campaign.difficulty || "",
      journal: campaign.journal || "",
      createdAt: campaign.createdAt?.getTime() || Date.now(),
    })
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns/[id] - Delete campaign
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await connectDB()

    const result = await Campaign.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!result) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Campaign deleted" })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    )
  }
}
