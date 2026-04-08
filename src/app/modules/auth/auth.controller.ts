/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { AuthService } from './auth.service'
import { sendCookie } from '../../utils/setCookies'
import { IUser } from '../user/user.interface'
import AppError from '../../errorHelpers/AppError'
import { createUserTokens } from '../../utils/userTokens'
import { envVars } from '../../config/config'

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.credentialLogin(req.body)

    sendCookie(res, user)

    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: 'User login successfully',
      data: user
    })
  }
)
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies
    const { accessToken } = await AuthService.generateAccessToken(refreshToken)

    sendCookie(res, { accessToken })
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: 'Access token generated successfully',
      data: { accessToken }
    })
  }
)
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    })
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    })

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User logged out successfully',
      data: null
    })
  }
)
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoderToken = req.user
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    await AuthService.resetPassword(
      decoderToken as IUser,
      oldPassword,
      newPassword
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Password reset successfully',
      data: true
    })
  }
)
const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) {
      throw new AppError(
        httpStatusCode.UNAUTHORIZED,
        'Google authentication failed'
      )
    }

    const token = createUserTokens(user)

    sendCookie(res, token)

    return res.redirect(envVars.FRONTEND_URL)
  }
)

export const AuthController = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallback
}
