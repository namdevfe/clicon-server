import { StatusCodes } from 'http-status-codes'
import {
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT,
  SORT_BY_DEFAULT
} from '~/constants/pagination'
import ProductCategory from '~/models/productCategoryModel'
import Product from '~/models/productModel'
import { IApiResponse, IQueryParams } from '~/types/common'
import {
  AddProductCategoryPayload,
  EditProductCategoryPayload,
  IProductCategory,
  ProductCategoryList
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

const softDeleteBySlug = async (slug: string): Promise<IApiResponse> => {
  try {
    const deletedProductCategory = await ProductCategory.findOneAndUpdate(
      { slug },
      { _destroy: true },
      { new: true }
    )

    if (!deletedProductCategory) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Cannot find product category to delete'
      )
    }

    // Update category on product
    await Product.updateMany(
      { category: deletedProductCategory._id },
      { $unset: { category: 1 } }
    )

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted product category is successfully.`,
      data: deletedProductCategory
    }
  } catch (error) {
    throw error
  }
}

const hardDeleteBySlug = async (slug: string): Promise<IApiResponse> => {
  try {
    const deletedProductCategory = await ProductCategory.findOneAndDelete(
      { slug },
      { new: true }
    )

    if (!deletedProductCategory) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Cannot find product category to delete.'
      )
    }

    // Update category on product
    await Product.updateMany(
      { category: deletedProductCategory._id },
      { $unset: { category: 1 } }
    )

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted product category is successfully.`,
      data: deletedProductCategory
    }
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<IApiResponse> => {
  try {
    const productCategories = await ProductCategory.find({ _destroy: false })
    return {
      statusCode: StatusCodes.OK,
      message: 'Get all product categories are successfully.',
      data: productCategories
    }
  } catch (error) {
    throw error
  }
}

const getList = async (
  query: IQueryParams
): Promise<IApiResponse<ProductCategoryList>> => {
  const {
    page = PAGE_DEFAULT,
    limit = LIMIT_DEFAULT,
    sort = SORT.ASC,
    sortBy = SORT_BY_DEFAULT
  } = query
  try {
    const queries: Record<string, any> = {
      _destroy: false
    }

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: { [sortBy]: sort }
    }

    const productCategories = (await ProductCategory.find(
      queries,
      null,
      options
    )) as IProductCategory[]
    const total = await ProductCategory.countDocuments({})
    const totalPages = Math.ceil(Number(total / Number(limit)))

    return {
      statusCode: StatusCodes.OK,
      message: 'Get list product categories are successfully.',
      data: {
        productCategories,
        pagination: {
          currentPage: Number(page),
          limit: Number(limit),
          total,
          totalPages
        }
      }
    }
  } catch (error) {
    throw error
  }
}

const getDetailsBySlug = async (slug: string): Promise<IApiResponse> => {
  try {
    const productCategoryDetails = await ProductCategory.findOne({ slug })
    if (!productCategoryDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cannot find product category.')
    }
    return {
      statusCode: StatusCodes.OK,
      message: 'Get product category details is successfully.',
      data: productCategoryDetails
    }
  } catch (error) {
    throw error
  }
}

const productCategoryService = {
  addNew,
  editBySlug,
  softDeleteBySlug,
  hardDeleteBySlug,
  getAll,
  getList,
  getDetailsBySlug
}

export default productCategoryService
