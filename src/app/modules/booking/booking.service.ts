/* eslint-disable @typescript-eslint/no-explicit-any */
import { BOOKING_STATUS, IBooking } from './booking.interface'
import { User } from '../user/user.model'
import AppError from '../../errorHelpers/AppError'
import httpStatusCode from 'http-status-codes'
import { Booking } from './booking.model'
import { Payment } from '../payment/payment.model'
import { PAYMENT_STATUS } from '../payment/payment.interface'
import { Tour } from '../tour/tour.model'
import { sslCommerzService } from '../sslCommerz/sslCommerz.server'

const getTransactionId = () => {
  return `trans_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

// const createBooking = async (
//   bookingData: Partial<IBooking>,
//   userId: string
// ) => {
//   const transactionId = getTransactionId()
//   const session = await Booking.startSession()
//   session.startTransaction()
//   try {
//     const user = await User.findById(userId)

//     if (!user?.phone || !user?.address) {
//       throw new AppError(
//         httpStatusCode.BAD_REQUEST,
//         'Please update your profile with phone and address before booking a tour'
//       )
//     }

//     const tour = await Tour.findById(bookingData.tour).select('costFrom')

//     if (!tour?.costFrom) {
//       throw new AppError(httpStatusCode.NOT_FOUND, 'Tour not found')
//     }

//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const amount = tour.costFrom * bookingData.guestCount!

//     const booking = await Booking.create(
//       [
//         {
//           ...bookingData,
//           user: userId,
//           status: BOOKING_STATUS.PENDING
//         }
//       ],
//       { session }
//     )

//     const payment = await Payment.create(
//       [
//         {
//           booking: booking[0]._id,
//           status: PAYMENT_STATUS.UNPAID,
//           transactionId: transactionId,
//           amount: amount
//         }
//       ],
//       { session }
//     )

//     const updateBooking = await Booking.findByIdAndUpdate(
//       booking[0]._id,
//       { payment: payment[0]._id },
//       { new: true, runValidators: true, session }
//     )
//       .populate('tour', 'title, costFrom')
//       .populate('payment')
//       .populate('user', 'name email phone adress')

//     const userAddress = (updatedBooking?.user as any).address

// const paymentPayload = {
//   amount: amount,
//   transactionId: transactionId,
//   name: (updatedBooking?.user as any).name,
//   email: (updatedBooking?.user as any).email,
//   phoneNumber: (updatedBooking?.user as any).phone,
//   address: userAddress
// }

// const initializeSSLPayment =
//   await sslCommerzService.sslPaymentInit(paymentPayload)

//     session.commitTransaction()
//     session.endSession()

// // console.log(initializeSSLPayment)
// return {
//   updatedBooking,
//   paymentUrl: initializeSSLPayment?.GatewayPageURL || null
// }
//   } catch (error) {
//     await session.abortTransaction()
//     session.endSession()
//     throw error
//   }
// }

const createBooking = async (
  bookingData: Partial<IBooking>,
  userId: string
) => {
  const transactionId = getTransactionId()

  let bookingDoc = null
  let paymentDoc = null

  try {
    const user = await User.findById(userId)

    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        'Please update your profile with phone and address before booking a tour'
      )
    }

    const tour = await Tour.findById(bookingData.tour).select('costFrom')

    if (!tour?.costFrom) {
      throw new AppError(httpStatusCode.NOT_FOUND, 'Tour not found')
    }

    const amount = tour.costFrom * (bookingData.guestCount || 1)

    // 1️⃣ Create booking
    bookingDoc = await Booking.create({
      ...bookingData,
      user: userId,
      status: BOOKING_STATUS.PENDING
    })

    // 2️⃣ Create payment
    paymentDoc = await Payment.create({
      booking: bookingDoc._id,
      status: PAYMENT_STATUS.UNPAID,
      transactionId: transactionId,
      amount: amount
    })

    // 3️⃣ Update booking with payment
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingDoc._id,
      { payment: paymentDoc._id },
      { new: true, runValidators: true }
    )
      .populate('tour', 'title costFrom')
      .populate('payment')
      .populate('user', 'name email phone address')

    const userAddress = (updatedBooking?.user as any).address

    const paymentPayload = {
      amount: amount,
      transactionId: transactionId,
      name: (updatedBooking?.user as any).name,
      email: (updatedBooking?.user as any).email,
      phoneNumber: (updatedBooking?.user as any).phone,
      address: userAddress
    }

    const initializeSSLPayment =
      await sslCommerzService.sslPaymentInit(paymentPayload)
    // console.log(initializeSSLPayment)
    return {
      updatedBooking,
      paymentUrl: initializeSSLPayment?.GatewayPageURL || null
    }
  } catch (error) {
    // 🧹 Manual rollback (important)
    if (bookingDoc) {
      await Booking.findByIdAndDelete(bookingDoc._id)
    }
    if (paymentDoc) {
      await Payment.findByIdAndDelete(paymentDoc._id)
    }

    throw error
  }
}
const getAllBookings = async () => {}

const getMyBookings = async (userId: string) => {}
const getBookingById = async (id: string) => {}

const updateBookingById = async (
  id: string,
  bookingData: Partial<IBooking>
) => {}

export const BookingService = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingById
}
