import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import {
  LoginUserBodyType,
  LogoutBodyTypes,
  RefreshTokenBodyTypes,
  RegisterUserBodyType,
  VerifyOTPBodyTypes
} from '~/types/userType'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

const register = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object<RegisterUserBodyType>({
    firstName: Joi.string().required().trim().strict(),
    lastName: Joi.string().required().trim().strict(),
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 1,
        tlds: { allow: ['com'] }
      }),
    password: Joi.string().required().min(6).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object<VerifyOTPBodyTypes>({
    otpCode: Joi.string().required().length(6)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error?.message))
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object<LoginUserBodyType>({
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 1,
        tlds: { allow: ['com'] }
      }),
    password: Joi.string().required().trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object<RefreshTokenBodyTypes>({
    refreshToken: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error?.message))
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object<LogoutBodyTypes>({
    refreshToken: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error?.message))
  }
}

const authValidation = {
  register,
  verifyOTP,
  login,
  refreshToken,
  logout
}

export default authValidation
