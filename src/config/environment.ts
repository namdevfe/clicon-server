import 'dotenv/config'
import type { StringValue } from 'ms'

export const env = {
  APP_PORT: Number(process.env.APP_PORT),
  APP_HOSTNAME: process.env.APP_HOSTNAME as string,
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY as StringValue,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY as StringValue,
  ACCESS_TOKEN_EXPIRES_TIME: process.env
    .ACCESS_TOKEN_EXPIRES_TIME as StringValue,
  REFRESH_TOKEN_EXPIRES_TIME: process.env
    .REFRESH_TOKEN_EXPIRES_TIME as StringValue,
  BUILD_MODE: process.env.BUILD_MODE as string,
  GOOGLE_MAILER_CLIENT_ID: process.env.GOOGLE_MAILER_CLIENT_ID as string,
  GOOGLE_MAILER_CLIENT_SECRET: process.env
    .GOOGLE_MAILER_CLIENT_SECRET as string,
  GOOGLE_MAILER_REFRESH_TOKEN: process.env
    .GOOGLE_MAILER_REFRESH_TOKEN as string,
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS as string
}
