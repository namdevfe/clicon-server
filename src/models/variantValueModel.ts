import { model, Schema } from 'mongoose'
import { VARIANT_COLLECTION_NAME } from '~/models/variantModel'

export const VARIANT_VALUE_COLLECTION_NAME = 'variant-values'

const variantValueSchema = new Schema(
  {
    variant: {
      type: Schema.Types.ObjectId,
      ref: VARIANT_COLLECTION_NAME
    },
    valueCode: {
      type: String,
      requiered: true,
      unique: true
    },
    value: { type: String, required: true, unique: true },
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const VariantValue = model(VARIANT_VALUE_COLLECTION_NAME, variantValueSchema)

export default VariantValue
