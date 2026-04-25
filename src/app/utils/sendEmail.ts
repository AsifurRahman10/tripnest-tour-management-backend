/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer'
import { envVars } from '../config/config'
import path from 'path'
import ejs from 'ejs'
import AppError from '../errorHelpers/AppError'

const transporter = nodemailer.createTransport({
  host: envVars.SMTP.SMTP_HOST,
  port: parseInt(envVars.SMTP.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.SMTP.SMTP_USER,
    pass: envVars.SMTP.SMTP_PASSWORD
  }
})

interface SendEmailProps {
  to: string
  subject: string
  templateName: string
  templateData?: Record<string, any>
  attachment?: {
    filename: string
    content: Buffer | string
    contentType: string
  }[]
}

export const sendEmail = async ({
  to,
  subject,
  attachment,
  templateName,
  templateData
}: SendEmailProps) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src/app/utils/templates',
      `${templateName}.ejs`
    )
    const html = await ejs.renderFile(templatePath, templateData)
    await transporter.sendMail({
      from: envVars.SMTP.SMTP_USER,
      to: to,
      subject: subject,
      html: html,
      attachments: attachment?.map((item) => ({
        filename: item.filename,
        content: item.content,
        contentType: item.contentType
      }))
    })
    console.log(`Email send to ${to}`)
  } catch (error: any) {
    console.log('Error sending email:', error.message)
    throw new AppError(401, 'Failed to send email')
  }
}
