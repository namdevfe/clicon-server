export interface IPermission {
  url: string
  description?: string | undefined
  _destroy?: boolean
}

export type AddPermissionBodyTypes = Omit<IPermission, '_destroy'>

export type EditPermissionBodyTypes = Partial<AddPermissionBodyTypes>
