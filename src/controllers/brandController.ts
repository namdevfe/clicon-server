import { NextFunction, Request, Response } from 'express'
import brandService from '~/services/brandService'
import productCategoryService from '~/services/productCategoryService'

const addNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await brandService.addNew(req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const editBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params
  try {
    const response = await brandService.editBySlug(slug, req.body)
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
    const response = await brandService.softDeleteBySlug(slug)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const hardDeleteBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params
  try {
    const response = await brandService.hardDeleteBySlug(slug)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const response = await brandService.getAll()
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getList = async (req: Request, res: Response, next: NextFunction) => {
  const queries = req.query
  try {
    const response = await brandService.getList(queries)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getDetailsBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params
  try {
    const response = await brandService.getDetailsBySlug(slug)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const brandController = {
  addNew,
  editBySlug,
  softDeleteBySlug,
  hardDeleteBySlug,
  getAll,
  getList,
  getDetailsBySlug
}

export default brandController
