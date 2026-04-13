/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'
import { DivisionService } from './division.service'

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionService.createDivision(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Division created successfully',
      data: division
    })
  }
)

const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisions = await DivisionService.getAllDivisions()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Divisions retrieved successfully',
      data: divisions
    })
  }
)

export const DivisionController = {
  createDivision,
  getAllDivisions
}
