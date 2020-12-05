import firebase from 'firebase'

import { FieldValue } from '@/plugins/firebaseApp'

export interface INoteHistory {
  id: string
  title: string
  content: string
  createdAt: firebase.firestore.Timestamp
  authorId: string
}

export class NoteHistory {
  id: string = ''
  title: string = ''
  content: string = ''
  createdAt: firebase.firestore.Timestamp = FieldValue.serverTimestamp() as firebase.firestore.Timestamp
  authorId: string = ''

  constructor({
    id = '',
    title = '',
    content = '',
    createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    authorId = '',
  }: Partial<INoteHistory>) {
    Object.assign(this, {
      id,
      title,
      content,
      createdAt,
      authorId,
    })
  }

  toObject(): {} {
    return {
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      authorId: this.authorId,
    }
  }
}
