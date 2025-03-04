import express, { Router } from 'express'
import roleController from '~/controllers/roleController'
import roleValidation from '~/validations/roleValidation'

const router: Router = express.Router()

router.get('/get-all-role', roleController.getAll)
router.get('/get-roles', roleController.getRoles)
router.post('/add-role', roleValidation.addNew, roleController.addNew)
router.put('/edit-role/:id', roleValidation.edit, roleController.editById)
router.delete('/delete-role/:id', roleController.deleteRoleById)

export default router
