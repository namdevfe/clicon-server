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

/**
 * @swagger
 * /product-categories/edit-product-category-by-slug/{slug}:
 *   put:
 *     tags:
 *       - Product Categories
 *     summary: Edit product category by slug
 *     description: Edit product category by slug
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the product category to edit
 *     requestBody:
 *       description: Body data can edit product category
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
  '/edit-product-category-by-slug/:slug',
  productCategoryValidation.editBySlug,
  productCategoryController.editBySlug
)

/**
 * @swagger
 * /product-categories/soft-delete-product-category-by-slug/{slug}:
 *   delete:
 *     tags:
 *       - Product Categories
 *     summary: Delete product category by slug (soft delete)
 *     description: Delete product category by id (soft delete)
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the product category to delete
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
  '/soft-delete-product-category-by-slug/:slug',
  productCategoryController.softDeleteBySlug
)

/**
 * @swagger
 * /product-categories/hard-delete-product-category-by-slug/{slug}:
 *   delete:
 *     tags:
 *       - Product Categories
 *     summary: Delete product category by slug (hard delete)
 *     description: Delete product category by slug (hard delete)
 *     parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: Slug of the product category to delete
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
  '/hard-delete-product-category-by-slug/:slug',
  productCategoryController.hardDeleteBySlug
)

/**
 * @swagger
 * /product-categories/get-all-product-categories:
 *   get:
 *     tags:
 *       - Product Categories
 *     summary: Get all product categories
 *     description: Get all product categories
 *     responses:
 *        200:
 *         description: Return all product categories.
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
router.get('/get-all-product-categories', productCategoryController.getAll)

/**
 * @swagger
 * /product-categories/get-product-categories:
 *   get:
 *     tags:
 *       - Product Categories
 *     summary: Get list product categories with pagination
 *     description: Get list product categories with pagination
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
 *         description: Return list product categories is paginated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get all permission is successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                      productCategories:
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
router.get('/get-product-categories', productCategoryController.getList)

/**
 * @swagger
 * /product-categories/get-product-category-details-by-slug/{slug}:
 *   get:
 *     tags:
 *       - Product Categories
 *     summary: Get product category details
 *     description: Get product category details
 *     parameters:
 *        - in: path
 *          name: slug
 *          schema:
 *            type: string
 *          description: Slug of product category
 *     responses:
 *        200:
 *         description: Return product category details.
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
  '/get-product-category-details-by-slug/:slug',
  productCategoryController.getDetailsBySlug
)

export default router
