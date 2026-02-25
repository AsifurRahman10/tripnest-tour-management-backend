import { Router } from 'express'
import { UserControllers } from './user.controller'
import validateRequest from '../../middlewares/validateReqest'
import { userValidation } from './user.validation'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from './user.interface'

const router = Router()

router.post(
  '/register',
  validateRequest(userValidation.createUserZodSchema),
  UserControllers.createUser
)
router.get(
  '/all-user',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
)

router.patch(
  '/:id',
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
)

export const UserRouter = router
