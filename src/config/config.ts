import dotenv from 'dotenv'

dotenv.config()

interface EnvProps {
  PORT: string
  MONGODB_URL: string
  NODE_ENV: 'development' | 'production'
}

const loadEnv = (): EnvProps => {
  const envArray: string[] = ['PORT', 'MONGODB_URL', 'NODE_ENV']

  envArray.forEach((key) => {
    if (!process.env[key]) {
      throw new Error('ENV loading issue ')
    }
  })
  return {
    PORT: process.env.PORT as string,
    MONGODB_URL: process.env.MONGODB_URL as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  }
}

export const envVars = loadEnv()
