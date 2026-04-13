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

export const tourController = {
  createTourType,
  getAllTourTypes,
  updateTourType
}
