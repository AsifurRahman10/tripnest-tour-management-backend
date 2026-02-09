import cors from 'cors'
import express from 'express'
import { UserRouter } from './modules/user/user.route'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1/user', UserRouter)

export default app
