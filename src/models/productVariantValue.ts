import { model, Schema } from 'mongoose'
import { PRODUCT_COLLECTION_NAME } from '~/models/productModel'

export const PRODUCT_VARIANT_VALUE_COLLECTION_NAME = 'product-variant-values'

const productVariantValueSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: PRODUCT_COLLECTION_NAME },
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true },
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const ProductVariantValue = model(
  PRODUCT_VARIANT_VALUE_COLLECTION_NAME,
  productVariantValueSchema
)

export default ProductVariantValue
