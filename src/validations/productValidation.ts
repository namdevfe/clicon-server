import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { AddProductPayload } from '~/types/productType'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

const addNew = async (req: Request, res: Response, next: NextFunction) => {
  const addProductSchema = Joi.object<AddProductPayload>({
    name: Joi.string().required().trim().strict(),
    description: Joi.string().optional().allow('').trim().strict(),
    price: Joi.number().required().default(0),
    oldPrice: Joi.number().optional().default(0),
    quantity: Joi.number().required(),
    specification: Joi.string().optional().allow(''),
    stock: Joi.number().default(0),
    totalRatings: Joi.number().default(0),
    imageCover: Joi.string().required().trim().strict(),
    images: Joi.array().items(Joi.string().trim().strict()).default([]),
    category: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .trim()
      .strict(),
    brand: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .trim()
      .strict(),
    tags: Joi.array().items(
      Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
        .trim()
        .strict()
    )
  })

  try {
    await addProductSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error?.message))
  }
}

const productValidation = {
  addNew
}

export default productValidation
