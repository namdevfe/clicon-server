import { StatusCodes } from 'http-status-codes'
import User from '~/models/userModel'
import {
  AddUser,
  LoginUserBodyType,
  RegisterUserBodyType,
  EditUserBodyTypes
} from '~/types/userType'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcrypt'
import { IApiResponse, IQueryParams } from '~/types/common'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import Role from '~/models/roleModel'
import { ROLES } from '~/constants/role'
import { comparePassword, hashPassword } from '~/utils/hashPassword'
import { generateOTP } from '~/utils/generateOTP'
import { OTP_TIME_EXPIRES } from '~/constants/datetime'
import generateHTMLVerifyOTP from '~/utils/generateHTMLVerifyOTP'
import mailService from '~/services/mailService'

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
const getAllUsers = async (): Promise<IApiResponse> => {
  try {
    const users = await User.find().select(
      '-password -refreshToken -otpCode -otpExpires'
    )
    return {
      statusCode: StatusCodes.OK,
      message: 'Get all users are successfully.',
      data: users
    }
  } catch (error) {
    throw error
  }
}

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

const editUserById = async (
  id: string,
  reqBody: EditUserBodyTypes
): Promise<IApiResponse> => {
  try {
    const editUserData = {
      ...reqBody
    }

    if (reqBody?.password) {
      const hashedPassword = hashPassword(reqBody.password)
      editUserData.password = hashedPassword
    }

    const response = await User.findByIdAndUpdate(id, editUserData, {
      new: true
    }).select('-password -refreshToken -otpCode -otpExpires')

    return {
      statusCode: StatusCodes.OK,
      message: `Edited user with id=${id} is successfully.`,
      data: response
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

const addUser = async (reqBody: AddUser): Promise<IApiResponse | undefined> => {
  const { email, password, role } = reqBody

  try {
    const existingUser = await User.findOne({ email })

    // Check email
    if (existingUser?._id) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This email address had already used.'
      )
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    const roleCustomer = await Role.findOne({ name: ROLES.CUSTOMER })

    const addNewData: AddUser = {
      ...reqBody,
      email,
      password: hashedPassword,
      role: role || roleCustomer?._id.toString()
    }

    const dataRes = await User.create(addNewData)

    // Generate OTP code
    const otpCode = generateOTP(6)
    const otpExpires = Date.now() + OTP_TIME_EXPIRES

    const htmlContent = generateHTMLVerifyOTP({
      firstName: dataRes.firstName,
      lastName: dataRes.lastName,
      otpCode
    })
    // Send email
    const emailData = {
      email: dataRes.email,
      subject: 'Xác thực tài khoản đã đăng ký tại Clicon',
      content: htmlContent
    }

    // Save OTP to db
    dataRes.otpCode = otpCode
    dataRes.otpExpires = otpExpires
    await dataRes.save()

    await mailService.sendMail(emailData)

    return {
      statusCode: StatusCodes.OK,
      message: 'OTP had been sent to your email. Please check your email.'
    }
  } catch (error) {
    throw error
  }
}

const userService = {
  // register,
  // login,
  // getProfile,
  getAllUsers,
  addUser,
  getList,
  editUserById,
  deleteById
}

export default userService
