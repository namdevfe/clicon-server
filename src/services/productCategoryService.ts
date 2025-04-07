import { StatusCodes } from 'http-status-codes'
import ProductCategory from '~/models/productCategoryModel'
import { IApiResponse } from '~/types/common'
import {
  AddProductCategoryPayload,
  EditProductCategoryPayload
} from '~/types/productCategoryType'
import ApiError from '~/utils/ApiError'
import slugify from '~/utils/slugify'

const addNew = async (
  payload: AddProductCategoryPayload
): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const existingProductCategory = await ProductCategory.findOne({ name })

    if (existingProductCategory?._id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `${name} already exist.`)
    }

    // Add new
    const addData = {
      ...payload,
      slug: slugify(name)
    }

    const addedProductCategory = await ProductCategory.create(addData)

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Added new product category is successfully.',
      data: addedProductCategory
    }
  } catch (error) {
    throw error
  }
}

const editBySlug = async (
  slug: string,
  payload: EditProductCategoryPayload
): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const existingProductCategory = await ProductCategory.findOne({ name })

    if (existingProductCategory) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        'This name already exist. Please try the other name.'
      )
    }

    const editData = {
      ...payload,
      slug: name && slugify(name)
    }

    const editedProductCategory = await ProductCategory.findOneAndUpdate(
      { slug },
      editData,
      { new: true }
    )

    return {
      statusCode: StatusCodes.OK,
      message: 'Edited product category is succesfully.',
      data: editedProductCategory
    }
  } catch (error) {
    throw error
  }
}

const productCategoryService = { addNew, editBySlug }

export default productCategoryService
