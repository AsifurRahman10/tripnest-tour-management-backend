import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinaryUpload } from './cloudinary.config'
import multer from 'multer'

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '')

      const extension = file.originalname.split('.').pop()

      return `${fileName}-${Date.now()}.${extension}`
    }
  }
})

export const multerUpload = multer({ storage })
