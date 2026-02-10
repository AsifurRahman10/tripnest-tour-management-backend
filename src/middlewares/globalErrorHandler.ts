/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { envVars } from '../config/config'

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    err,
    stack: envVars.NODE_ENV == 'development' ? err.stack : null,
  })
}

export default globalErrorHandler
