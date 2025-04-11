import mongoose from 'mongoose'

export const VARIANT_COLLECTION_NAME = 'variants'

// Declare the Schema of the Mongo model
const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    _destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

//Export the model
const Variant = mongoose.model(VARIANT_COLLECTION_NAME, variantSchema)
export default Variant
