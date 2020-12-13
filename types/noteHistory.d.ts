import firebase from 'firebase'

export interface INoteHistory {
  id: string
  authorId: string
  title: string
  content: string
  createdAt: firebase.firestore.Timestamp
}
