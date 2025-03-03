import express, { Router } from 'express'
import authController from '~/controllers/authController'
import authValidation from '~/validations/authValidation'

const router: Router = express.Router()

router.post('/register', authValidation.register, authController.register)
router.post('/login', authValidation.login, authController.login)
router.get('/get-profile', authController.getProfile)

export default router
