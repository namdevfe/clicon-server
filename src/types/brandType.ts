import mongoose from 'mongoose'
import { IApiResponse, IBaseType, IPagination } from '~/types/common'

export interface IBrand extends IBaseType {
  _id: mongoose.Types.ObjectId
  name: string
  slug?: string
  description?: string
}

export type AddBrandPayload = Pick<IBrand, 'name' | 'description'>

export type EditBrandPayload = Pick<IBrand, 'name' | 'description'>

export type BrandList = {
  brands: IBrand[]
  pagination: IPagination
}
