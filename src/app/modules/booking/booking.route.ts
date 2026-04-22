import { Router } from 'express'
import { BookingController } from './booking.controller'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import validateRequest from '../../middlewares/validateRequest'
import { BookingValidation } from './booking.validation'

const router = Router()

router.get(
  '/:id',
  checkAuth(...Object.values(Role)),
  BookingController.getBookingById
)

router.post(
  '/',
  checkAuth(...Object.values(Role)),
  validateRequest(BookingValidation.createBookingValidation),
  BookingController.createBooking
)

router.get(
  '/',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  BookingController.getAllBookings
)

router.get(
  '/my-bookings',
  checkAuth(...Object.values(Role)),
  BookingController.getMyBookings
)

router.patch(
  '/:id',
  checkAuth(...Object.values(Role)),
  validateRequest(BookingValidation.updateBookingValidation),
  BookingController.updateBooking
)

export const BookingRoute = router
