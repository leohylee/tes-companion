import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { connectDB } from "@/lib/db/connect"
import { Campaign } from "@/lib/db/models/Campaign"

// GET /api/campaigns - List all campaigns for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const campaigns = await Campaign.find({ userId: session.user.id })
      .sort({ number: -1 })
      .lean()

    // Transform for frontend compatibility
    const transformedCampaigns = campaigns.map((campaign) => ({
      id: campaign._id.toString(),
      number: campaign.number,
      name: campaign.name,
      characterIds: campaign.characterIds.map((id) => id.toString()),
      day: campaign.day || 1,
      partyXp: campaign.partyXp || 1,
      characterHp: campaign.characterHp || {},
      characterXp: campaign.characterXp || {},
      overland: campaign.overland || null,
      guild: campaign.guild || "",
      guildQuests: campaign.guildQuests || [],
      createdAt: campaign.createdAt?.getTime() || Date.now(),
    }))

    return NextResponse.json(transformedCampaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { characterIds } = body

    if (!characterIds || characterIds.length < 1 || characterIds.length > 4) {
      return NextResponse.json(
        { error: "Campaign must have between 1 and 4 characters" },
        { status: 400 }
      )
    }

    await connectDB()

    // Get the next campaign number for this user
    const lastCampaign = await Campaign.findOne({ userId: session.user.id })
      .sort({ number: -1 })
      .lean()

    const nextNumber = lastCampaign ? lastCampaign.number + 1 : 1

    const campaign = await Campaign.create({
      userId: session.user.id,
      number: nextNumber,
      name: `Campaign ${nextNumber}`,
      characterIds,
      day: 1,
      partyXp: 1,
      characterHp: {},
      characterXp: {},
      overland: null,
      guild: "",
      guildQuests: [],
    })

    return NextResponse.json(
      {
        id: campaign._id.toString(),
        number: campaign.number,
        name: campaign.name,
        characterIds: campaign.characterIds.map((id) => id.toString()),
        day: campaign.day || 1,
        partyXp: campaign.partyXp || 1,
        characterHp: campaign.characterHp || {},
        characterXp: campaign.characterXp || {},
        overland: campaign.overland || null,
        guild: campaign.guild || "",
        guildQuests: campaign.guildQuests || [],
        createdAt: campaign.createdAt?.getTime() || Date.now(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    )
  }
}
