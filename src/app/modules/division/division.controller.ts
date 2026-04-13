/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { DivisionService } from './division.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatusCode from 'http-status-codes'

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
const updateDivisionByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const division = await DivisionService.updateDivisionByID(
      id as string,
      req.body
    )

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Division updated successfully',
      data: division
    })
  }
)
const deleteDivisionByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const division = await DivisionService.deleteDivisionById(id as string)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Division deleted successfully',
      data: division
    })
  }
)

export const divisionController = {
  createDivision,
  getAllDivisions,
  updateDivisionByID,
  deleteDivisionByID
}
