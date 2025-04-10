import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BASE_URL_API_ENDPOINT } from '~/constants/baseURL'
import { AUTH_PATHS, PUBLIC_PATHS } from '~/constants/path'
import Permission from '~/models/permissionModel'
import Role from '~/models/roleModel'
import ApiError from '~/utils/ApiError'

const verifyPermissionMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let baseUrl = req.path

    // If path is public api then run next(). Don't check token is sent on header request
    const isPublicPath = [...AUTH_PATHS, ...PUBLIC_PATHS].some((path) => {
      return baseUrl.split(BASE_URL_API_ENDPOINT)[1].startsWith(path)
    })

    if (isPublicPath) {
      return next()
    }

    // Regex pattern check last past of URL endpoint
    const objectIdPattern = /^[0-9a-fA-F]{24}$/
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

    const pathParts = req.path.split('/')
    const lastPart = pathParts[pathParts.length - 1]

    if (objectIdPattern.test(lastPart)) {
      baseUrl = req.path.replace(`/${lastPart}`, '') // If last part is a objectId, it will be replaced by empty string
    } else if (slugPattern.test(lastPart)) {
      baseUrl = req.path.replace(`/${lastPart}`, '') // If last part is a slug format, it will be replaced by empty string
    }

    const roleInfo = await Role.findById(req.user?.role)

    const permissionIds = roleInfo?.permissions || []

    const listPermission = await Permission.find({
      _id: { $in: permissionIds }
    })

    if (
      listPermission.length > 0 &&
      listPermission.some(
        (el) => el.url === baseUrl.split(BASE_URL_API_ENDPOINT)[1]
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
