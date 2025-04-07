import { model, Schema } from 'mongoose'

export const PERMISSION_COLLECTION_NAME = 'permissions'

const permissionSchema = new Schema(
  {
    url: { type: String, required: true, unique: true },
    description: String,
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Permission = model(PERMISSION_COLLECTION_NAME, permissionSchema)

export default Permission
