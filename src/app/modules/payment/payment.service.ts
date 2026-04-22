import { BOOKING_STATUS } from '../booking/booking.interface'
import { Booking } from '../booking/booking.model'
import { PAYMENT_STATUS } from './payment.interface'
import { Payment } from './payment.model'

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
    { status: PAYMENT_STATUS.PAID },
    { new: true, runValidators: true }
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

export const PaymentService = {
  successPayment
}
