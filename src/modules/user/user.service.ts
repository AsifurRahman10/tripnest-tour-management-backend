import httpStatusCode from 'http-status-codes'
import AppError from '../../errorHelpers/AppError'
import { IAuthProvider, IsActive, IUser, Role } from './user.interface'
import { User } from './user.model'
import bcrypt from 'bcryptjs'
import { envVars } from '../../config/config'
import { JwtPayload } from 'jsonwebtoken'

const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload
  const isUserExist = await User.findOne({ email })
  if (isUserExist) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User already exist')
  }
  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  )

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

const updateUserService = async (
  userId: string,
  payload: Partial<IUser>,
  token: JwtPayload
) => {
  const isUserExist = await User.findById(userId)
  console.log(payload)
  if (!isUserExist) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  if (isUserExist.isDeleted || isUserExist.isActive === IsActive.BLOCK) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, 'Action unauthorized')
  }

  if (payload?.role) {
    if (token.role === Role.USER || token.role === Role.GUIDE) {
      throw new AppError(
        httpStatusCode.FORBIDDEN,
        'You are not authorized for this action'
      )
    }
    if (payload.role === Role.SUPER_ADMIN && token.role === Role.ADMIN) {
      throw new AppError(
        httpStatusCode.FORBIDDEN,
        'You are not authorized for this action'
      )
    }
  }

  if (payload?.isActive || payload?.isDeleted || payload?.isVerified) {
    if (token.role === Role.USER || token.role === Role.GUIDE) {
      throw new AppError(httpStatusCode.UNAUTHORIZED, 'Action unauthorized')
    }
  }

  if (payload?.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    )
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  })

  return newUpdatedUser
}

export const UserServices = {
  createUserService,
  getAllUserService,
  updateUserService,
}
