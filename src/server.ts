import { Server } from 'http'
import express from 'express'
import mongoose from 'mongoose'

let server: Server

const app = express()

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

startServer()
