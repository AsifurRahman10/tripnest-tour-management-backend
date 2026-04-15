/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITour, ITourType } from './Tour.interface'
import { Tour, tourType } from './Tour.model'

const createTourTypes = async (data: ITourType) => {
  const isTourTypeExist = await tourType.findOne({ name: data.name })
  if (isTourTypeExist) {
    throw new Error('Tour type already exists')
  }
  const result = await tourType.create(data)
  return result
}

const getAllTourTypes = async () => {
  const result = await tourType.find()
  return result
}

const updateTourType = async (id: string, data: ITourType) => {
  const isTourTypeExist = await tourType.findOne({ name: data.name })
  if (isTourTypeExist) {
    throw new Error('Tour type already exists')
  }
  const result = await tourType.findByIdAndUpdate(id, data, { new: true })
  return result
}

const deleteTourTypeById = async (id: string) => {
  const isTourTypeExist = await tourType.findById(id)
  if (!isTourTypeExist) {
    throw new Error('Tour type not found')
  }
  const result = await tourType.findByIdAndDelete(id)
  return result
}

const createTour = async (data: ITour) => {
  const isTourExist = await Tour.findOne({ slug: data.slug })
  if (isTourExist) {
    throw new Error('Tour already exists')
  }
  const result = await Tour.create(data)
  return result
}

const getAllTours = async (query: any) => {
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const search = query.search || ''
  const skip = (page - 1) * limit

  const filter: any = {}

  if (query.tourType) {
    filter.tourType = query.tourType
  }
  if (search) {
    filter.title = { $regex: search, $options: 'i' }
  }
  const total = await Tour.countDocuments(filter)
  const result = await Tour.find(filter).skip(skip).limit(limit)
  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  }
}

export const tourService = {
  createTourTypes,
  getAllTourTypes,
  updateTourType,
  deleteTourTypeById,
  createTour,
  getAllTours
}
