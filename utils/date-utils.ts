import { format } from 'date-fns'
import firebase from 'firebase'

export function formattedYearDateTime(
  timestamp: firebase.firestore.Timestamp | null
) {
  return timestamp && format(timestamp.toDate(), 'yyyy年MM月dd日 HH:mm')
}
