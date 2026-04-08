import { Router } from 'express'
import { AuthController } from './auth.controller'

const router = Router()

router.post('/login', AuthController.credentialLogin)
router.get('/refresh-token', AuthController.getNewAccessToken)
export const AuthRouter = router
