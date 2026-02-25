/* eslint-disable no-console */
import { Server } from 'http'

import mongoose from 'mongoose'
import app from './app'
import { envVars } from './config/config'
import seedSuperAdmin from './utils/seedSuperAdmin'

let server: Server

const startServer = async () => {
  try {
    await mongoose.connect(envVars.MONGODB_URL)
    console.log('Server is connected')

    server = app.listen(envVars.PORT, () => {
      console.log(`app is listening on post ${envVars.PORT}`)
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
;(async () => {
  await startServer()
  await seedSuperAdmin()
})()
