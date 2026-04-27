import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { envVars } from './config'
import Stream from 'stream'

cloudinary.config({
  cloud_name: envVars.cloudinary.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.cloudinary.CLOUDINARY_API_KEY,
  api_secret: envVars.cloudinary.CLOUDINARY_API_SECRET
})

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  filename: string
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const publicId = `pdf/${filename}-${Date.now()}`

      const bufferStream = new Stream.PassThrough()
      bufferStream.end(buffer)

      cloudinary.uploader
        .upload_stream(
          { resource_type: 'auto', folder: 'pdf', public_id: publicId },
          (error, result) => {
            if (error) {
              reject(error)
            }
            resolve(result)
          }
        )
        .end(buffer)
    })
  } catch (error) {
    console.log(error)
  }
}

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
