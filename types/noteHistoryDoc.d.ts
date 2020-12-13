import firebase from 'firebase'

export interface INoteHistoryDoc {
  authorId: string
  title: string
  content: string
  createdAt: firebase.firestore.Timestamp
}
