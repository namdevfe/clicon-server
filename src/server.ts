import express from 'express'
import cors from 'cors'
import { env } from '~/config/environment'
import connectDB from '~/config/mongodb'
import APIs_V1 from '~/routes/v1'
import { corsOptions } from '~/config/cors'

const START_SERVER = async () => {
  const app = express()
  const APP_PORT = env.APP_PORT
  const APP_HOSTNAME = env.APP_HOSTNAME

  // For enable cors
  app.use(cors(corsOptions))

  // For parsing application/json
  app.use(express.json())

  // For parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }))

  await connectDB()

  APIs_V1(app)

  app.listen(APP_PORT, APP_HOSTNAME, () => {
    console.log(`Server is running on http://${APP_HOSTNAME}:${APP_PORT}`)
  })
}

START_SERVER()
