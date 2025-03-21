import express from 'express'
import cors from 'cors'
import { env } from '~/config/environment'
import connectDB from '~/config/mongodb'
import APIs_V1 from '~/routes/v1'
import { corsOptions } from '~/config/cors'
import swaggerUi from 'swagger-ui-express'
import { specs } from 'swagger'
import path from 'path'

const START_SERVER = async () => {
  const app = express()
  const LOCAL_DEV_APP_PORT = env.LOCAL_DEV_APP_PORT
  const LOCAL_DEV_APP_HOSTNAME = env.LOCAL_DEV_APP_HOSTNAME

  app.use(
    '/api-docs',
    cors(corsOptions),
    swaggerUi.serve,
    swaggerUi.setup(specs)
  )

  // For enable cors
  app.use(cors(corsOptions))

  // For parsing application/json
  app.use(express.json())

  // For parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }))

  await connectDB()

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, 'public')))

  // Home route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/api-docs', 'home.html'))
  })

  // Swagger UI
  app.use(
    '/api-docs',
    cors(corsOptions),
    swaggerUi.serve,
    swaggerUi.setup(specs)
  )

  APIs_V1(app)

  if (env.BUILD_MODE === 'prod') {
    app.listen(process.env.PORT, () => {
      console.log(`Production - Server is running on port:${process.env.PORT}`)
    })
  } else {
    app.listen(LOCAL_DEV_APP_PORT, LOCAL_DEV_APP_HOSTNAME, () => {
      console.log(
        `Dev - Server is running on http://${LOCAL_DEV_APP_HOSTNAME}:${LOCAL_DEV_APP_PORT}`
      )
    })
  }
}

START_SERVER()
