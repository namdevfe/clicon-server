export interface IApiError extends Error {
  statusCode?: number
}

export interface IApiResponse<T = any> {
  statusCode: number
  message: string
  data?: T
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: any
  }
}

export interface IQueryParams {
  page?: string
  limit?: string
  sort?: string
  sortBy?: string
}

export interface IBaseType {
  createdAt?: Date
  updatedAt?: Date
  _destroy?: boolean
}

export interface IPagination {
  currentPage: number
  limit: number
  total: number
  totalPages: number
}
