import { IUser } from './user.interface'
import { User } from './user.model'

const createUserService = async (payload: Partial<IUser>) => {
  const { name, email } = payload
  const user = await User.create({
    name,
    email,
  })

  return user
}

const getAllUserService = async () => {
  const result = await User.find()

  const totalUser = await User.countDocuments()
  return { result, meta: { total: totalUser } }
}

export const UserServices = { createUserService, getAllUserService }
