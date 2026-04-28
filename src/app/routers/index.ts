import { Router } from 'express'
import { UserRouter } from '../modules/user/user.route'
import { AuthRouter } from '../modules/auth/auth.route'
import { DivisionRouter } from '../modules/division/division.route'
import { TourRouter } from '../modules/tour/tour.route'
import { BookingRoute } from '../modules/booking/booking.route'
import { PaymentRoute } from '../modules/payment/payment.route'
import { OtpRoute } from '../modules/otp/otp.router'
import { StatsRouter } from '../modules/stats/stats.router'
import { GuideApplicationRouter } from '../modules/guideApplication/guideApplication.route'

export const router = Router()

const moduleRoutes = [
  {
    path: '/user',
    route: UserRouter
  },
  {
    path: '/auth',
    route: AuthRouter
  },
  {
    path: '/division',
    route: DivisionRouter
  },
  {
    path: '/tour',
    route: TourRouter
  },
  {
    path: '/booking',
    route: BookingRoute
  },
  {
    path: '/payment',
    route: PaymentRoute
  },
  {
    path: '/otp',
    route: OtpRoute
  },
  {
    path: '/stats',
    route: StatsRouter
  },
  {
    path: '/guide',
    route: GuideApplicationRouter
  }
]

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route)
})
