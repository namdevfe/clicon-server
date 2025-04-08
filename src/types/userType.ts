import { Schema } from 'mongoose'
import { IBaseType } from '~/types/common'

export interface IUser extends IBaseType {
  _id?: Schema.Types.ObjectId
  email: string
  password: string
  addresses?: string[]
  firstName: string
  lastName: string
  avatar?: string
  role?: string
  otpCode?: string
  otpExpires?: number
  refreshToken?: string
  isActive?: boolean
}

export type RegisterUserBodyType = Pick<
  IUser,
  'email' | 'password' | 'firstName' | 'lastName'
>

export type VerifyOTPBodyTypes = Pick<IUser, 'otpCode'>

export type SendMailVerifyOTPTypes = Pick<
  IUser,
  'firstName' | 'lastName' | 'otpCode'
>

export type LoginUserBodyType = Pick<IUser, 'email' | 'password'>

export type EditUserBodyTypes = Partial<
  Pick<
    IUser,
    'addresses' | 'firstName' | 'lastName' | 'avatar' | 'role' | 'password'
  >
>

export type RefreshTokenBodyTypes = Pick<IUser, 'refreshToken'>

export type LogoutBodyTypes = Pick<IUser, 'refreshToken'>

export type AddUser = Omit<
  IUser,
  '_id' | 'refreshToken' | 'otpCode' | 'otpExpires' | '_destroy'
>
