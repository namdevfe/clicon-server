import { StatusCodes } from 'http-status-codes'
import Permission from '~/models/permissionModel'
import { IApiResponse, IQueryParams } from '~/types/common'
import {
  AddPermissionBodyTypes,
  EditPermissionBodyTypes
} from '~/types/permissionType'
import ApiError from '~/utils/ApiError'

const addNew = async (
  reqBody: AddPermissionBodyTypes
): Promise<IApiResponse> => {
  try {
    const { url } = reqBody

    const existingPermission = await Permission.findOne({ url })

    let res: IApiResponse | null = null

    if (existingPermission) {
      if (existingPermission._destroy) {
        // Remove existing permission from database
        await Permission.findByIdAndDelete(existingPermission._id)

        // Add new
        const createdPermission = await Permission.create(reqBody)

        res = {
          statusCode: StatusCodes.CREATED,
          message: 'Add permission is successfully.',
          data: createdPermission
        }
      } else {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Permission had already exist.'
        )
      }
    } else {
      // Add new
      const createdPermission = await Permission.create(reqBody)

      res = {
        statusCode: StatusCodes.CREATED,
        message: 'Add permission is successfully.',
        data: createdPermission
      }
    }

    return res
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<IApiResponse> => {
  try {
    const permissions = await Permission.find()
    return {
      statusCode: StatusCodes.OK,
      message: 'Get all permissions are successfully.',
      data: permissions
    }
  } catch (error) {
    throw error
  }
}

const getList = async (query?: IQueryParams): Promise<IApiResponse> => {
  const {
    page = '1',
    limit = '10',
    sort = 'asc',
    sortBy = 'createdAt'
  } = query || {}

  const queries: Record<string, any> = {
    _destroy: false
  }

  const options = {
    skip: (Number(page) - 1) * Number(limit),
    limit: Number(limit),
    sort: { [sortBy as string]: sort }
  }

  const permissions = await Permission.find(queries, null, options)
  const total = await Permission.countDocuments({})
  const currentPage = Number(page)
  const totalPages = Math.ceil(Number(total / Number(limit)))

  return {
    statusCode: StatusCodes.OK,
    message: 'Get permissions are successfully.',
    data: {
      permissions,
      pagination: {
        currentPage,
        total,
        totalPages,
        limit: Number(limit)
      }
    }
  }
}

const edit = async (
  id: string,
  reqBody: EditPermissionBodyTypes
): Promise<IApiResponse> => {
  try {
    const editedPermission = await Permission.findByIdAndUpdate(id, reqBody, {
      new: true
    })

    return {
      statusCode: StatusCodes.OK,
      message: 'Edited permission is successfully.',
      data: editedPermission
    }
  } catch (error) {
    throw error
  }
}

const deleteById = async (id: string): Promise<IApiResponse> => {
  try {
    const deletedPermission = await Permission.findByIdAndDelete(id)

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted permission is successfully.`,
      data: deletedPermission
    }
  } catch (error) {
    throw error
  }
}

const permissionService = {
  addNew,
  getAll,
  getList,
  edit,
  deleteById
}

export default permissionService
