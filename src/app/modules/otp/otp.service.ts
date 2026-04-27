import crypto from 'crypto'
import { redisClient } from '../../config/redis.config'
import { sendEmail } from '../../utils/sendEmail'
import AppError from '../../errorHelpers/AppError'
import { User } from '../user/user.model'

const otpExpiration = 2 * 60

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

  return otp
}

const sendOtp = async (email: string, name: string) => {
  const otp = generateOtp()

  const redisKey = `otp:${email}`

  await redisClient.set(redisKey, otp, {
    expiration: { type: 'EX', value: otpExpiration }
  })

  await sendEmail({
    to: email,
    subject: 'Your OTP for Tripnest',
    templateName: 'otp',
    templateData: {
      name,
      otp
    }
  })
}

const verifyOtp = async (email: string, otp: string) => {
  const redisKey = `otp:${email}`

  const savedOtp = await redisClient.get(redisKey)

  if (!savedOtp) {
    throw new AppError(400, 'Invalid or expired OTP')
  }

  if (savedOtp !== otp) {
    throw new AppError(400, 'Invalid or expired OTP')
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
