import z from 'zod'

const createTourTypeValidation = z.object({
  name: z.string().min(4, 'Name is required')
})
const updateTourTypeValidation = z.object({
  name: z.string().min(4, 'Name is required')
})

export const tourValidation = {
  createTourTypeValidation,
  updateTourTypeValidation
}
