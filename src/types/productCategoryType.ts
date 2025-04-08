import mongoose from 'mongoose'
import { IApiResponse, IBaseType, IPagination } from '~/types/common'

export interface IProductCategory extends IBaseType {
  _id: mongoose.Types.ObjectId
  name: string
  slug?: string
  description?: string
}

export type AddProductCategoryPayload = Pick<
  IProductCategory,
  'name' | 'description'
>

export type EditProductCategoryPayload = Pick<
  IProductCategory,
  'name' | 'description'
>

export type ProductCategoryList = {
  productCategories: IProductCategory[]
  pagination: IPagination
}
