import z from 'zod'

const createBookingValidation = z.object({
  tour: z.string().nonempty('Tour ID is required'),
  guestCount: z
    .number()
    .int()
    .positive('Guest count must be a positive integer')
})

const updateBookingValidation = z.object({
  tour: z.string().nonempty('Tour ID is required').optional(),
  guestCount: z
    .number()
    .int()
    .positive('Guest count must be a positive integer')
    .optional()
})

export const BookingValidation = {
  createBookingValidation,
  updateBookingValidation
}
