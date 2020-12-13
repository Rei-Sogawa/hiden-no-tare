import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

export const onCreateAuthUser = functions.auth.user().onCreate(async (user) => {
  const authenticatedUser = await admin.auth().getUser(user.uid)
  return db.collection('users').doc(user.uid).set({
    name: authenticatedUser.displayName,
  })
})

export const onCreateNoteDoc = functions.firestore
  .document('notes/{noteId}')
  .onCreate((snap, context) => {
    const noteHistory = snap.data().latestNoteHistory
    return db
      .collection(`notes/${context.params.noteId}/noteHistories`)
      .doc(context.eventId)
      .set(noteHistory)
  })

export const onUpdateNoteDoc = functions.firestore
  .document('notes/{noteId}')
  .onUpdate((change, context) => {
    const newVal = change.after.data().latestNoteHistory
    const oldVal = change.before.data().latestNoteHistory
    const isDiffInLatestNoteHistory =
      newVal.title !== oldVal.title || newVal.content !== oldVal.content
    if (isDiffInLatestNoteHistory) {
      return db
        .collection(`notes/${context.params.noteId}/noteHistories`)
        .doc(context.eventId)
        .set(change.after.data().latestNoteHistory)
    } else {
      // return がないルートがあると linter に怒られるので
      return Promise.resolve()
    }
  })
