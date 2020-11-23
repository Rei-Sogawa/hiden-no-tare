import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

export default {
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
}
