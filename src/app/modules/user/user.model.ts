import { model, Schema } from 'mongoose'
import { IAuthProvider, IsActive, IUser, Role } from './user.interface'

const authSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerID: { type: String, required: true }
  },
  {
    versionKey: false,
    _id: false
  }
)

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    image: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE
    },
    isVerified: { type: Boolean },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER
    },
    auths: [authSchema]
    // booking:
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const User = model<IUser>('User', userSchema)
