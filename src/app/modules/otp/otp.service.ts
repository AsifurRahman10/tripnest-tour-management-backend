import crypto from 'crypto'
import { redisClient } from '../../config/redis.config'
import { sendEmail } from '../../utils/sendEmail'

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

export const OtpService = {
  sendOtp
}
