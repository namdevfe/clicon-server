import { model, Schema } from 'mongoose'
import { USER_COLLECTION_NAME } from '~/models/userModel'

export const ROLE_COLLECTION_NAME = 'roles'

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    permissions: [{ type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME }],
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Role = model(ROLE_COLLECTION_NAME, roleSchema)

export default Role
