import { NextFunction, Request, Response } from 'express'
import productService from '~/services/productService'

const addNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await productService.addNew(req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const productController = {
  addNew
}

export default productController
