import express, { Router } from 'express'
import permissionController from '~/controllers/permissionController'
import permissionValidation from '~/validations/permissionValidation'

const router: Router = express.Router()

/**
 * @swagger
 * /permissions/get-all-permissions:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Get all permissions
 *     description: Get all permissions
 *     responses:
 *        200:
 *         description: Return list all permissions.
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
 */
router.get('/get-all-permissions', permissionController.getAll)
/**
 * @swagger
 * /permissions/get-permissions:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Get list permissions with pagination
 *     description: Get list permissions with pagination
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
 *         description: Return list all permissions is paginated.
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
 */
router.get('/get-permissions', permissionController.getList)
/**
 * @swagger
 * /permisisons/get-permission-details/{id}:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Get permission details by id
 *     description: Get permission details by id
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: interger
 *          description: ID of permission need to get
 *     responses:
 *        200:
 *         description: Return permission details.
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
router.get('/get-permission-details/:id', permissionController.getDetails)
/**
 * @swagger
 * /permissions/add-permission:
 *   post:
 *     tags:
 *       - Permissions
 *     summary: Add new permission
 *     description: Add new permission
 *     requestBody:
 *       required: true
 *       description: Body data need to add new permission
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *                example: /permissions/test
 *                required: true
 *              description:
 *                type: string
 *                example: This is test permission
 *     responses:
 *        200:
 *         description: Return new permission data is added.
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
 *                   example: Added new permission is successfully.
 */
router.post(
  '/add-permission',
  permissionValidation.addNew,
  permissionController.addNew
)
/**
 * @swagger
 * /permissions/edit-permission/{id}:
 *   put:
 *     tags:
 *       - Permissions
 *     summary: Edit permission by id
 *     description: Edit permission by id
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Numeric ID of the permission to edit
 *     requestBody:
 *       description: Body data can edit permission
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *                example: /permissions/edited
 *              description:
 *                type: string
 *                example: This is test permission edited
 *     responses:
 *        200:
 *         description: Return data is edited.
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
 *                   example: Edited permission is successfully.
 */
router.put(
  '/edit-permission/:id',
  permissionValidation.edit,
  permissionController.edit
)
/**
 * @swagger
 * /permissions/delete-permission/{id}:
 *   delete:
 *     tags:
 *       - Permissions
 *     summary: Delete permission by id (hard delete)
 *     description: Delete permission by id (hard delete)
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Numeric ID of the permission to delete
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
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Deleted permission is successfully.
 */
router.delete('/delete-permission/:id', permissionController.deleteById)

export default router
