import { Types } from 'mongoose'

export enum GUIDE_APPLICATION_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface IGuideApplication {
  user: Types.ObjectId
  nidPhoto: string
  division: Types.ObjectId
  status: GUIDE_APPLICATION_STATUS
}
