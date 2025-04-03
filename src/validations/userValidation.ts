import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { AddUser } from '~/types/userType'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

const addUser = async (req: Request, _: Response, next: NextFunction) => {
  const addUserSchema = Joi.object<AddUser>({
    firstName: Joi.string().required().trim().strict(),
    lastName: Joi.string().required().trim().strict(),
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 1,
        tlds: { allow: ['com'] }
      })
      .trim()
      .strict(),
    password: Joi.string().required().min(6).trim().strict(),
    addresses: Joi.array()
      .items(Joi.string().trim().strict())
      .optional()
      .default([]),
    avatar: Joi.string().optional().allow('').trim().strict(),
    role: Joi.string()
      .optional()
      .allow('')
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .trim()
      .strict()
  })

  try {
    await addUserSchema.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error?.message))
  }
}

const userValidation = {
  addUser
}

export default userValidation
