export interface IUser {
  email: string
  password: string
  address?: string[]
  firstName: string
  lastName: string
  displayName?: string
  avatar?: string
  role?: string
  _destroy?: boolean
}

export type RegisterUserBodyType = Omit<IUser, '_destroy'>

export type LoginUserBodyType = Pick<IUser, 'email' | 'password'>

export type UpdateUserBodyType = Pick<
  IUser,
  'address' | 'firstName' | 'lastName' | 'avatar' | 'role' | 'displayName'
>
