import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import {
  AddPermissionBodyTypes,
  EditPermissionBodyTypes
} from '~/types/permissionType'
import ApiError from '~/utils/ApiError'

const addNew = async (req: Request, _res: Response, next: NextFunction) => {
  const schemaValidation = Joi.object<AddPermissionBodyTypes>({
    url: Joi.string().required().trim().strict(),
    description: Joi.string().allow('')
  })

  try {
    await schemaValidation.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const edit = async (req: Request, res: Response, next: NextFunction) => {
  const schemaValidation = Joi.object<EditPermissionBodyTypes>({
    url: Joi.string().optional(),
    description: Joi.string().optional()
  })

  try {
    await schemaValidation.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const permissionValidation = {
  addNew,
  edit
}

export default permissionValidation
