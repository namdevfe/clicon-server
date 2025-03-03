import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BASE_URL_API_ENDPOINT } from '~/constants/baseURL'
import { PUBLIC_PATHS } from '~/constants/path'
import Permission from '~/models/permissionModel'
import Role from '~/models/roleModel'
import ApiError from '~/utils/ApiError'

const verifyPermissionMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Kiểm tra phần cuối của URL có phải là một ObjectId (24 ký tự hex)
    const objectIdPattern = /^[0-9a-fA-F]{24}$/

    let baseUrl = req.path

    // Kiểm tra nếu phần cuối của URL là một ObjectId, loại bỏ phần ID (ví dụ: /roles/edit-role/60c72b2f9f1b2c001fbb04f8 -> /roles/edit-role)
    const pathParts = req.path.split('/')
    const lastPart = pathParts[pathParts.length - 1]

    if (objectIdPattern.test(lastPart)) {
      // Nếu phần cuối của URL là ObjectId, loại bỏ nó
      baseUrl = req.path.replace(`/${lastPart}`, '') // Loại bỏ phần ID ObjectId
    }

    const isPubicPath = PUBLIC_PATHS.includes(
      baseUrl.split(BASE_URL_API_ENDPOINT)[1]
    )

    if (isPubicPath) {
      return next()
    }

    const roleInfo = await Role.findById(req.user?.role)

    const permissionIds = roleInfo?.permissions || []

    const listPermission = await Permission.find({
      _id: { $in: permissionIds }
    })

    if (
      listPermission.length > 0 &&
      listPermission.some((el) =>
        el.url.includes(baseUrl.split(BASE_URL_API_ENDPOINT)[1])
      )
    ) {
      return next()
    } else {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot access this resource.')
    }
  } catch (error) {
    next(error)
  }
}

export default verifyPermissionMiddleware
