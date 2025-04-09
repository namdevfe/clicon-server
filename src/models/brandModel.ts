import { model, Schema } from 'mongoose'

export const BRAND_COLLECTION_NAME = 'brands'

const brandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
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

const Brand = model(BRAND_COLLECTION_NAME, brandSchema)

export default Brand
