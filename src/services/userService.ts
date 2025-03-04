import { StatusCodes } from 'http-status-codes'
import User from '~/models/userModel'
import { LoginUserBodyType, RegisterUserBodyType } from '~/types/userType'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcrypt'
import { IApiResponse } from '~/types/common'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import Role from '~/models/roleModel'
import { ROLES } from '~/constants/role'

const hashPassword = async (plainPassword: string) => {
  const SALT_ROUNDS = 8
  return bcrypt.hashSync(plainPassword, SALT_ROUNDS)
}

const comparePassword = async (plainPassword: string, hashPassword: string) => {
  return bcrypt.compare(plainPassword, hashPassword)
}

const register = async (
  reqBody: RegisterUserBodyType
): Promise<IApiResponse> => {
  const { email, password, role } = reqBody
  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This email is already in use.'
      )
    }

    // Assign default role is CUSTOMER
    let roleInfo
    if (role) {
      roleInfo = await Role.findById(role)
    } else {
      const roles = await Role.find()
      roleInfo = roles.find((role) => role.name === ROLES.CUSTOMER)
    }

    const hashedPassword = await hashPassword(password)

    const addData = {
      ...reqBody,
      password: hashedPassword,
      role: roleInfo?._id
    }

    const { password: excludePassword, ...addedUser } = (
      await User.create(addData)
    ).toObject()

    return {
      statusCode: StatusCodes.CREATED,
      message: 'Add new user is successfully.',
      data: addedUser
    }
  } catch (error) {
    throw error
  }
}

const login = async (reqBody: LoginUserBodyType): Promise<IApiResponse> => {
  const { email, password } = reqBody
  try {
    const existingUser = await User.findOne({ email, _destroy: false })

    if (!existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found.')
    }

    const isCorrectPassword = await comparePassword(
      password,
      existingUser.password
    )

    if (!isCorrectPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is not correct.')
    }

    const accessToken = jwt.sign(
      { email, role: existingUser.role, uid: existingUser._id },
      env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME
      }
    )

    const refreshToken = jwt.sign(
      { email, uid: existingUser._id },
      env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_TIME
      }
    )

    return {
      statusCode: StatusCodes.OK,
      message: 'Login is successfully.',
      data: {
        accessToken,
        refreshToken
      }
    }
  } catch (error) {
    throw error
  }
}

const getProfile = async (userId: string): Promise<IApiResponse> => {
  try {
    const profile = await User.findById(userId)
      .select('-password')
      .populate('role', 'name')

    if (!profile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Not found.')
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'Get profile is successfully.',
      data: profile
    }
  } catch (error) {
    throw error
  }
}

const userService = {
  register,
  login,
  getProfile
}

export default userService
