import httpStatusCode from 'http-status-codes'
import AppError from '../../errorHelpers/AppError'
import { IAuthProvider, IUser } from './user.interface'
import { User } from './user.model'
import bcrypt from 'bcryptjs'

const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload
  const isUserExist = await User.findOne({ email })
  if (isUserExist) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User already exist')
  }
  const hashPassword = await bcrypt.hash(password as string, 8)

  const authProvider: IAuthProvider = {
    provider: 'credential',
    providerID: email as string,
  }
  const user = await User.create({
    email,
    password: hashPassword,
    ...rest,
    auths: [authProvider],
  })

  return user
}

const getAllUserService = async () => {
  const result = await User.find()

  const totalUser = await User.countDocuments()
  return { result, meta: { total: totalUser } }
}

export const UserServices = { createUserService, getAllUserService }
