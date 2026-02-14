import z from 'zod'
import { IsActive, Role } from './user.interface'

export const createUserZodSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),

  email: z.string().email('Invalid email format'),

  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Password must be at least 8 characters and include one uppercase letter and one number'
    )
    .optional(),

  phone: z.string().optional(),

  image: z.string().url('Image must be a valid URL').optional(),

  address: z.string().optional(),
})

export const updateUserZodSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),

  email: z.string().email('Invalid email format').optional(),

  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Password must be at least 8 characters and include one uppercase letter and one number'
    )
    .optional(),

  phone: z.string().optional(),

  image: z.string().url('Image must be a valid URL').optional(),

  address: z.string().optional(),

  role: z.enum(Object.values(Role)).optional(),

  isActive: z.enum(Object.values(IsActive)).optional(),

  isDeleted: z.boolean().optional(),

  isVerified: z.string().optional(),
})

export const userValidation = {
  createUserZodSchema,
  updateUserZodSchema,
}
