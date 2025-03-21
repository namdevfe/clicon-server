import express, { Router } from 'express'
import authController from '~/controllers/authController'
import authValidation from '~/validations/authValidation'

const router: Router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register user
 *     description: Register user with status inactive and send OTP code with email address to verify emaill
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
 *                   example: Email had already been used
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
router.post('/register', authValidation.register, authController.register)

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP
 *     description: Verify OTP code to email address was registered before
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otpCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return message success
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
 *                   example: Verify OTP is successfully
 *       422:
 *         description: Return request body validate error
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
 *                   example: OTP length must be 6 charaters long
 *       400:
 *         description: Return otp invalid error
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
 *                   example: OTP code invalid
 *       408:
 *         description: Return otp expired error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 408
 *                 message:
 *                   type: string
 *                   example: OTP code expired
 */
router.post('/verify-otp', authValidation.verifyOTP, authController.verifyOTP)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Login by credentials when email had been authenticated
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
 *     responses:
 *       200:
 *         description: Return response login success
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
 *                   example: Login is successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ndXllbmtpbXF1b2NuYW1AZ21haWwuY29tIiwicm9sZSI6IjY3ODhmN2RjZmFlMzEzNzliMjYzZDRlZSIsInVpZCI6IjY3ZGMxMGJkZTQ0NTk0NTUzZDlhN2MxZCIsImlhdCI6MTc0MjUwMDA0NywiZXhwIjoxNzQyNTAwMTY3fQ.Uc5-ISF40LfEpGquNSDAJzNpJaqlCH_5Y5bDdctfXRE
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ndXllbmtpbXF1b2NuYW1AZ21haWwuY29tIiwicm9sZSI6IjY3ODhmN2RjZmFlMzEzNzliMjYzZDRlZSIsInVpZCI6IjY3ZGMxMGJkZTQ0NTk0NTUzZDlhN2MxZCIsImlhdCI6MTc0MjUwMDA0NywiZXhwIjoxNzQyNTAwMTY3fQ.Uc5-ISF40LfEpGquNSDAJzNpJaqlCH_5Y5bDdctfXRE
 *       422:
 *         description: Return request body validate error
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
 *       400:
 *         description: Return request body error
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
 *                   example: Password is not correct
 *       404:
 *         description: Return not found error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post('/login', authValidation.login, authController.login)

/**
 * @swagger
 * /auth/refresh-token:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Refresh token
 *     description: Each access token is expired then refresh token will generate new access token to maintain login status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return response refresh token success
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
 *                   example: Refresh token is successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ndXllbmtpbXF1b2NuYW1AZ21haWwuY29tIiwicm9sZSI6IjY3ODhmN2RjZmFlMzEzNzliMjYzZDRlZSIsInVpZCI6IjY3ZGMxMGJkZTQ0NTk0NTUzZDlhN2MxZCIsImlhdCI6MTc0MjUwMDA0NywiZXhwIjoxNzQyNTAwMTY3fQ.Uc5-ISF40LfEpGquNSDAJzNpJaqlCH_5Y5bDdctfXRE
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ndXllbmtpbXF1b2NuYW1AZ21haWwuY29tIiwicm9sZSI6IjY3ODhmN2RjZmFlMzEzNzliMjYzZDRlZSIsInVpZCI6IjY3ZGMxMGJkZTQ0NTk0NTUzZDlhN2MxZCIsImlhdCI6MTc0MjUwMDA0NywiZXhwIjoxNzQyNTAwMTY3fQ.Uc5-ISF40LfEpGquNSDAJzNpJaqlCH_5Y5bDdctfXRE
 *       422:
 *         description: Return request body validate error
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
 *                   example: refreshToken is required
 *       401:
 *         description: Return invalid token error or token expired
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
 *       500:
 *         description: Return sever error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put(
  '/refresh-token',
  authValidation.refreshToken,
  authController.refreshToken
)

/**
 * @swagger
 * /auth/logout:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Remove all token stored in database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return response logout success
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
 *                   example: Logout is successfully
 *       422:
 *         description: Return request body validate error
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
 *       401:
 *         description: Return invalid token error
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
 *       500:
 *         description: Return sever error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/logout', authValidation.logout, authController.logout)

/**
 * @swagger
 * /auth/get-profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get profile of user
 *     description: Get user detail information
 *     responses:
 *       200:
 *         description: Return response profile success
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
 *                   example: Get profile is successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 67dc8c23ddae2191de2d49db
 *                     email:
 *                       type: string
 *                       example: examp@gmail.com
 *                     address:
 *                       type: array
 *                       example: ['address 1', 'address 2']
 *                     firstName:
 *                       type: string
 *                       example: A
 *                     lastName:
 *                       type: string
 *                       example: Nguyễn Văn
 *                     role:
 *                       type: string
 *                       example: 6788f7dcfae31379b263d4ee
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     _destroy:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: date
 *                       example: 2025-03-20T21:44:03.202Z
 *                     updatedAt:
 *                       type: date
 *                       example: 2025-03-21T06:37:09.035Z
 *                     __v:
 *                       type: number
 *                       example: 0
 *       401:
 *         description: Return invalid token or token expired error
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
 *       500:
 *         description: Return sever error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/get-profile', authController.getProfile)

export default router
