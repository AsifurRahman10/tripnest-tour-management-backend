/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { PaymentService } from './payment.service'
import { envVars } from '../../config/config'
import AppError from '../../errorHelpers/AppError'
import httpStatusCode from 'http-status-codes'

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  )
  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FRONTEND_SUCCESS_URL}?transactionId=${query.transactionId}&amount=${query.amount}`
    )
  }

  // throw new AppError(httpStatusCode.BAD_REQUEST, 'Payment processing failed')
})
const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
})
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
})

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment
}
