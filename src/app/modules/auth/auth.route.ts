import { NextFunction, Request, Response, Router } from 'express'
import { AuthController } from './auth.controller'
import checkAuth from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import passport from 'passport'

const router = Router()

router.post('/login', AuthController.credentialLogin)
router.get('/refresh-token', AuthController.getNewAccessToken)
router.post('/logout', AuthController.logout)
router.post(
  '/change-password',
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
)
router.post(
  '/reset-password',
  checkAuth(...Object.values(Role)),
  AuthController.resetPassword
)
router.post(
  '/set-password',
  checkAuth(...Object.values(Role)),
  AuthController.setPassword
)

router.get(
  '/google',
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect as string
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: redirect
    })(req, res, next)
  }
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  AuthController.googleCallback
)
export const AuthRouter = router
