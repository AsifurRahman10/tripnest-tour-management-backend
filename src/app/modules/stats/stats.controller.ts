/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { StatsService } from './stats.service'

const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.userStats()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User stats retrieved successfully',
      data: result
    })
  }
)
const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.tourStats()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour stats retrieved successfully',
      data: result
    })
  }
)
const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.bookingStats()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Booking stats retrieved successfully',
      data: result
    })
  }
)
const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.paymentStats()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Payment stats retrieved successfully',
      data: result
    })
  }
)

export const StatsController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats
}
