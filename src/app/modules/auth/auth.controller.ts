/* eslint-disable @typescript-eslint/no-explicit-any */
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
import passport from 'passport'
import { JwtPayload } from 'jsonwebtoken'

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const user = await AuthService.credentialLogin(req.body)

    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return next(new AppError(httpStatusCode.UNAUTHORIZED, info.message))
      }

      const tokens = createUserTokens(user)
      sendCookie(res, tokens)

      delete user.toObject().password
      sendResponse(res, {
        statusCode: httpStatusCode.ACCEPTED,
        success: true,
        message: 'User login successfully',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user
        }
      })
    })(req, res, next)
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
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoderToken = req.user
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    await AuthService.changePassword(
      decoderToken as IUser,
      oldPassword,
      newPassword
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Password changed successfully',
      data: true
    })
  }
)
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoderToken = req.user
    await AuthService.resetPassword(decoderToken as IUser, req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Password reset successfully',
      data: true
    })
  }
)
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoderToken = req.user as JwtPayload
    const password = req.body.password

    await AuthService.setPassword(decoderToken.userId, password)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Password set successfully',
      data: true
    })
  }
)
const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email

    await AuthService.forgetPassword(email)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Password reset link sent to your email successfully',
      data: null
    })
  }
)
const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : ''
    if (redirectTo.startsWith('/')) {
      redirectTo = redirectTo.slice(1)
    }
    const user = req.user
    if (!user) {
      throw new AppError(
        httpStatusCode.UNAUTHORIZED,
        'Google authentication failed'
      )
    }

    const token = createUserTokens(user)

    sendCookie(res, token)

    return res.redirect(envVars.FRONTEND_URL + '/' + redirectTo)
  }
)

export const AuthController = {
  credentialLogin,
  getNewAccessToken,
  logout,
  changePassword,
  googleCallback,
  resetPassword,
  setPassword,
  forgetPassword
}
