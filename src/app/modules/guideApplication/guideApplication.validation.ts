import z from 'zod'
import { GUIDE_APPLICATION_STATUS } from './guideApplication.interface'

const guideApplicationValidationSchema = z.object({
  division: z.string(),
  nidPhoto: z.string().optional()
})

const updateGuideApplicationStatusSchema = z.object({
  status: z.enum({ ...Object.values(GUIDE_APPLICATION_STATUS) })
})

export const guideApplicationValidation = {
  guideApplicationValidationSchema,
  updateGuideApplicationStatusSchema
}
