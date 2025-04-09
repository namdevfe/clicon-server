import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import Role from '~/models/roleModel'
import User from '~/models/userModel'
import { IApiResponse, IQueryParams } from '~/types/common'
import { AddRoleBodyTypes, EditRoleBodyTypes } from '~/types/roleType'
import ApiError from '~/utils/ApiError'

const addNew = async (reqBody: AddRoleBodyTypes): Promise<IApiResponse> => {
  const { name } = reqBody
  try {
    const existingRole = await Role.findOne({ name })

    let resData: IApiResponse | null = null

    if (existingRole) {
      if (!existingRole._destroy) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'This role has already exist.'
        )
      }

      await Role.findByIdAndDelete(existingRole._id)
      const addedRole = await Role.create(reqBody)
      resData = {
        statusCode: StatusCodes.CREATED,
        message: 'Add new role is successfully.',
        data: addedRole
      }
    } else {
      const addedRole = await Role.create(reqBody)
      resData = {
        statusCode: StatusCodes.CREATED,
        message: 'Add new role is successfully.',
        data: addedRole
      }
    }

    return resData
  } catch (error) {
    throw error
  }
}

const editById = async (
  id: string,
  reqBody: EditRoleBodyTypes
): Promise<IApiResponse> => {
  // const { name } = reqBody
  try {
    // const existingRole = await Role.findOne({ name })

    // if (existingRole) {
    //   throw new ApiError(
    //     StatusCodes.BAD_REQUEST,
    //     `Role ${name} has already exist.`
    //   )
    // }

    const editedRole = await Role.findByIdAndUpdate(id, reqBody, { new: true })

    return {
      statusCode: StatusCodes.OK,
      message: 'Updated role is successfully.',
      data: editedRole
    }
  } catch (error) {
    throw error
  }
}

const getRoles = async (query?: IQueryParams): Promise<IApiResponse> => {
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

  const roles = await Role.find(queries, null, options)
  const total = await Role.countDocuments({})
  const currentPage = Number(page)
  const totalPages = Math.ceil(Number(total / Number(limit)))

  return {
    statusCode: StatusCodes.OK,
    message: 'Get roles are successfully.',
    data: {
      roles,
      pagination: {
        currentPage,
        total,
        totalPages,
        limit: Number(limit)
      }
    }
  }
}

const getAll = async (): Promise<IApiResponse> => {
  try {
    const roles = await Role.find()

    return {
      statusCode: StatusCodes.OK,
      message: 'Get all role is successfully.',
      data: roles
    }
  } catch (error) {
    throw error
  }
}

const getRoleDetails = async (id: string): Promise<IApiResponse> => {
  try {
    const roleDeitals = await Role.findById(id)

    if (!roleDeitals) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cannot found this role.')
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'Get role details is successfully.',
      data: roleDeitals
    }
  } catch (error) {
    throw error
  }
}

const deleteRoleById = async (id: string): Promise<IApiResponse> => {
  const deletedRole = await Role.findByIdAndDelete(id, { new: true })

  if (!deletedRole) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Role does not exist!')
  }

  await User.updateMany({ role: deletedRole._id }, { $unset: { role: 1 } })

  return {
    statusCode: StatusCodes.OK,
    message: `Deleted role is successfully.`,
    data: deletedRole
  }
}

const roleService = {
  addNew,
  editById,
  getRoles,
  getAll,
  getRoleDetails,
  deleteRoleById
}

export default roleService
