import { Types } from 'mongoose'

export interface ITourType {
  name: string
}

export interface ITour {
  title: string
  slug: string
  description?: string
  images?: string[]
  location?: string
  costFrom?: number
  startDate?: Date
  endDate?: Date
  division: Types.ObjectId
  includes?: string[]
  excludes?: string[]
  amenities?: string[]
  tourPlan?: string[]
  maxGuests?: number
  minAge?: number
  tourType: Types.ObjectId
  departureLocation?: string
  arrivalLocation?: string
  deletedImages?: string[]
}
