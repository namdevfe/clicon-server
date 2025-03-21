import { Application } from 'express'
import errorHandlerMiddleware from '~/middlewares/errorHandlerMiddleware'
import authRoutes from './authRoute'
import permissionRoutes from './permissionRoute'
import roleRoutes from './roleRoute'
// import userRoutes from './userRoute'
import verifyTokenMiddleware from '~/middlewares/verifyTokenMiddleware'
import { BASE_URL_API_ENDPOINT } from '~/constants/baseURL'
import verifyPermissionMiddleware from '~/middlewares/verifyPermissionMiddleware'

const APIs_V1 = (app: Application) => {
  app.all('*', verifyTokenMiddleware, verifyPermissionMiddleware)

  app.use(`${BASE_URL_API_ENDPOINT}/auth`, authRoutes)
  app.use(`${BASE_URL_API_ENDPOINT}/permissions`, permissionRoutes)
  app.use(`${BASE_URL_API_ENDPOINT}/roles`, roleRoutes)
  // app.use(`${BASE_URL_API_ENDPOINT}/users`, userRoutes)

  app.use(errorHandlerMiddleware)
}

export default APIs_V1
