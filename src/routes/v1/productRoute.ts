import express from 'express'
import productController from '~/controllers/productController'
import productValidation from '~/validations/productValidation'

const router = express.Router()

/**
 * @swagger
 * /products/add-product:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add new product
 *     description: Add new product
 *     requestBody:
 *       description: Payload to add a new product
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageCover:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               oldPrice:
 *                 type: number
 *               quantity:
 *                 type: number
 *               specification:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               brand:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Return product data that has been added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Product added successfully.
 *                 data:
 *                   type: object
 *       422:
 *          description: Error request body data invalid.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  statusCode:
 *                    type: number
 *                    example: 422
 *                  message:
 *                    type: string
 */
router.post('/add-product', productValidation.addNew, productController.addNew)

/**
 * @swagger
 * /products/edit-product/{slug}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Edit product by slug
 *     description: Edit product by slug
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the product to edit
 *     requestBody:
 *       description: Body data can edit product
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageCover:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               oldPrice:
 *                 type: number
 *               quantity:
 *                 type: number
 *               specification:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               brand:
 *                 type: string
 *               stock:
 *                 type: number
 *       responses:
 *        200:
 *         description: Return data is edited.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *        422:
 *         description: Error request body data invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 422
 *                 message:
 *                   type: string
 *        401:
 *         description: Unauthorize.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *                 message:
 *                   type: string
 */
router.put(
  '/edit-product/:slug',
  productValidation.edit,
  productController.edit
)

/**
 * @swagger
 * /products/get-all-products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Get all products
 *     responses:
 *        200:
 *         description: Return all products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 */
router.get('/get-all-products', productController.getAll)

export default router
