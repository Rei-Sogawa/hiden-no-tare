import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

const getNotes = async () => {
  return (
    await notesRef.orderBy('created_at', 'desc').get()
  ).docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
const getLatestNoteHistories = async () => {
  const noteSnapshot = await notesRef.orderBy('created_at', 'desc').get()
  const noteDocs = noteSnapshot.docs
  const noteHistoriesQueries = noteDocs.map((noteDoc) =>
    noteHistoriesRef
      .where('note_id', '==', noteDoc.id)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get()
  )
  const noteHistoriesSnapshots = await Promise.all(noteHistoriesQueries)
  const latestNoteHistories = noteHistoriesSnapshots.map((snapshot) => {
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  })
  return latestNoteHistories
}

export default {
  fetchNotes: async (context) => {
    context.commit('SET_NOTES', await getNotes())
  },
  fetchNoteHistories: async (context) => {
    context.commit('SET_NOTE_HISTORIES', await getLatestNoteHistories())
  },
  resetState: (context) => {
    context.commit('SET_NOTES', null)
    context.commit('SET_NOTE_HISTORIES', null)
  },
}
