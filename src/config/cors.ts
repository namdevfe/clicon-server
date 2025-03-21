import { CorsOptions } from 'cors'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { WHITELIST_DOMAINS } from '~/constants/domain'
import ApiError from '~/utils/ApiError'

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    if (WHITELIST_DOMAINS.includes(origin as string)) {
      console.log('🚀origin---->', origin)
      return callback(null, true)
    }

    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`
      )
    )
  },
  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  credentials: true
}
