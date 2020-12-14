import { format } from 'date-fns'
import firebase from 'firebase'

export function formattedDate(
  timestamp: firebase.firestore.Timestamp | null
): string {
  const res = timestamp && format(timestamp.toDate(), 'yyyy/MM/dd HH:mm')
  return res || ''
}
