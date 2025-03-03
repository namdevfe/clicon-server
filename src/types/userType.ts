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

export type RegisterUserBodyType = Omit<IUser, 'role' | '_destroy'>

export type LoginUserBodyType = Pick<IUser, 'email' | 'password'>
