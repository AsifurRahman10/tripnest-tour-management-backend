import { passport } from 'passport'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from '../../errorHelpers/AppError'
import { IAuthProvider, IsActive, IUser } from '../user/user.interface'
import { User } from '../user/user.model'
import httpStatusCode from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { createUserTokens } from '../../utils/userTokens'
import { generateJwt, verifyToken } from '../../utils/jwt'
import { envVars } from '../../config/config'
import { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

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
const changePassword = async (
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
const resetPassword = async (
  decoderToken: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  // const user = await User.findOne({ email: decoderToken.email })

  // const isOldPasswordMatch = await bcrypt.compare(
  //   oldPassword,
  //   user?.password as string
  // )
  // if (!isOldPasswordMatch) {
  //   throw new AppError(httpStatusCode.FORBIDDEN, 'Old password does not match')
  // }
  // const hashedNewPassword = await bcrypt.hash(
  //   newPassword,
  //   Number(envVars.BCRYPT_SALT_ROUND)
  // )

  // user!.password = hashedNewPassword
  // await user?.save()

  return {}
}
const setPassword = async (userId: string, password: string) => {
  const user = await User.findOne({ _id: userId })

  if (!user) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User does not exist')
  }

  if (user.password && user.auths.some((auth) => auth.provider === 'google')) {
    throw new AppError(
      httpStatusCode.FORBIDDEN,
      'You have already set password for this account'
    )
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  )

  const credentialProvider: IAuthProvider = {
    provider: 'credential',
    providerID: user.email
  }
  const auths: IAuthProvider[] = [...user.auths, credentialProvider]
  user.auths = auths
  user.password = hashPassword
  await user.save()

  return {}
}
const forgetPassword = async (userId: string) => {
  const isUserExist = await User.findOne({ _id: userId })
  if (!isUserExist) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User does not exist')
  }
  if (isUserExist?.isDeleted) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User is deleted')
  }

  if (!isUserExist?.isVerified) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User is not verified')
  }
  if (
    isUserExist &&
    (isUserExist?.isActive === IsActive.BLOCK ||
      isUserExist?.isActive === IsActive.INACTIVE)
  ) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User is not active')
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const token = jwt.sign(jwtPayload, envVars.JWT_SECRET, {
    expiresIn: '10m'
  })
  const resetLink = `${envVars.FRONTEND_URL}/reset-password?userId=${isUserExist._id}&token=${token}`
  return { resetLink }
}

export const AuthService = {
  credentialLogin,
  generateAccessToken,
  changePassword,
  resetPassword,
  setPassword,
  forgetPassword
}
