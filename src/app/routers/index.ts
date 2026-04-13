import { Router } from 'express'
import { UserRouter } from '../modules/user/user.route'
import { AuthRouter } from '../modules/auth/auth.route'
import { DivisionRouter } from '../modules/Division/division.route'

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
  }
]

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route)
})
