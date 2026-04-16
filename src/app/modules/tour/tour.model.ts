/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose'
import { ITourType, ITour } from './tour.interface'
import AppError from '../../errorHelpers/AppError'

const tourTypeSchema = new Schema<ITourType>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
)

export const TourType = model<ITourType>('TourType', tourTypeSchema)

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String
    },
    images: {
      type: [String],
      default: []
    },
    location: {
      type: String
    },
    costFrom: {
      type: Number
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: 'Division',
      required: true
    },
    includes: {
      type: [String],
      default: []
    },
    excludes: {
      type: [String],
      default: []
    },
    amenities: {
      type: [String],
      default: []
    },
    tourPlan: {
      type: [String],
      default: []
    },
    maxGuests: {
      type: Number
    },
    minAge: {
      type: Number
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: 'TourType',
      required: true
    },
    departureLocation: {
      type: String
    },
    arrivalLocation: {
      type: String
    }
  },
  { timestamps: true }
)

tourSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    const baseSlug = this.title.toLowerCase().split(' ').join('-')
    let slug = `${baseSlug}`
    let count = 0
    while (await Tour.exists({ slug })) {
      slug = `${baseSlug}-${count++}`
    }
    this.slug = slug
  }
})

tourSchema.pre('findOneAndUpdate', async function (next) {
  const tour = this.getUpdate() as any

  if (tour.title) {
    // check duplicate title
    const isExist = await Tour.findOne({
      title: tour.title,
      _id: { $ne: tour.id }
    })
    if (isExist) {
      throw new AppError(400, 'Tour with this title already exists')
    }

    // generate slug
    const baseSlug = tour.title.toLowerCase().split(' ').join('-')
    let slug = `${baseSlug}`
    let count = 1

    while (await Tour.exists({ slug, _id: { $ne: tour.id } })) {
      slug = `${baseSlug}-${count++}`
    }

    tour.slug = slug
  }
  this.setUpdate(tour)
})

export const Tour = model<ITour>('Tour', tourSchema)
