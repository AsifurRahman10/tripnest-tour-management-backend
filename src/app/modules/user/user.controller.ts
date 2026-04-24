/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import httpStatusCode from 'http-status-codes'
import { UserServices } from './user.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { JwtPayload } from 'jsonwebtoken'
// import { verifyToken } from '../../utils/jwt'
// import { envVars } from '../../config/config'
// import { JwtPayload } from 'jsonwebtoken'

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file
    if (file) {
      req.body.image = file.path
    }
    const user = await UserServices.createUserService(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'User created successfully',
      data: user
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
      meta: result.meta
    })
  }
)

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.params?.id
    const payload = req.body

    const file = req.file
    if (file) {
      payload.image = file.path
    }

    const verifiedToken = req.user
    const user = await UserServices.updateUserService(
      userId as string,
      payload,
      verifiedToken as JwtPayload
    )
    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'User updated successfully',
      data: user
    })
  }
)

export const UserControllers = {
  createUser,
  getAllUser,
  updateUser
}
