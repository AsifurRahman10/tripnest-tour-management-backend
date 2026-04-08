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
    'JWT_REFRESH_SECRET'
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
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string
  }
}

export const envVars = loadEnv()
