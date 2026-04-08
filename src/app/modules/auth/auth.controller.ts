/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { AuthService } from './auth.service'

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.credentialLogin(req.body)

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      secure: false
    })
    res.cookie('accessToken', user.accessToken, {
      httpOnly: true,
      secure: false
    })
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
    const user = await AuthService.generateAccessToken(refreshToken)
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: 'Access token generated successfully',
      data: user
    })
  }
)

export const AuthController = { credentialLogin, getNewAccessToken }
