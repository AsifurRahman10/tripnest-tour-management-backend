/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from '../../errorHelpers/AppError'
import { IsActive, IUser } from '../user/user.interface'
import { User } from '../user/user.model'
import httpStatusCode from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { createUserTokens } from '../../utils/userTokens'
import { generateJwt, verifyToken } from '../../utils/jwt'
import { envVars } from '../../config/config'
import { JwtPayload } from 'jsonwebtoken'

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

  const { accessToken, refreshToken } = createUserTokens(isUserExist)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userData } = isUserExist.toObject()

  return { accessToken, refreshToken, user: userData }
}
const generateAccessToken = async (refreshToken: string) => {
  const validateRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload

  const isUserExist = await User.findOne({ email: validateRefreshToken.email })
  if (!isUserExist) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User does not exist')
  }
  if (
    isUserExist.isActive === IsActive.BLOCK ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User is not active')
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User is deleted')
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
  return { accessToken }
}
const resetPassword = async (
  decoderToken: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findOne({ email: decoderToken.email })

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user?.password as string
  )
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'Old password does not match')
  }
  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  )

  user!.password = hashedNewPassword
  await user?.save()
}

export const AuthService = {
  credentialLogin,
  generateAccessToken,
  resetPassword
}
