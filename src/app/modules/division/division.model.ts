import { model, Schema } from 'mongoose'
import { IDivision } from './division.interface'

const divisionModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    thumbnail: {
      type: String
    }
  },
  { timestamps: true }
)

export const division = model<IDivision>('Division', divisionModel)
