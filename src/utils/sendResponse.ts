import { Response } from 'express'

interface TMeta {
  total: number
}

interface TResponseType<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta?: TMeta
}

const sendResponse = <T>(res: Response, data: TResponseType<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  })
}

export default sendResponse
