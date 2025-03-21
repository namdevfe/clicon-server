export interface IApiError extends Error {
  statusCode?: number
}

export interface IApiResponse {
  statusCode: number
  message: string
  data?: any
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
