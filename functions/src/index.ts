import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const algoliasearch = require('algoliasearch')

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()
const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key
const ALGOLIA_INDEX_NAME = 'note_index'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

export const onCreateAuthUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async (user) => {
    const authenticatedUser = await admin.auth().getUser(user.uid)
    return db.collection('users').doc(user.uid).set({
      name: authenticatedUser.displayName,
    })
  })

export const onCreateNoteDoc = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
  .onCreate((snap, context) => {
    const noteHistory = snap.data().latestNoteHistory
    return db
      .collection(`notes/${context.params.noteId}/noteHistories`)
      .doc(context.eventId)
      .set(noteHistory)
  })

export const onUpdateNoteDoc = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
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

export const onWriteNoteDoc = functions
  .region('asia-northeast1')
  .firestore.document('notes/{noteId}')
  .onWrite((change, context) => {
    const data = change.after.data()
    const noteId = context.params.noteId
    const index = client.initIndex(ALGOLIA_INDEX_NAME)
    if (data) {
      data.objectID = noteId
      return index.saveObject(data)
    } else {
      return index.deleteObject(noteId)
    }
  })
