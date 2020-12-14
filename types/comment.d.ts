import firebase from 'firebase'

export interface IComment {
  id: string
  authorId: string
  content: string
  createdAt: firebase.firestore.Timestamp
}
