import { envVars } from '../config/config'
import { IUser } from '../modules/user/user.interface'
import { generateJwt } from './jwt'

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user?.email,
    role: user?.role
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

  return { accessToken, refreshToken }
}
