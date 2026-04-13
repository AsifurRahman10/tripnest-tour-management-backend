import z from 'zod'

const createDivisionValidation = z.object({
  name: z.string().min(4, 'Name must be at least 4 characters long'),
  slug: z.string().min(4, 'Slug must be at least 4 characters long'),
  description: z.string().optional(),
  thumbnail: z.url('Thumbnail must be a valid URL').optional()
})

export const divisionValidation = {
  createDivisionValidation
}
