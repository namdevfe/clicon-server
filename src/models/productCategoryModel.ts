import { model, Schema } from 'mongoose'

export const PRODUCT_CATEGORY_COLLECTION_NAME = 'product-categories'

const productCategorySchema = new Schema(
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

const ProductCategory = model(
  PRODUCT_CATEGORY_COLLECTION_NAME,
  productCategorySchema
)

export default ProductCategory
