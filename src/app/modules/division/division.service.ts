import AppError from '../../errorHelpers/AppError'
import { IDivision } from './division.interface'
import { Division } from './division.model'

const createDivision = async (data: IDivision) => {
  const isExist = await Division.findOne({
    $or: [{ name: data.name }, { slug: data.slug }]
  })
  if (isExist) {
    throw new AppError(400, 'Division with this name and slug already exists')
  }
  const result = await Division.create(data)
  return result
}

const getAllDivisions = async () => {
  const result = await Division.find()
  return result
}

const updateDivisionByID = async (id: string, data: Partial<IDivision>) => {
  const isDivisionExist = await Division.findById(id)
  if (!isDivisionExist) {
    throw new AppError(400, 'Division not found')
  }
  const isExist = await Division.findOne({
    $or: [{ name: data.name }, { slug: data.slug }]
  })
  if (isExist) {
    throw new AppError(400, 'Division with this name and slug already exists')
  }

  const updateDivision = await Division.findByIdAndUpdate(id, data, {
    new: true
  })

  return updateDivision
}

const deleteDivisionById = async (id: string) => {
  const isDivisionExist = await Division.findById(id)
  if (!isDivisionExist) {
    throw new AppError(400, 'Division not found')
  }
  await Division.findByIdAndDelete(id)
}

export const DivisionService = {
  createDivision,
  getAllDivisions,
  updateDivisionByID,
  deleteDivisionById
}
