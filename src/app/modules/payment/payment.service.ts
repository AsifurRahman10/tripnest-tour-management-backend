/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from '../../config/cloudinary.config'
import AppError from '../../errorHelpers/AppError'
import { generatePdf, IInvoiceData } from '../../utils/invoice'
import { sendEmail } from '../../utils/sendEmail'
import { BOOKING_STATUS } from '../booking/booking.interface'
import { Booking } from '../booking/booking.model'
import { sslCommerzService } from '../sslCommerz/sslCommerz.server'
import { ITour } from '../tour/tour.interface'
import { IUser } from '../user/user.interface'
import { PAYMENT_STATUS } from './payment.interface'
import { Payment } from './payment.model'
import httpStatusCode from 'http-status-codes'

const successPayment = async (query: Record<string, string>) => {
  if (!query.transactionId) {
    throw new AppError(400, 'Transaction ID is required')
  }

  const session = await Booking.startSession()

  let updatedBooking: any
  let updatePayment: any

  try {
    session.startTransaction()

    const payment = await Payment.findOne({
      transactionId: query.transactionId
    }).session(session)

    if (!payment) {
      throw new AppError(404, 'Payment not found')
    }

    // ✅ idempotency
    if (payment.status === PAYMENT_STATUS.PAID) {
      await session.commitTransaction()
      session.endSession()

      return {
        success: true,
        message: 'Payment already processed'
      }
    }

    payment.status = PAYMENT_STATUS.PAID
    updatePayment = await payment.save({ session })

    updatedBooking = await Booking.findByIdAndUpdate(
      payment.booking,
      { status: BOOKING_STATUS.CONFIRM },
      { new: true, session }
    )
      .populate('user', 'name email')
      .populate('tour', 'title')

    if (!updatedBooking) {
      throw new AppError(500, 'Booking update failed')
    }

    await session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }

  const pdfPayload: IInvoiceData = {
    transactionId: updatePayment.transactionId,
    amount: updatePayment.amount,
    bookingDate: updatedBooking.createdAt as Date,
    userName: (updatedBooking.user as IUser).name,
    tourTitle: (updatedBooking.tour as ITour).title || '',
    guestCount: updatedBooking.guestCount || 0,
    totalAmount: updatePayment.amount
  }

  const pdfBuffer = await generatePdf(pdfPayload)

  const pdfUploadData = await uploadBufferToCloudinary(
    pdfBuffer,
    `invoice-${updatePayment.transactionId}`
  )

  if (!pdfUploadData) {
    throw new AppError(500, 'PDF upload failed')
  }

  await Payment.findByIdAndUpdate(updatePayment._id, {
    invoiceUrl: pdfUploadData.secure_url
  })

  await sendEmail({
    to: (updatedBooking.user as IUser).email,
    subject: 'Tripnest Booking Invoice',
    templateName: 'invoice',
    templateData: pdfPayload,
    attachment: [
      {
        filename: `invoice-${updatePayment.transactionId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  })

  return {
    success: true,
    message: 'Payment successful'
  }
}

// const successPayment = async (query: Record<string, string>) => {
//   const updatePayment = await Payment.findOneAndUpdate(
//     { transactionId: query.transactionId },
//     { status: PAYMENT_STATUS.PAID }
//   )

//   if (!updatePayment) {
//     throw new Error('Payment not found')
//   }

//   const updatedBooking = await Booking.findByIdAndUpdate(
//     updatePayment.booking,
//     { status: BOOKING_STATUS.CONFIRM },
//     { new: true }
//   )
//     .populate('user', 'name email')
//     .populate('tour', 'title')

//   if (!updatedBooking) {
//     // ⚠️ rollback manually if booking fails
//     await Payment.findByIdAndUpdate(query.transactionId, {
//       status: PAYMENT_STATUS.FAILED
//     })

//     throw new Error('Booking update failed')
//   }

//   const pdfPayload: IInvoiceData = {
//     transactionId: updatePayment.transactionId,
//     amount: updatePayment.amount,
//     bookingDate: updatedBooking?.createdAt as Date,
//     userName: (updatedBooking?.user as unknown as IUser).name,
//     tourTitle: (updatedBooking?.tour as unknown as ITour).title || '',
//     guestCount: updatedBooking?.guestCount || 0,
//     totalAmount: updatePayment.amount
//   }

//   const pdfBuffer = await generatePdf(pdfPayload)

//   const pdfUploadData = await uploadBufferToCloudinary(
//     pdfBuffer,
//     `invoice-${updatePayment.transactionId}`
//   )

//   if (!pdfUploadData) {
//     throw new AppError(500, 'PDF upload failed')
//   }

//   await Payment.findByIdAndUpdate(
//     updatePayment._id,
//     {
//       invoiceUrl: pdfUploadData.secure_url
//     },
//     { runValidators: true }
//   )

//   await sendEmail({
//     to: (updatedBooking?.user as unknown as IUser).email,
//     subject: 'Tripnest Booking Invoice',
//     templateName: 'invoice',
//     templateData: pdfPayload,
//     attachment: [
//       {
//         filename: `invoice-${updatePayment.transactionId}.pdf`,
//         content: pdfBuffer,
//         contentType: 'application/pdf'
//       }
//     ]
//   })

//   return {
//     success: true,
//     message: 'Payment successful'
//   }
// }
const failPayment = async (query: Record<string, string>) => {
  if (!query.transactionId) {
    throw new Error('Transaction ID is required')
  }

  const session = await Booking.startSession()

  try {
    session.startTransaction()

    const payment = await Payment.findOne({
      transactionId: query.transactionId
    }).session(session)

    if (!payment) {
      throw new Error('Payment not found')
    }

    // ✅ idempotency (important)
    if (payment.status === PAYMENT_STATUS.FAILED) {
      await session.commitTransaction()
      session.endSession()

      return {
        success: true,
        message: 'Payment already marked as failed'
      }
    }

    payment.status = PAYMENT_STATUS.FAILED
    await payment.save({ session })

    await Booking.findByIdAndUpdate(
      payment.booking,
      { status: BOOKING_STATUS.FAILED },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    return {
      success: true,
      message: 'Payment failed'
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}
const cancelPayment = async (query: Record<string, string>) => {
  if (!query.transactionId) {
    throw new Error('Transaction ID is required')
  }

  const session = await Booking.startSession()

  try {
    session.startTransaction()

    const payment = await Payment.findOne({
      transactionId: query.transactionId
    }).session(session)

    if (!payment) {
      throw new Error('Payment not found')
    }

    // ✅ idempotency
    if (payment.status === PAYMENT_STATUS.CANCEL) {
      await session.commitTransaction()
      session.endSession()

      return {
        success: true,
        message: 'Payment already cancelled'
      }
    }

    payment.status = PAYMENT_STATUS.CANCEL
    await payment.save({ session })

    await Booking.findByIdAndUpdate(
      payment.booking,
      { status: BOOKING_STATUS.CANCEL },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    return {
      success: true,
      message: 'Payment cancelled'
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId })

  if (!payment) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Payment not found')
  }

  const booking = await Booking.findById({ _id: bookingId })

  const userAddress = (booking?.user as any).address

  const paymentPayload = {
    amount: payment.amount,
    transactionId: payment.transactionId,
    name: (booking?.user as any).name,
    email: (booking?.user as any).email,
    phoneNumber: (booking?.user as any).phone,
    address: userAddress
  }

  const initializeSSLPayment =
    await sslCommerzService.sslPaymentInit(paymentPayload)

  console.log(initializeSSLPayment)
  return {
    paymentUrl: initializeSSLPayment?.GatewayPageURL || null,
    transactionId: payment.transactionId,
    amount: payment.amount
  }
}

const getInvoice = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select('invoiceUrl')

  if (!payment) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Payment not found')
  }

  return payment.invoiceUrl
}

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoice
}
