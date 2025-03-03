export interface IRole {
  name: string
  description?: string
  permissions?: string[]
  _destroy?: boolean
}

export type AddRoleBodyTypes = Omit<IRole, '_destroy'>

export type EditRoleBodyTypes = Omit<IRole, '_destroy'>
