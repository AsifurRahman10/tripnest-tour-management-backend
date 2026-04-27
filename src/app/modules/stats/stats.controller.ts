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
      message: 'All User retrieved successfully',
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
      message: 'All Tour retrieved successfully',
      data: result
    })
  }
)

export const StatsController = {
  getUserStats,
  getTourStats
}
