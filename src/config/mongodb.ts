import mongoose from 'mongoose'
import { env } from '~/config/environment'

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI as string)
    console.log('Connect to database is successfully...')
  } catch (error) {
    console.log('Connect to database is failed...')
  }
}

export default connectDB
