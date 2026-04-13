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

export const tourService = {
  createTourTypes,
  getAllTourTypes,
  updateTourType,
  deleteTourTypeById
}
