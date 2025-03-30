import express, { Router } from 'express'
import userController from '~/controllers/userController'
import userValidation from '~/validations/userValidation'

const router: Router = express.Router()

router.post('/add-user', userValidation.addUser, userController.addUser)

export default router
