import { Router } from 'express'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import validateRequest from '../../middlewares/validateRequest'
import { DivisionValidation } from './division.validation'
import { DivisionController } from './division.controller'

const router = Router()

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(DivisionValidation.createDivisionValidation),
  DivisionController.createDivision
)

router.get('/', DivisionController.getAllDivisions)

export const DivisionRouter = router
