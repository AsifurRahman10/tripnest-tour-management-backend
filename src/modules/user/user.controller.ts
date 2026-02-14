/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import httpStatusCode from 'http-status-codes'
import { UserServices } from './user.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserService(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'User created successfully',
      data: user,
    })
  }
)

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUserService()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'All User retrieved successfully',
      data: result.result,
      meta: result.meta,
    })
  }
)

export const UserControllers = {
  createUser,
  getAllUser,
}
