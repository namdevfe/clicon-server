import { model, Schema } from 'mongoose'

export const PRODUCT_ATTRIBUTE_COLLECTION_NAME = 'product-attributes'

const productAttributeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const ProductAttribute = model(
  PRODUCT_ATTRIBUTE_COLLECTION_NAME,
  productAttributeSchema
)

export default ProductAttribute
