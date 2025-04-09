import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import {
  AddProductTagPayload,
  EditProductTagPayload
} from '~/types/productTagType'
import ApiError from '~/utils/ApiError'

const addNew = async (req: Request, _: Response, next: NextFunction) => {
  const addNewSchema = Joi.object<AddProductTagPayload>({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().optional().allow('')
  })

  try {
    await addNewSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const editBySlug = async (req: Request, _: Response, next: NextFunction) => {
  const editSchema = Joi.object<EditProductTagPayload>({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().optional().allow('').trim().strict()
  })

  try {
    await editSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const productTagValidation = {
  addNew,
  editBySlug
}

export default productTagValidation
