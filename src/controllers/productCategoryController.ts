import { NextFunction, Request, Response } from 'express'
import productCategoryService from '~/services/productCategoryService'

const addNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await productCategoryService.addNew(req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const productCategoryController = { addNew }

export default productCategoryController
