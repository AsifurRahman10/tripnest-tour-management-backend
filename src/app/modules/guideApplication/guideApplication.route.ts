import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import checkAuth from '../../middlewares/checkAuth'
import { multerUpload } from '../../config/multer.config'
import { guideApplicationValidation } from './guideApplication.validation'
import { Role } from '../user/user.interface'
import { GuideApplicationController } from './guideApplication.controller'

const router = Router()

router.post(
  '/apply',
  multerUpload.single('file'),
  checkAuth(Role.USER),
  validateRequest(guideApplicationValidation.guideApplicationValidationSchema),
  GuideApplicationController.createGuideApplication
)

export const GuideApplicationRouter = router
