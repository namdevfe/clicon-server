import express, { Router } from 'express'
import userController from '~/controllers/userController'
import userValidation from '~/validations/userValidation'

const router: Router = express.Router()

/**
 * @swagger
 * /users/get-all-users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Get all users
 *     responses:
 *        200:
 *         description: Return list all users.
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
 *                   example: Get all users is successfully
 *                 data:
 *                   type: array
 */
router.get('/get-all-users', userController.getAllUsers)

/**
 * @swagger
 * /users/get-users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get list users with pagination
 *     description: Get list users with pagination
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
 *         description: Return list users is paginated.
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
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
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
router.get('/get-users', userController.getUsers)

/**
 * @swagger
 * /users/get-user-details/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user details by id
 *     description: Get user details by id
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Numeric ID of the user
 *     responses:
 *        200:
 *         description: Return user details.
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
router.get('/get-user-details/:id', userController.getUserDetails)

/**
 * @swagger
 * /users/add-user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add user by admin
 *     description: Add user by admin with status inactive and send OTP code with email address to verify emaill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *        200:
 *         description: Return message send OTP success.
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
 *                   example: Send mail is successfully
 *        422:
 *         description: Return error uncessable entity.
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
 *                   example: Invalid email
 *        400:
 *         description: Return error message to notify this email had already been used.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Email had already been used
 *        500:
 *          description: Return internal server error.
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/add-user', userValidation.addUser, userController.addUser)

/**
 * @swagger
 * /users/edit-user/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Edit user by id
 *     description: Edit user by id
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Numeric ID of the user to edit
 *     requestBody:
 *       description: Body data can edit user
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *                required: true
 *              lastName:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *              role:
 *                type: string
 *              addresses:
 *                type: array
 *                items:
 *                  type: string
 *              avatar:
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
 *                 message:
 *                   type: string
 */
router.put('/edit-user/:id', userValidation.editUser, userController.editUser)

/**
 * @swagger
 * /users/delete-user/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by id (hard delete)
 *     description: Delete user by id (hard delete)
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Numeric ID of the user to delete
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
router.delete('/delete-user/:id', userController.deleteUser)

export default router
