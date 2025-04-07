import { model, Schema } from 'mongoose'
import { BRAND_COLLECTION_NAME } from '~/models/brandModel'
import { PRODUCT_CATEGORY_COLLECTION_NAME } from '~/models/productCategoryModel'
import { PRODUCT_TAG_COLLECTION_NAME } from '~/models/productTagModel'

export const PRODUCT_COLLECTION_NAME = 'products'

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: String },
    imageCover: { type: String },
    images: [String],
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 },
    quantity: { type: Number, required: true, default: 0 },
    specification: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: PRODUCT_CATEGORY_COLLECTION_NAME
    },
    tags: { type: Schema.Types.ObjectId, ref: PRODUCT_TAG_COLLECTION_NAME },
    brand: { type: Schema.Types.ObjectId, ref: BRAND_COLLECTION_NAME },
    stock: { type: Number, default: 0 },
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Brand = model(PRODUCT_COLLECTION_NAME, productSchema)

export default Brand
