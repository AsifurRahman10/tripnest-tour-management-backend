/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import httpStatusCode from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { JwtPayload } from 'jsonwebtoken'
import { GuideApplicationService } from './guideApplication.service'

const createGuideApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const file = req.file
    if (file) {
      req.body.image = file.path
    }
    const payload = { ...req.body, user: user.id }
    const result = await GuideApplicationService.createGuideApplication(payload)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Guide Application created successfully',
      data: result
    })
  }
)

export const GuideApplicationController = {
  createGuideApplication
}
