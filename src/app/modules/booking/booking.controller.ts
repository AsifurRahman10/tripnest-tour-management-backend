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
      message: 'Booking created successfully',
      data: booking
    })
  }
)
const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const bookings = await BookingService.getAllBookings(
      query as Record<string, string>
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
    })
  }
)
const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const query = req.query as Record<string, string>
    const bookings = await BookingService.getMyBookings(
      decodedToken.userId,
      query
    )
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'My bookings retrieved successfully',
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
      message: 'Booking retrieved successfully',
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
      message: 'Booking updated successfully',
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
