import { StatusCodes } from 'http-status-codes'
import Permission from '~/models/permissionModel'
import { IApiResponse } from '~/types/common'
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

const permissionService = {
  addNew,
  getAll,
  edit
}

export default permissionService
