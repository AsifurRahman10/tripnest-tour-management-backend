import { IGuideApplication } from './guideApplication.interface'
import { GuideApplication } from './guideApplication.model'

const createGuideApplication = async (payload: Partial<IGuideApplication>) => {
  const isUserAlreadyApplied = await GuideApplication.findOne({
    user: payload.user
  })
  if (isUserAlreadyApplied) {
    throw new Error('User has already applied for guide application')
  }

  const isDivisionExist = await GuideApplication.findOne({
    division: payload.division
  })
  if (!isDivisionExist) {
    throw new Error('Division does not exist')
  }

  const result = await GuideApplication.create(payload)
  return result
}

export const GuideApplicationService = {
  createGuideApplication
}
