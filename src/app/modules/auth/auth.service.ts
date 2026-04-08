import AppError from '../../errorHelpers/AppError'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'
import httpStatusCode from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { generateJwt } from '../../utils/jwt'
import { envVars } from '../../config/config'

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload
  const isUserExist = await User.findOne({ email })
  if (!isUserExist) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User does not exist')
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist?.password as string
  )

  if (!isPasswordMatch) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'Password does not match')
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist?.email,
    role: isUserExist?.role
  }

  const accessToken = generateJwt(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRE
  )

  const refreshToken = generateJwt(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRE
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userData } = isUserExist.toObject()

  return { accessToken, refreshToken, user: userData }
}

export const AuthService = { credentialLogin }
