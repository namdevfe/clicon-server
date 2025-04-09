import { NextFunction, Request, Response } from 'express'
import productTagService from '~/services/productTagService'

const addNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await productTagService.addNew(req.body)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const editBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params
  try {
    const response = await productTagService.editBySlug(slug, req.body)
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
    const response = await productTagService.softDeleteBySlug(slug)
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
    const response = await productTagService.hardDeleteBySlug(slug)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getAll = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const response = await productTagService.getAll()
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const getList = async (req: Request, res: Response, next: NextFunction) => {
  const queries = req.query
  try {
    const response = await productTagService.getList(queries)
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
    const response = await productTagService.getDetailsBySlug(slug)
    res.status(response.statusCode).json(response)
  } catch (error) {
    next(error)
  }
}

const productTagController = {
  addNew,
  editBySlug,
  softDeleteBySlug,
  hardDeleteBySlug,
  getAll,
  getList,
  getDetailsBySlug
}

export default productTagController
