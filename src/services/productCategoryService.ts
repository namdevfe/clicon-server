import { StatusCodes } from 'http-status-codes'
import ProductCategory from '~/models/productCategoryModel'
import { IApiResponse } from '~/types/common'
import { AddProductCategoryPayload } from '~/types/productCategoryType'
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

const productCategoryService = { addNew }

export default productCategoryService
