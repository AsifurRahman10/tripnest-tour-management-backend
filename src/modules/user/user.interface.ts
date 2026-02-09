import { Types } from 'mongoose'

export enum IRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUIDE = 'GUIDE',
}

export interface IAuthProvider {
  provider: string // google , credential
  providerID: string
}

export enum isActive {
  ACTIVE,
  INACTIVE,
  BLOCK,
}
export interface IUser {
  name: string
  email: string
  password?: string
  phone?: string
  image?: string
  address?: string
  isDeleted?: string
  isActive?: isActive
  isVerified?: string
  role: IRole
  auths: IAuthProvider[]
  booking?: Types.ObjectId[]
  guides?: Types.ObjectId[]
}
