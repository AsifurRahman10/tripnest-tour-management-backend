import cors from 'cors'
import express from 'express'
import { router } from './routers'
import globalErrorHandler from './middlewares/globalErrorHandler'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1', router)

app.use(globalErrorHandler)

export default app
