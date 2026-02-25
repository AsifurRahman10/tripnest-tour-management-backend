/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { AuthService } from './auth.service'

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.credentialLogin(req.body)
    sendResponse(res, {
      statusCode: httpStatusCode.ACCEPTED,
      success: true,
      message: 'User login successfully',
      data: user,
    })
  }
)

export const AuthController = { credentialLogin }
