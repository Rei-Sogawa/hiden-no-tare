import firebase from 'firebase'
import { INoteHistory } from '@/types/noteHistory'

export interface INote {
  id: string
  authorId: string
  tags: string[]
  latestNoteHistory: Omit<INoteHistory, 'id'>
  createdAt: firebase.firestore.Timestamp
}
