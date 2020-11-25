import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

export default {
  subscribeNotes: (context) => {
    const listener = notesRef
      .orderBy('created_at', 'desc')
      .onSnapshot((snapshot) => {
        const noteDocs = snapshot.docs
        const notes = noteDocs.map((doc) => ({ id: doc.id, ...doc.data() }))
        context.commit('SET_NOTES', notes)
      })
    context.commit('SET_NOTES_LISTENER', listener)
  },
  subscribeNoteHistories: (context) => {
    const listener = noteHistoriesRef
      .orderBy('created_at', 'desc')
      .onSnapshot((snapshot) => {
        const noteHistoryDocs = snapshot.docs
        const noteHistories = noteHistoryDocs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        context.commit('SET_NOTE_HISTORIES', noteHistories)
      })
    context.commit('SET_NOTE_HISTORIES_LISTENER', listener)
  },
  createNote: async (_, { title, content }) => {
    const noteRef = await notesRef.add({
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    const noteHistoryRef = await noteHistoriesRef.add({
      title,
      content,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      note_id: noteRef.id,
    })
    const noteHistoryDoc = await noteHistoryRef.get()
    return noteHistoryDoc.data().note_id
  },
  updateNote: (_, { id, title, content }) => {
    return noteHistoriesRef.add({
      title,
      content,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      note_id: id,
    })
  },
}
