import { Types } from 'mongoose'

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUIDE = 'GUIDE'
}

export interface IAuthProvider {
  provider: 'google' | 'credential' // google , credential
  providerID: string
}

export enum IsActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCK = 'BLOCK'
}
export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password?: string
  phone?: string
  image?: string
  address?: string
  isDeleted?: boolean
  isActive?: IsActive
  isVerified?: string
  role: Role
  auths: IAuthProvider[]
  booking?: Types.ObjectId[]
  guides?: Types.ObjectId[]
}
