import { Router } from 'express'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import { tourController } from './tour.controller'
import { tourValidation } from './tour.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = Router()

// tour type routes

router.post(
  '/create-tour-type',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidation.createTourTypeValidation),
  tourController.createTourType
)

router.get('/tour-types', tourController.getAllTourTypes)

router.patch(
  '/tour-types/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidation.updateTourTypeValidation),
  tourController.updateTourType
)

router.delete(
  '/tour-types/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTourType
)

// tour routes

router.post(
  '/create-tour',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourValidation.createTourValidation),
  tourController.createTour
)

export const TourRouter = router
