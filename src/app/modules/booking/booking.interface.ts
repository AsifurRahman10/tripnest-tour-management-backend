import { Types } from 'mongoose'

export enum BOOKING_STATUS {
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
  FAILED = 'FAILED'
}

export interface IBooking {
  user: Types.ObjectId
  tour: Types.ObjectId
  payment: Types.ObjectId
  guestCount: number
  status: BOOKING_STATUS
}
