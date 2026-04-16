import z from 'zod'

const createTourTypeValidation = z.object({
  name: z.string().min(4, 'Name is required')
})
const updateTourTypeValidation = z.object({
  name: z.string().min(4, 'Name is required')
})

const createTourValidation = z.object({
  title: z.string().min(4, 'Title is required'),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  division: z.string().min(4, 'Division is required'),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuests: z.number().optional(),
  minAge: z.number().optional(),
  tourType: z.string().min(4, 'Tour type is required'),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional()
})
const updateTourValidation = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  division: z.string().optional(),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuests: z.number().optional(),
  minAge: z.number().optional(),
  tourType: z.string().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional()
})

export const tourValidation = {
  createTourTypeValidation,
  updateTourTypeValidation,
  createTourValidation,
  updateTourValidation
}
