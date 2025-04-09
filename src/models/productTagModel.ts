import { model, Schema } from 'mongoose'

export const PRODUCT_TAG_COLLECTION_NAME = 'product-tags'

const productTagSchema = new Schema(
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

const ProductTag = model(PRODUCT_TAG_COLLECTION_NAME, productTagSchema)

export default ProductTag
