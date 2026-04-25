import { NextFunction, Request, Response } from 'express'
import AppError from '../errorHelpers/AppError'
import { verifyToken } from '../utils/jwt'
import { envVars } from '../config/config'
import { JwtPayload } from 'jsonwebtoken'
import { User } from '../modules/user/user.model'
import httpStatusCode from 'http-status-codes'
import { IsActive } from '../modules/user/user.interface'
const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader) {
        throw new AppError(403, 'No token received')
      }

      const accessToken = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, 'You are not allowed to make that request')
      }

      const isUserExist = await User.findOne({
        email: verifiedToken.email
      })
      if (!isUserExist) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User does not exist')
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User is deleted')
      }

      if (!isUserExist.isVerified) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User is not verified')
      }
      if (
        isUserExist.isActive === IsActive.BLOCK ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'User is not active')
      }
      req.user = verifiedToken
      next()
    } catch (error) {
      next(error)
    }
  }
export default checkAuth
