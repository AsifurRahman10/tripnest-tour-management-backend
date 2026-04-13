import { ITourType } from './tour.interface'
import { tourType } from './tour.model'

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

export const tourService = { createTourTypes, getAllTourTypes }
