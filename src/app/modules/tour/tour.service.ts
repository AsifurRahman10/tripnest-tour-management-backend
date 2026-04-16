/* eslint-disable @typescript-eslint/no-explicit-any */

import { ITour, ITourType } from './tour.interface'
import { TourType, Tour } from './tour.model'
import { QueryBuilder } from '../../utils/queryBuilder'

const createTourTypes = async (data: ITourType) => {
  const isTourTypeExist = await TourType.findOne({ name: data.name })
  if (isTourTypeExist) {
    throw new Error('Tour type already exists')
  }
  const result = await TourType.create(data)
  return result
}

const getAllTourTypes = async () => {
  const result = await TourType.find()
  return result
}

const updateTourType = async (id: string, data: ITourType) => {
  const isTourTypeExist = await TourType.findOne({ name: data.name })
  if (isTourTypeExist) {
    throw new Error('Tour type already exists')
  }
  const result = await TourType.findByIdAndUpdate(id, data, { new: true })
  return result
}

const deleteTourTypeById = async (id: string) => {
  const isTourTypeExist = await TourType.findById(id)
  if (!isTourTypeExist) {
    throw new Error('Tour type not found')
  }
  const result = await TourType.findByIdAndDelete(id)
  return result
}

const createTour = async (data: ITour) => {
  const isTourExist = await Tour.findOne({ title: data.title })
  if (isTourExist) {
    throw new Error('Tour already exists')
  }

  const result = await Tour.create(data)
  return result
}

const getAllTours = async (query: any) => {
  // const page = parseInt(query.page as string) || 1
  // const limit = parseInt(query.limit as string) || 10
  // const search = query.search || ''
  // const skip = (page - 1) * limit

  // const filter: any = {}

  // if (query.tourType) {
  //   filter.tourType = query.tourType
  // }
  // if (search) {
  //   filter.title = { $regex: search, $options: 'i' }
  // }
  // const total = await Tour.countDocuments(filter)
  // const result = await Tour.find(filter).skip(skip).limit(limit)

  const searchAbleFields = ['title', 'description', 'location']

  const queryBuilder = new QueryBuilder(Tour.find(), query)
  const tour = await queryBuilder
    .search(searchAbleFields)
    .filter()
    .sort()
    .fields()
    .pagination()

  // const meta = await queryBuilder.getMeta()

  const queryRun = await Promise.all([tour.build(), queryBuilder.getMeta()])
  console.log(queryRun)
  return {
    tours: queryRun[0],
    meta: queryRun[1]
  }
}

const updateTourById = async (id: string, data: Partial<ITour>) => {
  const isTourExist = await Tour.findById(id)
  if (!isTourExist) {
    throw new Error('Tour not found')
  }

  const result = await Tour.findByIdAndUpdate(id, data, { new: true })
  return result
}

const deleteTourById = async (id: string) => {
  const isTourExist = await Tour.findById(id)
  if (!isTourExist) {
    throw new Error('Tour not found')
  }
  const result = await Tour.findByIdAndDelete(id)
  return result
}

const getTourBySlug = async (slug: string) => {
  const result = await Tour.findOne({ slug })
  if (!result) {
    throw new Error('Tour not found')
  }
  return result
}

export const tourService = {
  createTourTypes,
  getAllTourTypes,
  updateTourType,
  deleteTourTypeById,
  createTour,
  getAllTours,
  updateTourById,
  deleteTourById,
  getTourBySlug
}
