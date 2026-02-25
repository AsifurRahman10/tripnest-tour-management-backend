import { NextFunction, Request, Response } from 'express'
import AppError from '../errorHelpers/AppError'
import { verifyToken } from '../utils/jwt'
import { envVars } from '../config/config'
import { JwtPayload } from 'jsonwebtoken'

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
      next()
    } catch (error) {
      next(error)
    }
  }
export default checkAuth
