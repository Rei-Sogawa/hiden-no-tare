import firebase from 'firebase'
import { INoteHistoryDoc } from '@/types/noteHistoryDoc'

export interface INoteDoc {
  authorId: string
  tags: string[]
  latestNoteHistory: INoteHistoryDoc
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}
