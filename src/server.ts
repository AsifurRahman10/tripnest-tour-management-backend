import { Server } from 'http'

import mongoose from 'mongoose'
import app from './app'

let server: Server

const startServer = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tripnest-management')
    console.log('Server is connected')

    server = app.listen(3000, () => {
      console.log(`app is listening on post ${3000}`)
    })
  } catch (error) {
    console.log(error)
  }
}

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception received. Server shuting down', err)

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }

  process.exit(1)
})
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection received. Server shuting down', err)

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }

  process.exit(1)
})
process.on('SIGTERM', (err) => {
  console.log('Sigterm signal received. Server shuting down', err)

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }

  process.exit(1)
})

startServer()
