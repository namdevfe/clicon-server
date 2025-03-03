import { model, Schema } from 'mongoose'

export const USER_COLLECTION_NAME = 'users'

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    address: [String],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: String,
    avatar: String,
    role: { type: Schema.Types.ObjectId, ref: 'roles' },
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const User = model(USER_COLLECTION_NAME, userSchema)

export default User
