import mongoose from 'mongoose'
import { IBaseType, IPagination } from '~/types/common'

export interface IProduct extends IBaseType {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  description: string
  price: number
  oldPrice: number
  imageCover: string
  images: string[]
  quantity: number
  specification: string
  category: mongoose.Types.ObjectId
  tags: mongoose.Types.ObjectId[]
  brand: mongoose.Types.ObjectId
  stock: number
  totalRatings: number
}

export type AddProductPayload = Omit<
  IProduct,
  '_id' | 'slug' | '_destroy' | 'createdAt' | 'updatedAt'
> & {
  attributes: { name: string; value: string }[]
}

export type EditProductPayload = Partial<
  Omit<IProduct, '_id' | 'slug' | 'createdAt' | 'updatedAt' | '_destroy'>
>

export type ProductList = {
  products: IProduct[]
  pagination: IPagination
}
