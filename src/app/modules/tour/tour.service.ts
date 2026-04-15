import { TourType } from './Tour.model'
import { ITourType } from './Xtour.interface'

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

export const tourService = {
  createTourTypes,
  getAllTourTypes,
  updateTourType,
  deleteTourTypeById
}
