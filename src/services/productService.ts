import { StatusCodes } from 'http-status-codes'
import {
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT,
  SORT_BY_DEFAULT
} from '~/constants/pagination'
import Product from '~/models/productModel'
import { IApiResponse, IQueryParams } from '~/types/common'
import {
  AddProductPayload,
  EditProductPayload,
  IProduct,
  ProductList
} from '~/types/productType'
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

const getAll = async (): Promise<IApiResponse> => {
  try {
    const products = await Product.find({ _destroy: false })

    return {
      statusCode: StatusCodes.OK,
      message: 'Get all products are successfully.',
      data: products
    }
  } catch (error) {
    throw error
  }
}

const getList = async (
  query: IQueryParams
): Promise<IApiResponse<ProductList>> => {
  const {
    page = PAGE_DEFAULT,
    limit = LIMIT_DEFAULT,
    sort = SORT.ASC,
    sortBy = SORT_BY_DEFAULT
  } = query || {}
  try {
    const queries: Record<string, any> = {
      _destroy: false
    }

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: +limit,
      sort: { [sortBy as string]: sort }
    }

    const products = (await Product.find(queries, null, options)) as IProduct[]
    const total = await Product.countDocuments()
    const totalPages = Math.ceil(Number(total) / Number(limit))

    return {
      statusCode: StatusCodes.OK,
      message: 'Get list products are successfully.',
      data: {
        products,
        pagination: {
          currentPage: +page,
          limit: +limit,
          total,
          totalPages
        }
      }
    }
  } catch (error) {
    throw error
  }
}

const getDetails = async (slug: string): Promise<IApiResponse> => {
  try {
    const productDetails = await Product.findOne({ slug })

    if (!productDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product does not exist!')
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'Get product details is successfully.',
      data: productDetails
    }
  } catch (error) {
    throw error
  }
}

const productService = {
  addNew,
  edit,
  getAll,
  getList,
  getDetails
}

export default productService
