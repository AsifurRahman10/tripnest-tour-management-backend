import { v2 as cloudinary } from 'cloudinary'
import { envVars } from './config'

cloudinary.config({
  cloud_name: envVars.cloudinary.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.cloudinary.CLOUDINARY_API_KEY,
  api_secret: envVars.cloudinary.CLOUDINARY_API_SECRET
})

export const deleteImageFromCloudinary = async (url: string) => {
  const regex = /\/upload\/v\d+\/(.+?)\.(jpg|jpeg|png|gif|webp)$/i
  const match = url.match(regex)
  if (match && match[1]) {
    const publicId = match[1]
    await cloudinaryUpload.uploader.destroy(publicId)
    console.log(`${publicId} image has been deleted from Cloudinary`)
  }
}

export const cloudinaryUpload = cloudinary
