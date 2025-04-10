import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { AUTH_PATHS, PUBLIC_PATHS } from '~/constants/path'
import ApiError from '~/utils/ApiError'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { BASE_URL_API_ENDPOINT } from '~/constants/baseURL'

const verifyTokenMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let baseUrl = req.path

    const isPublicPath = [...AUTH_PATHS, ...PUBLIC_PATHS].some((path) => {
      return baseUrl.split(BASE_URL_API_ENDPOINT)[1].startsWith(path)
    })

    if (isPublicPath) {
      return next()
    }

    const token = req.headers.authorization

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token is required.')
    }

    const accessToken = token.split(' ')?.[1]

    const decode = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET_KEY)

    req.user = decode

    next()
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token is expired.'))
    } else {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token.'))
    }
    next(error)
  }
}

export default verifyTokenMiddleware
