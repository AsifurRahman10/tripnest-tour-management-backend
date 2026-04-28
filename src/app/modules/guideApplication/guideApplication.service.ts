/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errorHelpers/AppError'
import { Division } from '../division/division.model'
import { Role } from '../user/user.interface'
import { User } from '../user/user.model'
import {
  GUIDE_APPLICATION_STATUS,
  IGuideApplication
} from './guideApplication.interface'
import { GuideApplication } from './guideApplication.model'
import httpStatusCode from 'http-status-codes'

const createGuideApplication = async (payload: Partial<IGuideApplication>) => {
  const isUserAlreadyApplied = await GuideApplication.findOne({
    user: payload.user
  })
  if (isUserAlreadyApplied) {
    throw new Error('User has already applied for guide application')
  }

  const isDivisionExist = await Division.findOne({
    _id: payload.division
  })
  if (!isDivisionExist) {
    throw new Error('Division does not exist')
  }

  const result = await GuideApplication.create(payload)
  return result
}

const updateGuideApplicationStatusById = async (id: string, status: string) => {
  const applicationData = await GuideApplication.findById(id)
  if (!applicationData) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Guide application not found')
  }
  const currentStatus = applicationData.status

  if (
    currentStatus === GUIDE_APPLICATION_STATUS.APPROVED ||
    currentStatus === GUIDE_APPLICATION_STATUS.REJECTED
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'Cannot update status of already approved or rejected application'
    )
  }

  if (
    currentStatus === GUIDE_APPLICATION_STATUS.PENDING &&
    status !== GUIDE_APPLICATION_STATUS.APPROVED &&
    status !== GUIDE_APPLICATION_STATUS.REJECTED
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      `Invalid status transition from ${currentStatus} to ${status}`
    )
  }

  applicationData.status = status as GUIDE_APPLICATION_STATUS
  await applicationData.save()

  await User.findByIdAndUpdate(applicationData.user, { role: Role.GUIDE })
  return applicationData
}

const getAllGuideApplications = async (query: Record<string, string>) => {
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const skip = (page - 1) * limit

  const filter: any = {}
  if (query.status) filter.status = query.status
  if (query.user) filter.user = query.user
  if (query.division) filter.division = query.division

  // Get total
  const total = await GuideApplication.countDocuments(filter)

  // Get applications with pagination
  let applications = await GuideApplication.find(filter)
    .populate('user', 'name email phone')
    .populate('division', 'name')
    .sort(query.sort || '-createdAt')
    .skip(skip)
    .limit(limit)

  // Search filter
  if (query.search) {
    const searchText = query.search.toLowerCase()
    applications = applications.filter((app: any) => {
      const userName = app.user?.name?.toLowerCase() || ''
      const userEmail = app.user?.email?.toLowerCase() || ''
      const divisionName = app.division?.name?.toLowerCase() || ''
      const experience = (app.experience || '').toString().toLowerCase()
      const qualification = (app.qualification || '').toString().toLowerCase()

      return (
        userName.includes(searchText) ||
        userEmail.includes(searchText) ||
        divisionName.includes(searchText) ||
        experience.includes(searchText) ||
        qualification.includes(searchText)
      )
    })
  }

  return {
    data: applications,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  }
}

export const GuideApplicationService = {
  createGuideApplication,
  updateGuideApplicationStatusById,
  getAllGuideApplications
}
