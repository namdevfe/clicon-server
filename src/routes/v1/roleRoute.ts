import express, { Router } from 'express'
import roleController from '~/controllers/roleController'
import roleValidation from '~/validations/roleValidation'

const router: Router = express.Router()

/**
 * @swagger
 * /roles/get-all-roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get all roles
 *     description: Get all roles
 *     responses:
 *        200:
 *         description: Return list all roles.
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 6788eed354c2c8af5669ce16
 *                       name:
 *                         type: string
 *                         example: Admin
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: ["6788e4a4e86c5917125b7198", "6788f597b7d9a7599c97ae22", "6788fd8a94c01d1f3172ec56",]
 *                       _destroy:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: date
 *                         example: 2025-01-16T11:34:43.585Z
 *                       updatedAt:
 *                         type: date
 *                         example: 2025-01-16T11:34:43.585Z
 */
router.get('/get-all-roles', roleController.getAll)
/**
 * @swagger
 * /roles/get-roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get list roles with pagination
 *     description: Get list roles with pagination
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
 *         description: Return list roles is paginated.
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
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           _destroy:
 *                             type: boolean
 *                           createdAt:
 *                             type: date
 *                           updatedAt:
 *                             type: date
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: number
 *                         total:
 *                           type: number
 *                         totalPages:
 *                           type: number
 *                         limit:
 *                           type: number
 */
router.get('/get-roles', roleController.getRoles)
/**
 * @swagger
 * /roles/get-role-details/{id}:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get role details by id
 *     description: Get role details by id
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: interger
 *          description: ID of role need to get
 *     responses:
 *        200:
 *         description: Return role details.
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
router.get('/get-role-details/:id', roleController.getRoleDetails)

/**
 * @swagger
 * /roles/add-role:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Add new role
 *     description: Add new role
 *     requestBody:
 *       required: true
 *       description: Body data need to add new role
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                required: true
 *                type: string
 *              description:
 *                type: string
 *     responses:
 *        201:
 *         description: Return new role data is added.
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
 *                   example: Added new role is successfully.
 */
router.post('/add-role', roleValidation.addNew, roleController.addNew)
/**
 * @swagger
 * /roles/edit-role/{id}:
 *   put:
 *     tags:
 *       - Roles
 *     summary: Edit role by id
 *     description: Edit role by id
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Numeric ID of the role to edit
 *     requestBody:
 *       description: Body data can edit role
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
 *                   example: Edited role is successfully.
 */
router.put('/edit-role/:id', roleValidation.edit, roleController.editById)
/**
 * @swagger
 * /roles/delete-role/{id}:
 *   delete:
 *     tags:
 *       - Roles
 *     summary: Delete role by id (hard delete)
 *     description: Delete roles by id (hard delete)
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Numeric ID of the role to delete
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
 *                 data:
 *                   type: object
 */
router.delete('/delete-role/:id', roleController.deleteRoleById)

export default router
