import cors from 'cors'
import express from 'express'
import { router } from './app/routers'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import expressSession from 'express-session'
import './app/config/passport'
import { envVars } from './app/config/config'

const app = express()
app.use(
  expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', 1)
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
  })
)
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Welcome to Tripnest API')
})

app.use('/api/v1', router)

app.use(globalErrorHandler)

app.use(notFound)

export default app
