import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICampaign extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  number: number
  name: string
  characterIds: mongoose.Types.ObjectId[]
  day: number
  partyXp: number
  characterHp: Record<string, number>
  characterXp: Record<string, number>
  overland: string | null
  mapTokens: Array<{
    id: string
    position: { x: number; y: number }
    icon: string
    label: string
    color: string
  }>
  mapMarkers: Array<{
    id: string
    position: { x: number; y: number }
    type: string
    label?: string
  }>
  guild: string
  guildQuests: string[]
  startDate: string
  endDate: string
  difficulty: string
  journal: string
  createdAt: Date
  updatedAt: Date
}

const CampaignSchema = new Schema<ICampaign>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    number: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
    },
    characterIds: {
      type: [Schema.Types.ObjectId],
      ref: "Character",
      validate: {
        validator: function (v: mongoose.Types.ObjectId[]) {
          return v.length >= 1 && v.length <= 4
        },
        message: "Campaign must have between 1 and 4 characters",
      },
    },
    day: {
      type: Number,
      default: 1,
      min: 1,
    },
    partyXp: {
      type: Number,
      default: 1,
      min: 1,
    },
    characterHp: {
      type: Schema.Types.Mixed,
      default: {},
    },
    characterXp: {
      type: Schema.Types.Mixed,
      default: {},
    },
    overland: {
      type: String,
      default: null,
    },
    mapTokens: {
      type: [{
        id: String,
        position: {
          x: Number,
          y: Number,
        },
        icon: String,
        label: String,
        color: String,
      }],
      default: [],
    },
    mapMarkers: {
      type: [{
        id: String,
        position: {
          x: Number,
          y: Number,
        },
        type: String,
        label: String,
      }],
      default: [],
    },
    guild: {
      type: String,
      default: "",
    },
    guildQuests: {
      type: [String],
      default: [],
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      default: "",
    },
    journal: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

export const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema)
