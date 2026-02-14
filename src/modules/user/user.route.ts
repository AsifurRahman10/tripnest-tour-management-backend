import { Router } from 'express'
import { UserControllers } from './user.controller'
import validateRequest from '../../middlewares/validateReqest'
import { userValidation } from './user.validation'

const router = Router()

router.post(
  '/register',
  validateRequest(userValidation.createUserZodSchema),
  UserControllers.createUser
)
router.get('/all-user', UserControllers.getAllUser)

export const UserRouter = router
