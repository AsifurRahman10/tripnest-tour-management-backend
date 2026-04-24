import { Router } from 'express'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import validateRequest from '../../middlewares/validateRequest'
import { DivisionController } from './division.controller'
import { divisionValidation } from './division.validation'
import { multerUpload } from '../../config/multer.config'

const router = Router()

router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single('file'),
  validateRequest(divisionValidation.updateDivisionValidation),
  DivisionController.updateDivisionByID
)
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivisionByID
)

router.get('/:slug', DivisionController.getSingleDivisionBySlug)

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single('file'),
  validateRequest(divisionValidation.createDivisionValidation),
  DivisionController.createDivision
)

router.get('/', DivisionController.getAllDivisions)

export const DivisionRouter = router
