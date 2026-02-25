/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { envVars } from '../config/config'
import AppError from '../errorHelpers/AppError'

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500
  let message = 'Something went wrong'

  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  } else if (err instanceof Error) {
    statusCode = 500
    message = err.message
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    err,
    stack: envVars.NODE_ENV == 'development' ? err.stack : null,
  })
}

export default globalErrorHandler
