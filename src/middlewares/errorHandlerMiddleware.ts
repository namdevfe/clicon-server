import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { IApiError } from '~/types/common'

const errorHandlerMiddleware = (
  error: IApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!error.statusCode) error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: error.statusCode,
    message: error.message || StatusCodes[error.statusCode],
    stack: error.stack
  }

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  res.status(responseError.statusCode).json(responseError)
}

export default errorHandlerMiddleware
