import bcrypt from 'bcrypt'

const SALT_ROUNDS = 8

export const hashPassword = async (plainPassword: string) => {
  return bcrypt.hashSync(plainPassword, SALT_ROUNDS)
}

export const comparePassword = async (
  plainPassword: string,
  hashPassword: string
) => {
  return bcrypt.compare(plainPassword, hashPassword)
}
