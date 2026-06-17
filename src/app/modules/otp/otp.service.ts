import crypto from 'crypto'
import { redisClient } from '../../config/redis.config'
import { sendEmail } from '../../utils/sendEmail'
import AppError from '../../errorHelpers/AppError'
import { User } from '../user/user.model'
import HttpStatusCode from 'http-status-codes'

const otpExpiration = 2 * 60

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

  return otp
}

const sendOtp = async (email: string) => {
  const otp = generateOtp()

  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError(HttpStatusCode.NOT_FOUND, 'User not found')
  }

  if (user.isVerified) {
    throw new AppError(HttpStatusCode.BAD_REQUEST, 'User is already verified')
  }

  const redisKey = `otp:${email}`

  await redisClient.set(redisKey, otp, {
    expiration: { type: 'EX', value: otpExpiration }
  })

  await sendEmail({
    to: email,
    subject: 'Your OTP for Tripnest',
    templateName: 'otp',
    templateData: {
      name: user.name,
      otp
    }
  })
}

const verifyOtp = async (email: string, otp: string) => {
  const redisKey = `otp:${email}`

  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError(HttpStatusCode.NOT_FOUND, 'User not found')
  }

  if (user.isVerified) {
    throw new AppError(HttpStatusCode.BAD_REQUEST, 'User is already verified')
  }

  const savedOtp = await redisClient.get(redisKey)

  if (!savedOtp) {
    throw new AppError(HttpStatusCode.BAD_REQUEST, 'Invalid or expired OTP')
  }

  if (savedOtp !== otp) {
    throw new AppError(HttpStatusCode.BAD_REQUEST, 'Invalid or expired OTP')
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del(redisKey)
  ])
  return true
}

export const OtpService = {
  sendOtp,
  verifyOtp
}
