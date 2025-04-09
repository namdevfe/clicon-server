import mongoose from 'mongoose'
import { IApiResponse, IBaseType, IPagination } from '~/types/common'

export interface IProductTag extends IBaseType {
  _id: mongoose.Types.ObjectId
  name: string
  slug?: string
  description?: string
}

export type AddProductTagPayload = Pick<IProductTag, 'name' | 'description'>

export type EditProductTagPayload = Pick<IProductTag, 'name' | 'description'>

export type ProductTagList = {
  productTags: IProductTag[]
  pagination: IPagination
}
