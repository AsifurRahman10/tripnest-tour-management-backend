import { Request, Response } from 'express'
import { User } from './user.model'
import httpStatusCode from 'http-status-codes'

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body

    const user = await User.create({
      name,
      email,
    })
    res.status(httpStatusCode.CREATED).json({
      message: 'User created successfully',
      data: user,
    })
  } catch (error) {
    console.log(error)
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: 'Something Went wrong',
      errorData: error,
    })
  }
}

export const UserController = {
  createUser,
}
