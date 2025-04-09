import express from 'express'
import brandController from '~/controllers/brandController'
import productCategoryController from '~/controllers/productCategoryController'
import productTagController from '~/controllers/productTagController'
import brandValidation from '~/validations/brandValidation'
import productCategoryValidation from '~/validations/productCategoryValidation'
import productTagValidation from '~/validations/productTagValidation'

const router = express.Router()

/**
 * @swagger
 * /product-tags/add-product-tag:
 *   post:
 *     tags:
 *       - Product Tags
 *     summary: Add new product tag
 *     description: Add new product tag
 *     requestBody:
 *       required: true
 *       description: Body data need to add new product tag
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
 *         description: Return new product tag data is added.
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
 */
router.post(
  '/add-product-tag',
  productTagValidation.addNew,
  productTagController.addNew
)

/**
 * @swagger
 * /product-tags/edit-product-tag-by-slug/{slug}:
 *   put:
 *     tags:
 *       - Product Tags
 *     summary: Edit product tag by slug
 *     description: Edit product tag by slug
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the product tag to edit
 *     requestBody:
 *       description: Body data can edit product tag
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
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
 *
 */
router.put(
  '/edit-product-tag-by-slug/:slug',
  productTagValidation.editBySlug,
  productTagController.editBySlug
)

/**
 * @swagger
 * /product-tags/soft-delete-product-tag-by-slug/{slug}:
 *   delete:
 *     tags:
 *       - Product Tags
 *     summary: Delete product tag by slug (soft delete)
 *     description: Delete product tag by slug (soft delete)
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the product tag to delete
 *     responses:
 *        200:
 *         description: Return data is deleted.
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
 */
router.delete(
  '/soft-delete-product-tag-by-slug/:slug',
  productTagController.softDeleteBySlug
)

/**
 * @swagger
 * /product-tags/hard-delete-product-tag-by-slug/{slug}:
 *   delete:
 *     tags:
 *       - Product Tags
 *     summary: Delete product tag by slug (hard delete)
 *     description: Delete product tag by slug (hard delete)
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the product tag to delete
 *     responses:
 *        200:
 *         description: Return data is deleted.
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
 */
router.delete(
  '/hard-delete-product-tag-by-slug/:slug',
  productTagController.hardDeleteBySlug
)

/**
 * @swagger
 * /product-tags/get-all-product-tags:
 *   get:
 *     tags:
 *       - Product Tags
 *     summary: Get all product tags
 *     description: Get all product tags
 *     responses:
 *        200:
 *         description: Return all product tags.
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
router.get('/get-all-product-tags', productTagController.getAll)

/**
 * @swagger
 * /product-tags/get-product-tags:
 *   get:
 *     tags:
 *       - Product Tags
 *     summary: Get list product tags with pagination
 *     description: Get list product tags with pagination
 *     parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: interger
 *          description: The number of page
 *        - in: query
 *          name: limit
 *          schema:
 *            type: interger
 *          description: The number of items to return
 *        - in: query
 *          name: sort
 *          schema:
 *            type: string
 *          description: Sort asc or desc by field sorted
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: What is field need to sort?
 *     responses:
 *        200:
 *         description: Return list product tags is paginated.
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
 *                   properties:
 *                      productTags:
 *                        type: array
 *                      pagination:
 *                        type: object
 *                        properties:
 *                          currentPage:
 *                            type: number
 *                          limit:
 *                            type: number
 *                          total:
 *                            type: number
 *                          totalPages:
 *                            type: number
 */
router.get('/get-product-tags', productTagController.getList)

/**
 * @swagger
 * /product-tags/get-product-tag-details-by-slug/{slug}:
 *   get:
 *     tags:
 *       - Product Tags
 *     summary: Get product tag details
 *     description: Get product tag details
 *     parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: Slug of product tag.
 *     responses:
 *        200:
 *         description: Return product tag details.
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
 */
router.get(
  '/get-product-tag-details-by-slug/:slug',
  productTagController.getDetailsBySlug
)

export default router
