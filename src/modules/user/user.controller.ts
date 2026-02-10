import { Request, Response } from 'express'
import httpStatusCode from 'http-status-codes'
import { UserServices } from './user.service'

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUserService(req.body)
    res.status(httpStatusCode.CREATED).json({
      message: 'User created successfully',
      data: user,
    })
  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: 'Something Went wrong',
      errorData: error,
    })
  }
}

export const UserControllers = {
  createUser,
}
