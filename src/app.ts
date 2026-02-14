import cors from 'cors'
import express from 'express'
import { router } from './routers'
import globalErrorHandler from './middlewares/globalErrorHandler'
import notFound from './middlewares/notFound'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1', router)

app.use(globalErrorHandler)

app.use(notFound)

export default app
