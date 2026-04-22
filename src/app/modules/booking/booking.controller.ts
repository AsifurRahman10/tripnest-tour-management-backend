/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from '../../utils/catchAsync'
import httpStatusCode from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'
import sendResponse from '../../utils/sendResponse'
import { BookingService } from './booking.service'
import { JwtPayload } from 'jsonwebtoken'

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(
      req.body,
      decodedToken.userId
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour updated successfully',
      data: booking
    })
  }
)
const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await BookingService.getAllBookings()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour updated successfully',
      data: bookings
    })
  }
)
const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await BookingService.getMyBookings(req.user as JwtPayload)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour updated successfully',
      data: bookings
    })
  }
)
const getBookingById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.getBookingById(req.params.id as string)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour updated successfully',
      data: booking
    })
  }
)
const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.updateBookingById(
      req.params.id as string,
      req.body
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour updated successfully',
      data: booking
    })
  }
)

export const BookingController = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking
}
