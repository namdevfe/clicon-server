import 'dotenv/config'

export const env = {
  APP_PORT: Number(process.env.APP_PORT),
  APP_HOSTNAME: process.env.APP_HOSTNAME as string,
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY as string,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY as string,
  ACCESS_TOKEN_EXPIRES_TIME: process.env.ACCESS_TOKEN_EXPIRES_TIME as string,
  REFRESH_TOKEN_EXPIRES_TIME: process.env.REFRESH_TOKEN_EXPIRES_TIME as string,
  BUILD_MODE: process.env.BUILD_MODE as string
}
