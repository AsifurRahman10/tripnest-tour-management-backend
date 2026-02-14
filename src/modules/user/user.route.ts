import { Router } from 'express'
import { UserControllers } from './user.controller'

const router = Router()

router.post('/register', UserControllers.createUser)
router.get('/all-user', UserControllers.getAllUser)

export const UserRouter = router
