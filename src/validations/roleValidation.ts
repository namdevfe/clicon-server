import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { AddRoleBodyTypes, EditRoleBodyTypes } from '~/types/roleType'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

const addNew = async (req: Request, _res: Response, next: NextFunction) => {
  const schemaValidation = Joi.object<AddRoleBodyTypes>({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().optional().allow(''),
    permissions: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await schemaValidation.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const edit = async (req: Request, _res: Response, next: NextFunction) => {
  const schemaValidation = Joi.object<EditRoleBodyTypes>({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    permissions: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await schemaValidation.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const roleValidation = {
  addNew,
  edit
}

export default roleValidation
