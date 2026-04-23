/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errorHelpers/AppError'
import { BOOKING_STATUS } from '../booking/booking.interface'
import { Booking } from '../booking/booking.model'
import { sslCommerzService } from '../sslCommerz/sslCommerz.server'
import { PAYMENT_STATUS } from './payment.interface'
import { Payment } from './payment.model'
import httpStatusCode from 'http-status-codes'

// const successPayment = async (query: Record<string, string>) => {
//   const session = await Booking.startSession()
//   session.startTransaction()
//   try {
//     const updatePayment = await Payment.findByIdAndUpdate(
//       query.transactionId,
//       { status: PAYMENT_STATUS.PAID },
//       { new: true, runValidators: true, session }
//     )

//     await Booking.findByIdAndUpdate(
//       updatePayment?.booking,
//       { status: BOOKING_STATUS.CONFIRM },
//       { new: true, session }
//     )

//     session.commitTransaction()
//     session.endSession()

//     return {
//       success: true,
//       message: 'Payment successful'
//     }
//   } catch (error) {
//     await session.abortTransaction()
//     session.endSession()
//     throw error
//   }
// }

const successPayment = async (query: Record<string, string>) => {
  const updatePayment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.PAID }
  )

  if (!updatePayment) {
    throw new Error('Payment not found')
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    updatePayment.booking,
    { status: BOOKING_STATUS.CONFIRM },
    { new: true }
  )

  if (!updatedBooking) {
    // ⚠️ rollback manually if booking fails
    await Payment.findByIdAndUpdate(query.transactionId, {
      status: PAYMENT_STATUS.FAILED
    })

    throw new Error('Booking update failed')
  }

  return {
    success: true,
    message: 'Payment successful'
  }
}
const failPayment = async (query: Record<string, string>) => {
  const updatePayment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.FAILED }
  )

  const updatedBooking = await Booking.findByIdAndUpdate(
    updatePayment?.booking,
    { status: BOOKING_STATUS.FAILED }
  )

  if (!updatedBooking) {
    // ⚠️ rollback manually if booking fails
    await Payment.findByIdAndUpdate(query.transactionId, {
      status: PAYMENT_STATUS.FAILED
    })

    throw new Error('Booking update failed')
  }

  return {
    success: true,
    message: 'Payment failed'
  }
}
const cancelPayment = async (query: Record<string, string>) => {
  const updatePayment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.CANCEL }
  )

  if (!updatePayment) {
    throw new Error('Payment not found')
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    updatePayment.booking,
    { status: BOOKING_STATUS.CANCEL }
  )

  if (!updatedBooking) {
    // ⚠️ rollback manually if booking fails
    await Payment.findByIdAndUpdate(query.transactionId, {
      status: PAYMENT_STATUS.CANCEL
    })

    throw new Error('Booking update failed')
  }

  return {
    success: true,
    message: 'Payment cancelled'
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

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment
}
