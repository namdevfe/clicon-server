import { IBaseType } from '~/types/common'

export interface IProductCategory extends IBaseType {
  _id: string
  name: string
  slug?: string
  description?: string
}

export type AddProductCategoryPayload = Pick<
  IProductCategory,
  'name' | 'description'
>
