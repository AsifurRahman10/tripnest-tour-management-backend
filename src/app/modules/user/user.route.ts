import { Router } from 'express'
import { UserControllers } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { userValidation } from './user.validation'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from './user.interface'
import { multerUpload } from '../../config/multer.config'

const router = Router()

router.get('/me', checkAuth(...Object.values(Role)), UserControllers.getMe)

router.post(
  '/register',
  multerUpload.single('file'),
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
  multerUpload.single('file'),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
)

export const UserRouter = router
