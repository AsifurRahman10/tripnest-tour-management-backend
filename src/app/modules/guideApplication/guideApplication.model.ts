import mongoose, { Schema } from 'mongoose'
import {
  GUIDE_APPLICATION_STATUS,
  IGuideApplication
} from './guideApplication.interface'

const guideApplicationSchema = new Schema<IGuideApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nidPhoto: { type: String, required: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    status: {
      type: String,
      enum: Object.values(GUIDE_APPLICATION_STATUS),
      default: GUIDE_APPLICATION_STATUS.PENDING
    }
  },
  { timestamps: true }
)

export const GuideApplication = mongoose.model<IGuideApplication>(
  'GuideApplication',
  guideApplicationSchema
)
