import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { AddProductCategoryPayload } from '~/types/productCategoryType'
import ApiError from '~/utils/ApiError'

const addNew = async (req: Request, _: Response, next: NextFunction) => {
  const addNewSchema = Joi.object<AddProductCategoryPayload>({
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

const productCategoryValidation = {
  addNew
}

export default productCategoryValidation
