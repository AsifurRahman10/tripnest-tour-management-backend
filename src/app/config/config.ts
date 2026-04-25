import dotenv from 'dotenv'

dotenv.config()

interface EnvProps {
  PORT: string
  MONGODB_URL: string
  NODE_ENV: 'development' | 'production'
  JWT_SECRET: string
  JWT_EXPIRE: string
  BCRYPT_SALT_ROUND: string
  SUPER_ADMIN_EMAIL: string
  SUPER_ADMIN_PASSWORD: string
  JWT_REFRESH_EXPIRE: string
  JWT_REFRESH_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  GOOGLE_CALLBACK_URL: string
  FRONTEND_URL: string
  SSL: {
    STORE_ID: string
    STORE_PASS: string
    SSL_PAYMENT_API: string
    SSL_VALIDATION_API: string
    SSL_BACKEND_SUCCESS_URL: string
    SSL_BACKEND_FAIL_URL: string
    SSL_BACKEND_CANCEL_URL: string
    SSL_FRONTEND_SUCCESS_URL: string
    SSL_FRONTEND_FAIL_URL: string
    SSL_FRONTEND_CANCEL_URL: string
  }
  cloudinary: {
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
  }
  SMTP: {
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASSWORD: string
  }
}

const loadEnv = (): EnvProps => {
  const envArray: string[] = [
    'PORT',
    'MONGODB_URL',
    'NODE_ENV',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'BCRYPT_SALT_ROUND',
    'SUPER_ADMIN_EMAIL',
    'SUPER_ADMIN_PASSWORD',
    'JWT_REFRESH_EXPIRE',
    'JWT_REFRESH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'FRONTEND_URL',
    'STORE_ID',
    'STORE_PASS',
    'SSL_PAYMENT_API',
    'SSL_VALIDATION_API',
    'SSL_BACKEND_SUCCESS_URL',
    'SSL_BACKEND_FAIL_URL',
    'SSL_BACKEND_CANCEL_URL',
    'SSL_FRONTEND_SUCCESS_URL',
    'SSL_FRONTEND_FAIL_URL',
    'SSL_FRONTEND_CANCEL_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD'
  ]

  envArray.forEach((key) => {
    if (!process.env[key]) {
      throw new Error('ENV loading issue ')
    }
  })
  return {
    PORT: process.env.PORT as string,
    MONGODB_URL: process.env.MONGODB_URL as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRE: process.env.JWT_EXPIRE as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    SSL: {
      STORE_ID: process.env.STORE_ID as string,
      STORE_PASS: process.env.STORE_PASS as string,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      SSL_BACKEND_SUCCESS_URL: process.env.SSL_BACKEND_SUCCESS_URL as string,
      SSL_BACKEND_FAIL_URL: process.env.SSL_BACKEND_FAIL_URL as string,
      SSL_BACKEND_CANCEL_URL: process.env.SSL_BACKEND_CANCEL_URL as string,
      SSL_FRONTEND_SUCCESS_URL: process.env.SSL_FRONTEND_SUCCESS_URL as string,
      SSL_FRONTEND_FAIL_URL: process.env.SSL_FRONTEND_FAIL_URL as string,
      SSL_FRONTEND_CANCEL_URL: process.env.SSL_FRONTEND_CANCEL_URL as string
    },
    cloudinary: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string
    },
    SMTP: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD as string
    }
  }
}

export const envVars = loadEnv()
