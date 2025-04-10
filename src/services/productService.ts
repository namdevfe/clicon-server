import { StatusCodes } from 'http-status-codes'
import Product from '~/models/productModel'
import { IApiResponse } from '~/types/common'
import { AddProductPayload, EditProductPayload } from '~/types/productType'
import ApiError from '~/utils/ApiError'
import slugify from '~/utils/slugify'

const addNew = async (payload: AddProductPayload): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const existingProduct = await Product.findOne({ name })

    if (existingProduct) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Product name had already exist!'
      )
    }

    const addData = {
      ...payload,
      slug: slugify(payload.name)
    }

    const addedProduct = await Product.create(addData)

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Added product is successfully.',
      data: addedProduct
    }
  } catch (error) {
    throw error
  }
}

const edit = async (
  slug: string,
  payload: EditProductPayload
): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const editData = {
      ...payload,
      slug: name && slugify(name)
    }

    const editedProduct = await Product.findOneAndUpdate({ slug }, editData, {
      new: true
    })

    if (!editedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exist!')
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'Edited product is successfully.',
      data: editedProduct
    }
  } catch (error) {
    throw error
  }
}

const productService = {
  addNew,
  edit
}

export default productService
