import { Router } from 'express'
import { divisionController } from './division.controller'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import validateRequest from '../../middlewares/validateReqest'
import { divisionValidation } from './division.validation'

const router = Router()

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(divisionValidation.createDivisionValidation),
  divisionController.createDivision
)
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(divisionValidation.updateDivisionValidation),
  divisionController.updateDivisionByID
)

router.get('/', divisionController.getAllDivisions)

export const DivisionRouter = router
