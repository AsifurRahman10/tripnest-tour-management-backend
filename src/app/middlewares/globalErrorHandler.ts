/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { envVars } from '../config/config'
import AppError from '../errorHelpers/AppError'
import { deleteImageFromCloudinary } from '../config/cloudinary.config'

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // cloudinary error
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path)
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    await Promise.all(
      req.files.map((file: Express.Multer.File) =>
        deleteImageFromCloudinary(file.path)
      )
    )
  }

  let statusCode = 500
  let message = 'Something went wrong'
  let errorSource: any = []

  // mongoose error
  if (err.code === 11000) {
    // duplicate key error
    const field = Object.keys(err.keyValue)[0]
    statusCode = 400
    message = `Duplicate key error on field: ${field}`
  } else if (err.name == 'CastError') {
    // invalid ObjectId error
    statusCode = 400
    message = 'Invalid ID format'
  } else if (err.name == 'ValidationError') {
    // mongoose validation error
    statusCode = 400
    message = 'Validation error'
    errorSource = Object.values(err.errors).map((e: any) => ({
      path: e.path,
      message: e.message
    }))
  } else if (err instanceof ZodError || err?.name === 'ZodError') {
    // zod validation error
    statusCode = 400
    message = 'Validation error'
    const issues = err?.issues || err?.errors || []
    errorSource = issues.map((e: any) => ({
      path: e.path?.length ? e.path[e.path.length - 1] : 'body',
      message: e.message
    }))
  } else if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  } else if (err instanceof Error) {
    statusCode = 500
    message = err.message
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    err: envVars.NODE_ENV == 'development' ? err : null,
    errorSource,
    stack: envVars.NODE_ENV == 'development' ? err.stack : null
  })
}

export default globalErrorHandler
