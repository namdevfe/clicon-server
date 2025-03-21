import { StatusCodes } from 'http-status-codes'
import User from '~/models/userModel'
import {
  LoginUserBodyType,
  RegisterUserBodyType,
  UpdateUserBodyType
} from '~/types/userType'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcrypt'
import { IApiResponse, IQueryParams } from '~/types/common'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import Role from '~/models/roleModel'
import { ROLES } from '~/constants/role'
import { comparePassword, hashPassword } from '~/utils/hashPassword'

// const register = async (
//   reqBody: RegisterUserBodyType
// ): Promise<IApiResponse> => {
//   const { email, password, role } = reqBody
//   try {
//     const existingUser = await User.findOne({ email })

//     if (existingUser) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         'This email is already in use.'
//       )
//     }

//     // Assign default role is CUSTOMER
//     let roleInfo
//     if (role) {
//       roleInfo = await Role.findById(role)
//     } else {
//       const roles = await Role.find()
//       roleInfo = roles.find((role) => role.name === ROLES.CUSTOMER)
//     }

//     const hashedPassword = await hashPassword(password)

//     const addData = {
//       ...reqBody,
//       password: hashedPassword,
//       role: roleInfo?._id
//     }

//     const { password: excludePassword, ...addedUser } = (
//       await User.create(addData)
//     ).toObject()

//     return {
//       statusCode: StatusCodes.CREATED,
//       message: 'Add new user is successfully.',
//       data: addedUser
//     }
//   } catch (error) {
//     throw error
//   }
// }

// const login = async (reqBody: LoginUserBodyType): Promise<IApiResponse> => {
//   const { email, password } = reqBody
//   try {
//     const existingUser = await User.findOne({ email, _destroy: false })

//     if (!existingUser) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found.')
//     }

//     const isCorrectPassword = await comparePassword(
//       password,
//       existingUser.password
//     )

//     if (!isCorrectPassword) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is not correct.')
//     }

//     const accessToken = jwt.sign(
//       { email, role: existingUser.role, uid: existingUser._id },
//       env.ACCESS_TOKEN_SECRET_KEY,
//       {
//         expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME
//       }
//     )

//     const refreshToken = jwt.sign(
//       { email, uid: existingUser._id },
//       env.REFRESH_TOKEN_SECRET_KEY,
//       {
//         expiresIn: env.REFRESH_TOKEN_EXPIRES_TIME
//       }
//     )

//     return {
//       statusCode: StatusCodes.OK,
//       message: 'Login is successfully.',
//       data: {
//         accessToken,
//         refreshToken
//       }
//     }
//   } catch (error) {
//     throw error
//   }
// }

// const getProfile = async (userId: string): Promise<IApiResponse> => {
//   try {
//     const profile = await User.findById(userId)
//       .select('-password')
//       .populate('role', 'name')

//     if (!profile) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Not found.')
//     }

//     return {
//       statusCode: StatusCodes.OK,
//       message: 'Get profile is successfully.',
//       data: profile
//     }
//   } catch (error) {
//     throw error
//   }
// }

const getList = async (queryParams: IQueryParams): Promise<IApiResponse> => {
  const {
    page = 1,
    limit = 10,
    sort = 'asc',
    sortBy = 'createdAt'
  } = queryParams
  try {
    const queries: Record<string, any> = {
      _destroy: false
    }

    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: { [sortBy as string]: sort }
    }

    const users = await User.find(queries, null, options).select('-password')
    const total = await User.countDocuments()
    const totalPages = Math.ceil(Number(total) / Number(limit))

    return {
      statusCode: StatusCodes.OK,
      message: 'Get list user is successfully.',
      data: {
        users,
        pagination: {
          total,
          currentPage: Number(page),
          limit,
          totalPages
        }
      }
    }
  } catch (error) {
    throw error
  }
}

const updateById = async (
  id: string,
  reqBody: UpdateUserBodyType
): Promise<IApiResponse> => {
  try {
    const updateData = {
      ...reqBody
    }
    if (reqBody?.password) {
      const hashedPassword = await hashPassword(reqBody.password)
      updateData.password = hashedPassword
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true
    }).select('-password')

    return {
      statusCode: StatusCodes.OK,
      message: `Updated user with id = ${id} is successfully.`,
      data: updatedUser
    }
  } catch (error) {
    throw error
  }
}

const deleteById = async (id: string): Promise<IApiResponse> => {
  try {
    const deletedUser = await User.findByIdAndDelete(id, { new: true }).select(
      '-password'
    )

    if (!deletedUser?._id) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.')
    }

    return {
      statusCode: StatusCodes.OK,
      message: `Deleted user with id=${deletedUser?._id} is susccessfully.`,
      data: deletedUser
    }
  } catch (error) {
    throw error
  }
}

const userService = {
  // register,
  // login,
  // getProfile,
  getList,
  updateById,
  deleteById
}

export default userService
