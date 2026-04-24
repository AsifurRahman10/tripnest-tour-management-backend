/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { tourService } from './tour.service'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await tourService.createTourTypes(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Tour type created successfully',
      data: user
    })
  }
)
const getAllTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await tourService.getAllTourTypes()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour types retrieved successfully',
      data: user
    })
  }
)
const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await tourService.updateTourType(
      req.params.id as string,
      req.body
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour type updated successfully',
      data: user
    })
  }
)
const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await tourService.deleteTourTypeById(req.params.id as string)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour type deleted successfully',
      data: user
    })
  }
)
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[]

    if (files) {
      const imageUrls = files.map((file) => file.path)
      req.body.images = imageUrls
    }

    const user = await tourService.createTour(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Tour created successfully',
      data: user
    })
  }
)

const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await tourService.getAllTours(req.query)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tours retrieved successfully',
      data: user
    })
  }
)

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[]

    if (files) {
      const imageUrls = files.map((file) => file.path)
      req.body.images = imageUrls
    }
    const user = await tourService.updateTourById(
      req.params.id as string,
      req.body
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour updated successfully',
      data: user
    })
  }
)
const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await tourService.deleteTourById(req.params.id as string)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour deleted successfully',
      data: user
    })
  }
)
const getTourBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await tourService.getTourBySlug(req.params.slug as string)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Tour retrieved successfully',
      data: user
    })
  }
)

export const tourController = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  getTourBySlug
}
