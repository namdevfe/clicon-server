import mongoose, { model, Schema } from 'mongoose'
import { PRODUCT_ATTRIBUTE_COLLECTION_NAME } from '~/models/productAttributeModel'
import { PRODUCT_COLLECTION_NAME } from '~/models/productModel'

export const PRODUCT_ATTRIBUTE_VALUE_COLLECTION_NAME =
  'product-attribute-values'

const productAttributeValueSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: PRODUCT_COLLECTION_NAME
    },
    attribute: {
      type: Schema.Types.ObjectId,
      ref: PRODUCT_ATTRIBUTE_COLLECTION_NAME
    },
    value: { type: String, required: true },
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    strictPopulate: false
  }
)

const ProductAttributeValue = model(
  PRODUCT_ATTRIBUTE_VALUE_COLLECTION_NAME,
  productAttributeValueSchema
)

export default ProductAttributeValue
