import cors from 'cors'
import express from 'express'
import { router } from './app/routers'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import expressSession from 'express-session'
import './app/config/passport'

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
app.use(cors())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1', router)

app.use(globalErrorHandler)

app.use(notFound)

export default app
