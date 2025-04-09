import { StatusCodes } from 'http-status-codes'
import {
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT,
  SORT_BY_DEFAULT
} from '~/constants/pagination'
import Brand from '~/models/brandModel'
import ProductCategory from '~/models/productCategoryModel'
import {
  AddBrandPayload,
  BrandList,
  EditBrandPayload,
  IBrand
} from '~/types/brandType'
import { IApiResponse, IQueryParams } from '~/types/common'
import {
  AddProductCategoryPayload,
  EditProductCategoryPayload,
  IProductCategory,
  ProductCategoryList
} from '~/types/productCategoryType'
import ApiError from '~/utils/ApiError'
import slugify from '~/utils/slugify'

const addNew = async (payload: AddBrandPayload): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const existingBrand = await Brand.findOne({ name })

    if (existingBrand?._id) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Brand ${name} already exist.`
      )
    }

    // Add new
    const addData = {
      ...payload,
      slug: slugify(name)
    }

    const addedBrand = await Brand.create(addData)

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Added new branad is successfully.',
      data: addedBrand
    }
  } catch (error) {
    throw error
  }
}

const editBySlug = async (
  slug: string,
  payload: EditBrandPayload
): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const existingBrand = await Brand.findOne({ name })

    if (existingBrand) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        'This name brand already exist. Please try the other name.'
      )
    }

    const editData = {
      ...payload,
      slug: name && slugify(name)
    }

    const editedBrand = await Brand.findOneAndUpdate({ slug }, editData, {
      new: true
    })

    return {
      statusCode: StatusCodes.OK,
      message: 'Edited brand is succesfully.',
      data: editedBrand
    }
  } catch (error) {
    throw error
  }
}

const softDeleteBySlug = async (slug: string): Promise<IApiResponse> => {
  try {
    const deletedBrand = await Brand.findOneAndUpdate(
      { slug },
      { _destroy: true },
      { new: true }
    )

    if (!deletedBrand) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Cannot find product category to delete'
      )
    }

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted brand is successfully.`,
      data: deletedBrand
    }
  } catch (error) {
    throw error
  }
}

const hardDeleteBySlug = async (slug: string): Promise<IApiResponse> => {
  try {
    const deletedBrand = await Brand.findOneAndDelete({ slug }, { new: true })

    if (!deletedBrand) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Cannot find product category to delete.'
      )
    }

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted brand is successfully.`,
      data: deletedBrand
    }
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<IApiResponse> => {
  try {
    const brands = await Brand.find({ _destroy: false })
    return {
      statusCode: StatusCodes.OK,
      message: 'Get all brands are successfully.',
      data: brands
    }
  } catch (error) {
    throw error
  }
}

const getList = async (
  query: IQueryParams
): Promise<IApiResponse<BrandList>> => {
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

    const brands = (await Brand.find(queries, null, options)) as IBrand[]
    const total = await Brand.countDocuments({})
    const totalPages = Math.ceil(Number(total / Number(limit)))

    return {
      statusCode: StatusCodes.OK,
      message: 'Get list brands are successfully.',
      data: {
        brands,
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
    const brandDetails = await Brand.findOne({ slug })
    if (!brandDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cannot find brand.')
    }
    return {
      statusCode: StatusCodes.OK,
      message: 'Get brand details is successfully.',
      data: brandDetails
    }
  } catch (error) {
    throw error
  }
}

const brandService = {
  addNew,
  editBySlug,
  softDeleteBySlug,
  hardDeleteBySlug,
  getAll,
  getList,
  getDetailsBySlug
}

export default brandService
