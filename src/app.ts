import cors from 'cors'
import express from 'express'
import { router } from './app/routers'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1', router)

app.use(globalErrorHandler)

app.use(notFound)

export default app
