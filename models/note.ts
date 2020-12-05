/* eslint-disable lines-between-class-members */
import firebase from 'firebase'

import { INoteHistory, NoteHistory } from '@/models/noteHistory'
import { FieldValue } from '@/plugins/firebaseApp'

export interface INoteForm {
  title: string
  content: string
  tags: string[]
}

export interface INote {
  id: string
  tags: string[]
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
  latestHistory: Partial<INoteHistory>
  authorId: string
}

export class Note implements INote {
  id: string = ''
  tags: string[] = []
  createdAt: firebase.firestore.Timestamp = FieldValue.serverTimestamp() as firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp = FieldValue.serverTimestamp() as firebase.firestore.Timestamp
  latestHistory: Partial<INoteHistory> = new NoteHistory({}).toObject()
  authorId: string = ''

  constructor({
    id = '',
    tags = [],
    createdAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    updatedAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    latestHistory = new NoteHistory({}).toObject(),
    authorId = '',
  }: Partial<INote>) {
    Object.assign(this.latestHistory, latestHistory)
    Object.assign(this, {
      id,
      tags,
      createdAt,
      updatedAt,
      authorId,
    })
  }

  toObject(): {} {
    return {
      tags: [...this.tags],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      latestHistory: { ...this.latestHistory },
      authorId: this.authorId,
    }
  }
}
