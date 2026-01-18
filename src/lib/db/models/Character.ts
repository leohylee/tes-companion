import mongoose, { Schema, Document, Model } from "mongoose"
import { RaceId, ClassId, SkillId, RaceVariant } from "@/types"

export interface ISkill {
  skillId: SkillId
}

export interface ICharacter extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  race: RaceId
  raceVariant: RaceVariant
  classId: ClassId
  isMaster: boolean
  skills: ISkill[]
  createdAt: Date
  updatedAt: Date
}

const SkillSchema = new Schema<ISkill>(
  {
    skillId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

const CharacterSchema = new Schema<ICharacter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Character name is required"],
      trim: true,
    },
    race: {
      type: String,
      required: [true, "Race is required"],
    },
    raceVariant: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      default: 1,
    },
    classId: {
      type: String,
      required: [true, "Class is required"],
    },
    isMaster: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [SkillSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

export const Character: Model<ICharacter> =
  mongoose.models.Character || mongoose.model<ICharacter>("Character", CharacterSchema)
