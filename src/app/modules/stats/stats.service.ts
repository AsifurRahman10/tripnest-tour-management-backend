import { Booking } from '../booking/booking.model'
import { Tour } from '../tour/tour.model'
import { IsActive } from '../user/user.interface'
import { User } from '../user/user.model'

const now = new Date()

const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)

const userStats = async () => {
  const totalUserPromise = User.countDocuments()

  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE
  })
  const totalInactiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE
  })
  const totalBlockUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCK
  })

  const newUserLastSevenDaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  })
  const newUserLastThirtyDaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  })

  const usersByRolePromise = User.aggregate([
    // group the roles
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ])

  const [
    totalUser,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockUsers,
    newUserLastSevenDays,
    newUserLastThirtyDays,
    usersByRole
  ] = await Promise.all([
    totalUserPromise,
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockUsersPromise,
    newUserLastSevenDaysPromise,
    newUserLastThirtyDaysPromise,
    usersByRolePromise
  ])

  return {
    totalUser,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockUsers,
    newUserLastSevenDays,
    newUserLastThirtyDays,
    usersByRole
  }
}

const tourStats = async () => {
  const totalToursPromise = Tour.countDocuments()
  const totalToursByTourTypePromise = Tour.aggregate([
    // get tourType data
    {
      $lookup: {
        from: 'tourtypes',
        localField: 'tourType',
        foreignField: '_id',
        as: 'tourTypeData'
      }
    },

    // unwind
    {
      $unwind: '$tourTypeData'
    },
    // group by tourType
    {
      $group: {
        _id: '$tourTypeData.name',
        count: { $sum: 1 }
      }
    }
  ])

  const avgTourCostPromise = Tour.aggregate([
    // group and do avg
    {
      $group: {
        _id: null,
        avgCost: { $avg: '$costFrom' }
      }
    }
  ])

  const totalToursByDivisionPromise = Tour.aggregate([
    // get tourType data
    {
      $lookup: {
        from: 'divisions',
        localField: 'division',
        foreignField: '_id',
        as: 'divisionData'
      }
    },

    // unwind
    {
      $unwind: '$divisionData'
    },
    // group by division
    {
      $group: {
        _id: '$divisionData.name',
        count: { $sum: 1 }
      }
    }
  ])

  const totalHighestBookedTourPromise = Booking.aggregate([
    // group tour
    {
      $group: {
        _id: '$tour',
        bookingCount: { $sum: 1 }
      }
    },
    // sort
    {
      $sort: { bookingCount: -1 }
    },
    // limit
    {
      $limit: 5
    },
    // get tour data
    {
      $lookup: {
        from: 'tours',
        let: { tourId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$tourId'] }
            }
          }
        ],
        as: 'tourData'
      }
    },

    // project
    {
      $project: {
        bookingCount: 1,
        'tourData.title': 1,
        'tourData.slug': 1
      }
    }
  ])

  const [
    totalTours,
    toursByTourType,
    avgTourCost,
    totalToursByDivision,
    highestBookedTour
  ] = await Promise.all([
    totalToursPromise,
    totalToursByTourTypePromise,
    avgTourCostPromise,
    totalToursByDivisionPromise,
    totalHighestBookedTourPromise
  ])

  return {
    totalTours,
    toursByTourType,
    avgTourCost: avgTourCost[0].avgCost,
    totalToursByDivision,
    highestBookedTour
  }
}

export const StatsService = {
  userStats,
  tourStats
}
