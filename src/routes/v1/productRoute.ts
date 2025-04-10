import express from 'express'
import productController from '~/controllers/productController'
import productValidation from '~/validations/productValidation'

const router = express.Router()

router.post('/add-product', productValidation.addNew, productController.addNew)

export default router
