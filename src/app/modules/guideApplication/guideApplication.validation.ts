import z from 'zod'

const guideApplicationValidationSchema = z.object({
  division: z.string(),
  nidPhoto: z.string().optional()
})

export const guideApplicationValidation = {
  guideApplicationValidationSchema
}
