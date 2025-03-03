import express, { Router } from 'express'
import permissionController from '~/controllers/permissionController'
import permissionValidation from '~/validations/permissionValidation'

const router: Router = express.Router()

router.get('/get-all-permissions', permissionController.getAll)
router.get('/get-permissions', permissionController.getList)
router.post(
  '/add-permission',
  permissionValidation.addNew,
  permissionController.addNew
)
router.put(
  '/edit-permission/:id',
  permissionValidation.edit,
  permissionController.edit
)
router.delete('/delete-permission/:id', permissionController.deleteById)

export default router
