/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { PaymentService } from './payment.service'
import { envVars } from '../../config/config'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId
  const result = await PaymentService.initPayment(bookingId as string)

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Tour updated successfully',
    data: result
  })
})

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
})
const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await PaymentService.failPayment(
    query as Record<string, string>
  )
  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&amount=${query.amount}`
    )
  }
})
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  )
  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FRONTEND_CANCEL_URL}?transactionId=${query.transactionId}&amount=${query.amount}`
    )
  }
})

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment
}
