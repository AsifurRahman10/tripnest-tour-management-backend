/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose'
import { IDivision } from './division.interface'
import AppError from '../../errorHelpers/AppError'

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true
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

divisionSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    const baseSlug = this.name.toLowerCase().split(' ').join('-')
    let slug = `${baseSlug}-division`
    let count = 0
    while (await Division.exists({ slug })) {
      slug = `${baseSlug}-${count++}`
    }
    this.slug = slug
  }
})

divisionSchema.pre('findOneAndUpdate', async function (next) {
  const division = this.getUpdate() as any

  if (division.name) {
    // check duplicate name
    const isExist = await Division.findOne({
      name: division.name,
      _id: { $ne: division.id }
    })
    if (isExist) {
      throw new AppError(400, 'Division with this name already exists')
    }

    // generate slug
    const baseSlug = division.name.toLowerCase().split(' ').join('-')
    let slug = `${baseSlug}-division`
    let count = 1

    while (await Division.exists({ slug, _id: { $ne: division.id } })) {
      slug = `${baseSlug}-division-${count++}`
    }

    division.slug = slug
  }
  this.setUpdate(division)
})

export const Division = model<IDivision>('Division', divisionSchema)
