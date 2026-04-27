import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { OtpService } from './otp.service'

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body

  await OtpService.sendOtp(email, name)

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'OTP sent successfully',
    data: null
  })
})
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body

  await OtpService.verifyOtp(email, otp)

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'OTP verified successfully',
    data: null
  })
})

export const OtpController = {
  sendOtp,
  verifyOtp
}
