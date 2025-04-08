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

const editBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params
  try {
    const response = await productCategoryService.editBySlug(slug, req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const softDeleteBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params
  try {
    const response = await productCategoryService.softDeleteBySlug(slug)
    res.json(response)
  } catch (error) {
    next(error)
  }
}

const productCategoryController = { addNew, editBySlug, softDeleteBySlug }

export default productCategoryController
