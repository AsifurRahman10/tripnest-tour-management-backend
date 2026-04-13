import { Router } from 'express'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import { tourController } from './tour.controller'
import validateRequest from '../../middlewares/validateReqest'
import { tourValidation } from './tour.validation'

const router = Router()

router.post(
  '/create-tour-type',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidation.createTourTypeValidation),
  tourController.createTourType
)

router.get('/tour-types', tourController.getAllTourTypes)

export const TourRouter = router
