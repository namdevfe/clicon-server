import express from 'express'
import productCategoryController from '~/controllers/productCategoryController'
import productCategoryValidation from '~/validations/productCategoryValidation'

const router = express.Router()

/**
 * @swagger
 * /product-categories/add-product-category:
 *   post:
 *     tags:
 *       - Product Categories
 *     summary: Add new product category
 *     description: Add new product category
 *     requestBody:
 *       required: true
 *       description: Body data need to add new product category
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *     responses:
 *        201:
 *         description: Return new product category data is added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 */
router.post(
  '/add-product-category',
  productCategoryValidation.addNew,
  productCategoryController.addNew
)

export default router
