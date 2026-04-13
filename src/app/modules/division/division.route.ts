import { Router } from 'express'
import { DivisionController } from './division.controller'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import validateRequest from '../../middlewares/validateReqest'
import { divisionValidation } from './division.validation'

const router = Router()

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(divisionValidation.createDivisionValidation),
  DivisionController.createDivision
)

export const DivisionRouter = router
