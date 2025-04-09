import { StatusCodes } from 'http-status-codes'
import {
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT,
  SORT_BY_DEFAULT
} from '~/constants/pagination'
import ProductTag from '~/models/productTagModel'
import { IApiResponse, IQueryParams } from '~/types/common'
import {
  AddProductTagPayload,
  EditProductTagPayload,
  IProductTag,
  ProductTagList
} from '~/types/productTagType'
import ApiError from '~/utils/ApiError'
import slugify from '~/utils/slugify'

const addNew = async (payload: AddProductTagPayload): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const existingProductTag = await ProductTag.findOne({ name })

    if (existingProductTag?._id) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Product tag ${name} already exist.`
      )
    }

    // Add new
    const addData = {
      ...payload,
      slug: slugify(name)
    }

    const addedProductTag = await ProductTag.create(addData)

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Added new product tag is successfully.',
      data: addedProductTag
    }
  } catch (error) {
    throw error
  }
}

const editBySlug = async (
  slug: string,
  payload: EditProductTagPayload
): Promise<IApiResponse> => {
  const { name } = payload
  try {
    const existingProductTag = await ProductTag.findOne({ name })

    if (existingProductTag) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This product tag name already exist. Please try the other name.'
      )
    }

    const editData = {
      ...payload,
      slug: name && slugify(name)
    }

    const editedProductTag = await ProductTag.findOneAndUpdate(
      { slug },
      editData,
      {
        new: true
      }
    )

    return {
      statusCode: StatusCodes.OK,
      message: 'Edited product tag is succesfully.',
      data: editedProductTag
    }
  } catch (error) {
    throw error
  }
}

const softDeleteBySlug = async (slug: string): Promise<IApiResponse> => {
  try {
    const deletedProductTag = await ProductTag.findOneAndUpdate(
      { slug },
      { _destroy: true },
      { new: true }
    )

    if (!deletedProductTag) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Cannot find product tag to delete'
      )
    }

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted product tag is successfully.`,
      data: deletedProductTag
    }
  } catch (error) {
    throw error
  }
}

const hardDeleteBySlug = async (slug: string): Promise<IApiResponse> => {
  try {
    const deletedProductTag = await ProductTag.findOneAndDelete(
      { slug },
      { new: true }
    )

    if (!deletedProductTag) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Cannot find product tag to delete.'
      )
    }

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted product tag is successfully.`,
      data: deletedProductTag
    }
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<IApiResponse> => {
  try {
    const productTags = await ProductTag.find({ _destroy: false })
    return {
      statusCode: StatusCodes.OK,
      message: 'Get all product tags are successfully.',
      data: productTags
    }
  } catch (error) {
    throw error
  }
}

const getList = async (
  query: IQueryParams
): Promise<IApiResponse<ProductTagList>> => {
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

    const productTags = (await ProductTag.find(
      queries,
      null,
      options
    )) as IProductTag[]
    const total = await ProductTag.countDocuments({})
    const totalPages = Math.ceil(Number(total / Number(limit)))

    return {
      statusCode: StatusCodes.OK,
      message: 'Get list product tags are successfully.',
      data: {
        productTags,
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
    const productTagDetails = await ProductTag.findOne({ slug })
    if (!productTagDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cannot find product tag.')
    }
    return {
      statusCode: StatusCodes.OK,
      message: 'Get product tag details is successfully.',
      data: productTagDetails
    }
  } catch (error) {
    throw error
  }
}

const productTagService = {
  addNew,
  editBySlug,
  softDeleteBySlug,
  hardDeleteBySlug,
  getAll,
  getList,
  getDetailsBySlug
}

export default productTagService
