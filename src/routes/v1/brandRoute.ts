import express from 'express'
import brandController from '~/controllers/brandController'
import productCategoryController from '~/controllers/productCategoryController'
import brandValidation from '~/validations/brandValidation'
import productCategoryValidation from '~/validations/productCategoryValidation'

const router = express.Router()

/**
 * @swagger
 * /brands/add-brand:
 *   post:
 *     tags:
 *       - Brands
 *     summary: Add new brand
 *     description: Add new brand
 *     requestBody:
 *       required: true
 *       description: Body data need to add new brand
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
 *         description: Return new brand data is added.
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
router.post('/add-brand', brandValidation.addNew, brandController.addNew)

/**
 * @swagger
 * /brands/edit-brand-by-slug/{slug}:
 *   put:
 *     tags:
 *       - Brands
 *     summary: Edit brand by slug
 *     description: Edit brand by slug
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the brand to edit
 *     requestBody:
 *       description: Body data can edit brand
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
 *                 data:
 *                   type: object
 */
router.put(
  '/edit-brand-by-slug/:slug',
  brandValidation.editBySlug,
  brandController.editBySlug
)

/**
 * @swagger
 * /brands/soft-delete-brand-by-slug/{slug}:
 *   delete:
 *     tags:
 *       - Brands
 *     summary: Delete brand by slug (soft delete)
 *     description: Delete brand by id (soft delete)
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the brand to delete
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
  '/soft-delete-brand-by-slug/:slug',
  brandController.softDeleteBySlug
)

/**
 * @swagger
 * /brands/hard-delete-brand-by-slug/{slug}:
 *   delete:
 *     tags:
 *       - Brands
 *     summary: Delete brand by slug (hard delete)
 *     description: Delete brand by slug (hard delete)
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the brand to delete
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
  '/hard-delete-brand-by-slug/:slug',
  brandController.hardDeleteBySlug
)

/**
 * @swagger
 * /brands/get-all-brands:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Get all brands
 *     description: Get all brands
 *     responses:
 *        200:
 *         description: Return all brands.
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
router.get('/get-all-brands', brandController.getAll)

/**
 * @swagger
 * /brands/get-brands:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Get list brands with pagination
 *     description: Get list brands with pagination
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
 *         description: Return list brands is paginated.
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
 *                      brands:
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
router.get('/get-brands', brandController.getList)

/**
 * @swagger
 * /brands/get-brand-details-by-slug/{slug}:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Get brand details
 *     description: Get brand details
 *     parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          required: true
 *          description: Slug of brand.
 *     responses:
 *        200:
 *         description: Return brand details.
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
router.get('/get-brand-details-by-slug/:slug', brandController.getDetailsBySlug)

export default router
