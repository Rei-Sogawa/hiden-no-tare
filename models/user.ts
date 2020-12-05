export interface IUser {
  id: string
  displayName: string
  photoURL: string
}

export class User implements IUser {
  id: string = ''
  displayName: string = ''
  photoURL: string = ''

  constructor({ id = '', displayName = '', photoURL = '' }: Partial<IUser>) {
    Object.assign(this, { id, displayName, photoURL })
  }
}
