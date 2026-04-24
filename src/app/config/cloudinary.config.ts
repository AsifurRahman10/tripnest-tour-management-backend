import { v2 as cloudinary } from 'cloudinary'
import { envVars } from './config'

cloudinary.config({
  cloud_name: envVars.cloudinary.CLOUD_NAME,
  api_key: envVars.cloudinary.API_KEY,
  api_secret: envVars.cloudinary.API_SECRET
})

export const cloudinaryUpload = cloudinary
